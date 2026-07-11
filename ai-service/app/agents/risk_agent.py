def assess_application_risk(application_id: int):
    """
    Simulates Risk Assessment Agent:
    Checks for dual-faculty registrations (e.g., Aadhaar/PAN duplication across institutes) and financial anomalies.
    """
    if application_id % 2 == 1:
        risk_score = 12.0 # Low risk
        risk_level = "LOW"
        patterns_detected = []
    else:
        risk_score = 78.5 # High risk
        risk_level = "HIGH"
        patterns_detected = [
            "Faculty duplication: Aadhaar '123456789012' (Dr. Ramesh Kumar) is registered in another institute in Delhi.",
            "Location proximity: GPS coordinates overlap with another already-approved institution within 50 meters."
        ]

    return {
        "applicationId": application_id,
        "riskScore": risk_score,
        "riskLevel": risk_level,
        "anomalies": patterns_detected
    }
