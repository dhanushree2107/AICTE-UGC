import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# Import agents
from app.agents.document_agent import verify_document_content
from app.agents.eligibility_agent import validate_application_eligibility
from app.agents.compliance_agent import check_application_compliance
from app.agents.risk_agent import assess_application_risk
from app.agents.approval_agent import generate_approval_recommendation
from app.agents.helpdesk_agent import get_helpdesk_reply

app = FastAPI(title="AICTE UG AI Services Agent", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DocumentVerificationRequest(BaseModel):
    documentId: int
    filePath: str
    documentType: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[list] = []

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "AICTE-UG AI Agent Service"}

# A. Document Verification Agent Endpoint
@app.post("/api/ai/verify-document")
def verify_document(req: DocumentVerificationRequest):
    return verify_document_content(req.documentId, req.filePath, req.documentType)

# B. Eligibility Validation Agent Endpoint
@app.post("/api/ai/validate-eligibility")
def validate_eligibility(applicationId: int):
    return validate_application_eligibility(applicationId)

# C. Compliance Agent Endpoint
@app.post("/api/ai/check-compliance")
def check_compliance(applicationId: int):
    return check_application_compliance(applicationId)

# D. Risk Assessment Agent Endpoint
@app.post("/api/ai/assess-risk")
def assess_risk(applicationId: int):
    return assess_application_risk(applicationId)

# E. Approval Recommendation Agent Endpoint
@app.post("/api/ai/approval-recommendation")
def approval_recommendation(applicationId: int):
    return generate_approval_recommendation(applicationId)

# F. AI Help Desk HTTP chat endpoint
@app.post("/api/ai/helpdesk/chat")
def chat_helpdesk(req: ChatRequest):
    reply = get_helpdesk_reply(req.message, req.history)
    return {"reply": reply}

# F. AI Help Desk WebSocket endpoint for live chat support
@app.websocket("/api/ai/helpdesk/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            reply = get_helpdesk_reply(data, [])
            await websocket.send_text(reply)
    except WebSocketDisconnect:
        print("Client disconnected from WebSocket Helpdesk")
