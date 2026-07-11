import random

def verify_document_content(document_id: int, file_path: str, document_type: str):
    """
    Simulates Document Verification Agent: OCR extraction, blurry detection,
    missing page detection, type validation, and certificate detail extraction.
    """
    file_name = file_path.split("/")[-1].lower()
    
    # Simulate OCR text extraction
    ocr_texts = {
        "land document": "REGISTRATION DEED OF PLOT 45. AREA 2.5 ACRES. VERIFIED FOR EDUCATIONAL INSTITUTION USE.",
        "building plan": "BUILT-UP AREA PLAN APPROVED BY PUNE MUNICIPAL CORPORATION. CLASSROOMS: 10, LABS: 5. FIRE SAFETY COMPLIANT.",
        "faculty list": "FACULTY PROFILE LIST: RAMESH KUMAR, SUNITA DESHMUKH. ALL QUALIFICATIONS COMPLIANT.",
        "audit report": "AUDIT REPORT FOR FINANCIAL YEAR 2025-26. NET ASSETS: INR 5 CRORES. STABLE ASSET VALUE."
    }

    extracted_text = ocr_texts.get(document_type.lower(), f"DEFAULT TEXT EXTRACTED FOR {document_type.upper()}")
    
    # 1. Blur Detection
    is_blurry = "blurry" in file_name or "blur" in file_name
    blur_score = 0.95 if is_blurry else 0.05
    
    # 2. Missing Pages Detection
    is_incomplete = "short" in file_name or "missing" in file_name
    missing_pages_detected = ["Page 3", "Page 5"] if is_incomplete else []
    
    # 3. Document Type Validation
    type_matches = True
    if "land" in document_type.lower() and "building" in file_name:
        type_matches = False
        
    # 4. Certificate Details Extraction
    certificate_details = {}
    if "land" in document_type.lower():
        certificate_details = {
            "registration_no": "REG-LAND-998877",
            "plot_no": "Plot 45, Sector 4",
            "area_acres": 2.5,
            "owner": "Maharashtra Institute of Technology"
        }
    elif "building" in document_type.lower():
        certificate_details = {
            "approval_no": "BMC-BUILD-5544",
            "approved_by": "Municipal Corporation",
            "total_area_sqm": 2500
        }

    status = "VERIFIED"
    feedback = "All checks passed successfully."
    
    if is_blurry:
        status = "BLURRY"
        feedback = "The uploaded file is blurry. Please upload a high-resolution scanned copy."
    elif is_incomplete:
        status = "SUSPICIOUS"
        feedback = f"Missing pages detected: {', '.join(missing_pages_detected)}."
    elif not type_matches:
        status = "SUSPICIOUS"
        feedback = f"Uploaded document does not match the requested type: {document_type}."

    return {
        "documentId": document_id,
        "status": status,
        "feedback": feedback,
        "ocrText": extracted_text,
        "details": {
            "blurScore": blur_score,
            "missingPages": missing_pages_detected,
            "typeValidationPassed": type_matches,
            "extractedMetadata": certificate_details
        }
    }
