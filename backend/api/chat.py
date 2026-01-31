from fastapi import APIRouter
from pydantic import BaseModel
from services.chatbot_rag import chatbot
import uuid

router = APIRouter()

class ChatMessage(BaseModel):
    message: str
    session_id: str = None

@router.post("/api/chat/message")
async def send_message(data: ChatMessage):
    session_id = data.session_id or str(uuid.uuid4())
    response = await chatbot.get_response(data.message, session_id)
    
    return {
        "session_id": session_id,
        "message": response["answer"],
        "sources": response["sources"]
    }
