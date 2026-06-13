from datetime import datetime
from typing import List, Dict, Any, Optional

def create_gig_metadata_document(
    gig_id: str, 
    description_raw: str, 
    skill_matrix_tags: List[str], 
    agent_logs: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Generates standard schema shapes for insertion into MongoDB 'gig_metadata' collection.
    """
    return {
        "_id": gig_id,
        "description_raw": description_raw,
        "skill_matrix_tags": skill_matrix_tags,
        "agent_analysis": {
            "inflation_adjusted_price_suggestion": 0.0,
            "processed_by_ingestion_agent": False
        },
        "chat_sessions_root": [],
        "agent_logs": agent_logs or [{"timestamp": datetime.utcnow(), "event": "DOCUMENT_INITIALIZED"}],
        "created_at": datetime.utcnow()
    }