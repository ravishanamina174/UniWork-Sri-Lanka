import json
from typing import List, Dict, Any, TypedDict
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings
from app.core.database import mongo_db

# 1. Define Agent State
class AgentState(TypedDict):
    poster_query: str
    limit: int
    candidates: List[Dict[str, Any]]
    ranking_output: Dict[str, Any]

# 2. Candidate Retrieval Node
async def fetch_candidates_node(state: AgentState) -> Dict[str, Any]:
    """Fetch all registered professional worker profiles from MongoDB."""
    cursor = mongo_db["professional_student_workers"].find({})
    candidates = []
    
    async for doc in cursor:
        candidates.append({
            "student_clerk_id": doc.get("student_clerk_id"),
            "display_name": doc.get("display_name"),
            "bio": doc.get("bio", ""),
            "skills": doc.get("skills", []),
            "primary_location": doc.get("primary_location", ""),
            "secondary_location": doc.get("secondary_location", ""),
            "working_hours": doc.get("working_hours", ""),
            "languages": doc.get("languages", []),
            "transportation": doc.get("transportation", ""),
            "completed_tasks": doc.get("completed_tasks", 0),
            "total_earnings": doc.get("total_earnings", 0.0),
        })
        
    return {"candidates": candidates}

# 3. LLM Candidate Evaluation Node
async def rank_candidates_node(state: AgentState) -> Dict[str, Any]:
    """Evaluate candidates using Gemini based on poster query requirements."""
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=settings.GEMINI_API_KEY,
        temperature=0.2
    )

    system_prompt = """You are an expert recruitment and student matching AI for UniWorkSL freelancing platform in Sri Lanka.
Your job is to analyze task poster requirements and evaluate candidate profiles stored in our database.

CRITERIA TO MATCH:
1. Skills & Bio alignment with the requested task.
2. Location proximity (Primary/Secondary locations matching requested areas like Colombo, Moratuwa, etc.).
3. Availability (Working Hours: Weekends, After 5 PM, etc.).
4. Transportation capability (Motorbike vs Public Transit).
5. Track record (Completed tasks and earnings indicate reliability).

Return ONLY a valid JSON object matching this exact format:
{
  "matched_students": [
    {
      "student_clerk_id": "string",
      "display_name": "string",
      "fit_score": 95,
      "match_reason": "Clear 1-2 sentence explanation of why this student is a great fit.",
      "primary_location": "string",
      "secondary_location": "string or null",
      "skills": ["skill1", "skill2"],
      "working_hours": "string",
      "transportation": "string",
      "completed_tasks": 5,
      "total_earnings": 15000.0
    }
  ]
}
Do not wrap the JSON in markdown code fences (```json). Output raw JSON only.
"""

    user_prompt = f"""
POSTER REQUIREMENT QUERY:
"{state['poster_query']}"

MAX RESULTS TO RETURN: {state['limit']}

CANDIDATES DATA:
{json.dumps(state['candidates'], indent=2)}
"""

    response = await llm.ainvoke([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ])

    raw_text = response.content.strip()
    
    # Strip markdown quotes if LLM added them
    if raw_text.startswith("```"):
        raw_text = raw_text.split("```")[1]
        if raw_text.startswith("json"):
            raw_text = raw_text[4:]
        raw_text = raw_text.strip()

    try:
        parsed_result = json.loads(raw_text)
    except Exception:
        parsed_result = {"matched_students": []}

    return {"ranking_output": parsed_result}

# 4. Build LangGraph Workflow
builder = StateGraph(AgentState)
builder.add_node("fetch_candidates", fetch_candidates_node)
builder.add_node("rank_candidates", rank_candidates_node)

builder.set_entry_point("fetch_candidates")
builder.add_edge("fetch_candidates", "rank_candidates")
builder.add_edge("rank_candidates", END)

student_lookup_graph = builder.compile()

# 5. Pipeline Execution Wrapper
async def run_student_lookup_agent(poster_query: str, limit: int = 5) -> Dict[str, Any]:
    initial_state: AgentState = {
        "poster_query": poster_query,
        "limit": limit,
        "candidates": [],
        "ranking_output": {}
    }
    
    final_state = await student_lookup_graph.ainvoke(initial_state)
    return {
        "total_analyzed": len(final_state.get("candidates", [])),
        "results": final_state.get("ranking_output", {}).get("matched_students", [])
    }