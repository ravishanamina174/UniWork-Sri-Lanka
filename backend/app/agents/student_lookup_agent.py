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
    """Fetch professional profiles and join track record metrics (completed_tasks, total_earnings) from user_profiles."""
    prof_cursor = mongo_db["professional_student_workers"].find({})
    candidates = []
    
    async for doc in prof_cursor:
        clerk_id = doc.get("student_clerk_id")
        
        # Join track record metrics directly from base user_profiles collection
        base_user = await mongo_db["user_profiles"].find_one({"clerk_id": clerk_id}) or {}
        
        candidates.append({
            "student_clerk_id": clerk_id,
            "bio": doc.get("bio", ""),
            "skills": doc.get("skills", []),
            "primary_location": doc.get("primary_location", ""),
            "secondary_location": doc.get("secondary_location", ""),
            "working_hours": doc.get("working_hours", ""),
            "languages": doc.get("languages", []),
            "transportation": doc.get("transportation", ""),
            "completed_tasks": base_user.get("completed_tasks", 0),
            "total_earnings": base_user.get("total_earnings", 0.0),
        })
        
    return {"candidates": candidates}

# 3. LLM Candidate Evaluation Node
async def rank_candidates_node(state: AgentState) -> Dict[str, Any]:
    """Evaluate candidates using Gemini based on poster query requirements."""
    # Removed temperature parameter to fix the Gemini 3.6 Flash UserWarning
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.6-flash",
        google_api_key=settings.GEMINI_API_KEY
    )

    system_prompt = """You are an expert recruitment and student matching AI for the UniWorkSL platform.
Your job is to analyze task poster requirements and evaluate candidate profiles stored in our database.

CRITERIA TO MATCH:
1. Skills & Bio alignment with the requested task.
2. Location proximity (Primary/Secondary locations matching requested areas like Colombo, Moratuwa, Meepe, Pelmadulla, etc.).
3. Availability (Working Hours: Weekends, Everyday, Every weekday, etc.).
4. Transportation capability (Motorbike, Car / Van, Public Transit).
5. Track record (Completed tasks and total earnings indicate reliability).

RULES:
- ALWAYS return candidates ranked from highest to lowest fit.
- Even if no candidate is a 100% exact match, you MUST return the closest matching candidates available (at least 1 candidate if database is non-empty).
- Provide an integer `fit_score` between 1 and 100.
- Provide a concise 1-2 sentence `match_reason` explaining why they fit the query.

Return ONLY a valid JSON object matching this exact format:
{
  "matched_students": [
    {
      "student_clerk_id": "string",
      "fit_score": 90,
      "match_reason": "Clear 1-2 sentence explanation of fit..."
    }
  ]
}
Do not wrap the JSON in markdown code blocks. Output raw JSON only."""

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

    # Safely extract text from the LangChain response, handling both lists and strings
    raw_content = response.content
    if isinstance(raw_content, list):
        raw_text = "".join(block.get("text", "") if isinstance(block, dict) else str(block) for block in raw_content)
    else:
        raw_text = str(raw_content)

    raw_text = raw_text.strip()
    
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