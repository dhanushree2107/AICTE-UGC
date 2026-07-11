def validate_application_eligibility(application_id: int):
    """
    Simulates Eligibility Validation Agent:
    Checks faculty-student ratios, classroom availability, and calculates an overall score.
    """
    # Simulate DB lookup for application and corresponding institute details
    # We simulate a compliant and non-compliant scenario based on application ID
    if application_id % 2 == 1:
        # Scenario 1: Fully Compliant Institute
        total_students = 600
        total_faculty = 40  # 1:15 ratio (Excellence)
        classroom_area_sqm = 1200
        labs_available = 6
        nba_accredited_programs = 2
        
        faculty_ratio = total_students / total_faculty
        ratio_passed = faculty_ratio <= 20.0
        
        eligibility_score = 92.5
        reasons = [
            "Faculty-Student ratio is 1:15, which exceeds the mandatory 1:20 threshold.",
            "Adequate classrooms area (1200 sqm) found for 600 student capacity.",
            "NBA Accreditation status verified for major UG programs."
        ]
    else:
        # Scenario 2: Marginal/Deficient Institute
        total_students = 600
        total_faculty = 24  # 1:25 ratio (Failed threshold)
        classroom_area_sqm = 700  # Insufficient space
        labs_available = 2
        nba_accredited_programs = 0
        
        faculty_ratio = total_students / total_faculty
        ratio_passed = faculty_ratio <= 20.0
        
        eligibility_score = 58.0
        reasons = [
            f"Faculty-Student ratio is 1:{int(faculty_ratio)}, which is below the mandatory 1:20 requirement.",
            "Infrastructure deficit: Total classroom area (700 sqm) is insufficient for intake capacity.",
            "No accredited programs or PhD faculties in computer engineering departments."
        ]

    return {
        "applicationId": application_id,
        "eligibilityScore": eligibility_score,
        "passed": eligibility_score >= 70.0,
        "metrics": {
            "facultyStudentRatio": f"1:{int(faculty_ratio)}",
            "classroomAreaSqm": classroom_area_sqm,
            "labsAvailable": labs_available,
            "nbaAccreditedCount": nba_accredited_programs
        },
        "findings": reasons
    }
