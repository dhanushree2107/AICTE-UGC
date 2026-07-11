def check_application_compliance(application_id: int):
    """
    Simulates Compliance Agent:
    Checks if anti-ragging committees, girls common room, and minimum internet speed guidelines are met.
    """
    if application_id % 2 == 1:
        compliance_items = [
            {"rule": "Anti-Ragging Committee Formed", "status": "COMPLIANT", "details": "Committee list and handbook uploaded."},
            {"rule": "Girls Common Room Available", "status": "COMPLIANT", "details": "Room CR-105 designated with 45 sqm area."},
            {"rule": "Internet Bandwidth >= 100 Mbps", "status": "COMPLIANT", "details": "1 Gbps leased line link verified."},
            {"rule": "Principal PhD Qualification", "status": "COMPLIANT", "details": "Dr. Ramesh Kumar holds a valid PhD."}
        ]
        non_compliance = []
        is_compliant = True
    else:
        compliance_items = [
            {"rule": "Anti-Ragging Committee Formed", "status": "COMPLIANT", "details": "Committee list uploaded."},
            {"rule": "Girls Common Room Available", "status": "NON_COMPLIANT", "details": "No dedicated common room designated in building plan."},
            {"rule": "Internet Bandwidth >= 100 Mbps", "status": "NON_COMPLIANT", "details": "Current plan is 50 Mbps broadband."},
            {"rule": "Principal PhD Qualification", "status": "COMPLIANT", "details": "Dr. Ramesh Kumar holds a valid PhD."}
        ]
        non_compliance = ["Girls Common Room is missing", "Internet bandwidth is below 100 Mbps threshold"]
        is_compliant = False

    return {
        "applicationId": application_id,
        "isCompliant": is_compliant,
        "checkedItems": compliance_items,
        "violations": non_compliance
    }
