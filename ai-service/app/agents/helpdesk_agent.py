def get_helpdesk_reply(message: str, history: list) -> str:
    """
    Simulates AI Help Desk Agent:
    Answering FAQs about approval guidelines, deadline dates, and document upload requirements.
    """
    msg = message.lower()
    
    if "deadline" in msg or "last date" in msg or "dates" in msg:
        return (
            "The deadline for submitting the AICTE UG approval application for the "
            "academic year 2026-27 is July 31, 2026. Late submittals are not permitted."
        )
    elif "ratio" in msg or "faculty" in msg:
        return (
            "For undergraduate courses in Engineering & Technology, the mandatory "
            "faculty-to-student ratio is 1:20. The principal must hold a PhD degree."
        )
    elif "infrastructure" in msg or "area" in msg or "classroom" in msg:
        return (
            "As per the approval process guidelines, each standard classroom must have "
            "a minimum area of 66 square meters, and computer laboratories must have "
            "a minimum of 120 square meters with WiFi and projectors enabled."
        )
    elif "document" in msg or "upload" in msg or "ocr" in msg:
        return (
            "You need to upload: 1. Land Registration documents, 2. Building plans, "
            "3. Faculty details, and 4. Financial audit reports. Files must be PDFs "
            "below 10MB and have high contrast/clarity to pass the AI OCR checks."
        )
    elif "status" in msg or "track" in msg:
        return (
            "You can track your application status on the public portal using your "
            "8-digit reference code (e.g., AICTE-2026-XXXX). Enter the code on the "
            "'Track Application' page."
        )
    elif "help" in msg or "hello" in msg or "hi" in msg:
        return (
            "Hello! I am the AICTE Help Desk Assistant. I can guide you with "
            "deadlines, infrastructure criteria, faculty ratios, document checklists, "
            "and help you track your application. What can I help you with today?"
        )
    else:
        return (
            "I understand you are asking about: '" + message + "'. Please refer to the "
            "AICTE Approval Process Handbook (2026-27) or specify if you need help with "
            "faculty ratios, classroom requirements, deadlines, or document uploads."
        )
