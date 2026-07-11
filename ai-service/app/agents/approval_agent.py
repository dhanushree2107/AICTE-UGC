from app.agents.eligibility_agent import validate_application_eligibility
from app.agents.compliance_agent import check_application_compliance
from app.agents.risk_agent import assess_application_risk

def generate_approval_recommendation(application_id: int):
    """
    Simulates Approval Recommendation Agent:
    Aggregates findings from document verification, compliance, eligibility, and risk scoring to generate final feedback.
    """
    eligibility = validate_application_eligibility(application_id)
    compliance = check_application_compliance(application_id)
    risk = assess_application_risk(application_id)

    eligibility_passed = eligibility["passed"]
    is_compliant = compliance["isCompliant"]
    risk_score = risk["riskScore"]

    if eligibility_passed and is_compliant and risk_score < 30.0:
        recommendation = "APPROVE"
        confidence_score = 94.0
        reasons = (
            "The institute satisfies the faculty-student ratio of 1:15, "
            "meets all critical compliance checklist criteria, and has no flagged risk anomalies."
        )
    elif risk_score >= 70.0:
        recommendation = "REJECT"
        confidence_score = 88.0
        reasons = (
            f"Suspicious faculty duplication detected during risk evaluation. "
            f"Anomalies: {', '.join(risk['anomalies'])}."
        )
    else:
        recommendation = "CLARIFICATION_REQUIRED"
        confidence_score = 75.0
        reasons = (
            f"Violations found: {', '.join(compliance['violations'])}. "
            "Clarifications needed regarding the building dimensions and internet plan."
        )

    return {
        "applicationId": application_id,
        "recommendation": recommendation,
        "confidenceScore": confidence_score,
        "reasons": reasons,
        "details": {
            "eligibilityScore": eligibility["eligibilityScore"],
            "riskScore": risk_score,
            "complianceStatus": "COMPLIANT" if is_compliant else "NON_COMPLIANT"
        }
    }
