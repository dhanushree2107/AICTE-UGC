-- PostgreSQL Schema & Seed Data for AICTE UG Approval System

-- 1. Tables Creation

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY, -- Keycloak User UUID or username matching
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS institutes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    website VARCHAR(100),
    established_year INT,
    institution_type VARCHAR(50), -- Govt, Govt-Aided, Self-Financing
    created_by VARCHAR(100) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    institute_id INT REFERENCES institutes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS ug_programs (
    id SERIAL PRIMARY KEY,
    department_id INT REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g. Computer Science and Engineering
    intake_capacity INT NOT NULL,
    duration_years INT DEFAULT 4,
    nba_accreditation_status VARCHAR(50) DEFAULT 'Not Accredited'
);

CREATE TABLE IF NOT EXISTS faculty (
    id SERIAL PRIMARY KEY,
    department_id INT REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(100) NOT NULL, -- Professor, Associate Professor, Assistant Professor
    qualification VARCHAR(255) NOT NULL, -- Ph.D, M.Tech
    aadhaar_no VARCHAR(12) UNIQUE,
    pan_no VARCHAR(10) UNIQUE,
    experience_years INT NOT NULL,
    date_of_joining DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS infrastructure (
    id SERIAL PRIMARY KEY,
    institute_id INT REFERENCES institutes(id) ON DELETE CASCADE,
    room_type VARCHAR(100) NOT NULL, -- Class Room, Seminar Hall, Lab, Computer Center, Library
    area_sq_m DOUBLE PRECISION NOT NULL,
    capacity INT,
    wifi_enabled BOOLEAN DEFAULT TRUE,
    projector_enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    ref_no VARCHAR(100) UNIQUE NOT NULL,
    institute_id INT REFERENCES institutes(id) ON DELETE CASCADE,
    academic_year VARCHAR(10) NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    overall_status VARCHAR(50) DEFAULT 'SUBMITTED', -- SUBMITTED, UNDER_OCR, INSPECTION_SCHEDULED, REJECTED, APPROVED, CLARIFICATION_REQUIRED
    ai_eligibility_score DOUBLE PRECISION,
    ai_risk_score DOUBLE PRECISION,
    ai_recommendation VARCHAR(50),
    ai_reasons TEXT
);

CREATE TABLE IF NOT EXISTS application_status (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    remarks VARCHAR(500),
    updated_by VARCHAR(100) REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- Land Document, Building Plan, Faculty List, Audit Report
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100),
    file_size INT,
    ocr_extracted_text TEXT,
    ai_verification_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, VERIFIED, SUSPICIOUS, BLURRY
    ai_feedback VARCHAR(500),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inspections (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    scheduled_date TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'SCHEDULED', -- SCHEDULED, COMPLETED, CANCELLED
    committee_members TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inspection_reports (
    id SERIAL PRIMARY KEY,
    inspection_id INT REFERENCES inspections(id) ON DELETE CASCADE,
    submitted_by VARCHAR(100) REFERENCES users(id),
    deficiencies_found TEXT,
    infrastructure_score DOUBLE PRECISION,
    faculty_score DOUBLE PRECISION,
    recommended BOOLEAN,
    remarks TEXT,
    report_file_path VARCHAR(500),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS approvals (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    approved_by VARCHAR(100) REFERENCES users(id),
    decision VARCHAR(20) NOT NULL, -- APPROVED, REJECTED, CLARIFICATION
    remarks TEXT,
    approval_order_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100),
    action VARCHAR(255) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notices (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    file_path VARCHAR(500),
    publish_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Seed Data Injection

-- Insert Roles
INSERT INTO roles (name, description) VALUES
('ROLE_SUPER_ADMIN', 'Super Administrator'),
('ROLE_AICTE_ADMIN', 'AICTE Admin Officer'),
('ROLE_REGIONAL_OFFICER', 'Regional Approving Authority'),
('ROLE_REVIEWER', 'Application Document Reviewer'),
('ROLE_INSPECTION_COMMITTEE', 'Inspection Committee Inspector'),
('ROLE_COLLEGE_ADMIN', 'College Representative')
ON CONFLICT (name) DO NOTHING;

-- Insert Seed Users (Mock UUIDs corresponding to Keycloak accounts or general testing)
INSERT INTO users (id, username, email, first_name, last_name, enabled) VALUES
('superadmin', 'superadmin', 'superadmin@aicte-india.org', 'System', 'Admin', true),
('aicteadmin', 'aicteadmin', 'admin@aicte-india.org', 'AICTE', 'Officer', true),
('collegeadmin', 'collegeadmin', 'admin@mit.edu', 'Mit', 'Registrar', true),
('reviewer', 'reviewer', 'reviewer@aicte-india.org', 'Reviewer', 'Expert', true)
ON CONFLICT (id) DO NOTHING;

-- Map User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
('superadmin', 1),
('aicteadmin', 2),
('collegeadmin', 6),
('reviewer', 4)
ON CONFLICT DO NOTHING;

-- Insert Sample Institutes
INSERT INTO institutes (name, address, state, district, pin_code, email, phone, website, established_year, institution_type, created_by) VALUES
('Maharashtra Institute of Technology', 'Kothrud, Pune', 'Maharashtra', 'Pune', '411038', 'info@mitpune.edu.in', '020-25431791', 'https://mitpune.edu.in', 1983, 'Self-Financing', 'collegeadmin'),
('Delhi Technological University', 'Shahbad Daulatpur, Bawana Road, Delhi', 'Delhi', 'North West Delhi', '110042', 'registrar@dtu.ac.in', '011-27871018', 'http://www.dtu.ac.in', 1941, 'Govt', 'superadmin')
ON CONFLICT DO NOTHING;

-- Insert Departments
INSERT INTO departments (institute_id, name, description) VALUES
(1, 'Computer Engineering', 'Department of Computer Science & Engineering'),
(1, 'Electronics & Telecommunication', 'Department of Electronics & Communication Engineering'),
(2, 'Information Technology', 'Department of Information Technology')
ON CONFLICT DO NOTHING;

-- Insert UG Programs
INSERT INTO ug_programs (department_id, name, intake_capacity, duration_years, nba_accreditation_status) VALUES
(1, 'B.Tech Computer Engineering', 180, 4, 'Accredited'),
(2, 'B.Tech Electronics & Telecommunication Engineering', 120, 4, 'Not Accredited'),
(3, 'B.Tech Information Technology', 120, 4, 'Accredited')
ON CONFLICT DO NOTHING;

-- Insert Faculty members
INSERT INTO faculty (department_id, name, designation, qualification, aadhaar_no, pan_no, experience_years, date_of_joining) VALUES
(1, 'Dr. Ramesh Kumar', 'Professor', 'Ph.D in CS', '123456789012', 'ABCDE1234F', 22, '2010-06-15'),
(1, 'Prof. Sunita Deshmukh', 'Associate Professor', 'M.Tech', '987654321098', 'XYZWP5678Q', 12, '2015-07-20'),
(2, 'Dr. Anil Sharma', 'Assistant Professor', 'Ph.D in ECE', '456789012345', 'QWERT9876A', 6, '2020-01-05')
ON CONFLICT DO NOTHING;

-- Insert Infrastructure
INSERT INTO infrastructure (institute_id, room_type, area_sq_m, capacity, wifi_enabled, projector_enabled) VALUES
(1, 'Class Room CR-101', 66.5, 60, true, true),
(1, 'Computer Lab CL-01', 120.0, 40, true, true),
(1, 'Library Hall', 400.0, 150, true, false),
(2, 'Smart Class Room CR-201', 75.0, 70, true, true)
ON CONFLICT DO NOTHING;

-- Insert Notices & Circulars
INSERT INTO notices (title, content, file_path, publish_date) VALUES
('AICTE Approval Process Handbook 2026-27', 'The Approval Process Handbook (APH) outlines rules for establishing and running UG programs.', '/documents/notices/aph_2026_27.pdf', '2026-06-01'),
('Extension of Last Date for UG Application Submission', 'AICTE has extended the last date for submitting approval requests to July 31, 2026.', '/documents/notices/date_extension.pdf', '2026-07-01'),
('Guidelines for Hybrid Inspections', 'New directives for conducting digital-cum-physical peer inspections for UG institutes.', NULL, '2026-07-05')
ON CONFLICT DO NOTHING;

-- Insert Sample Applications
INSERT INTO applications (ref_no, institute_id, academic_year, submission_date, overall_status, ai_eligibility_score, ai_risk_score, ai_recommendation, ai_reasons) VALUES
('AICTE-2026-MITP-001', 1, '2026-27', '2026-07-02 11:30:00', 'SUBMITTED', 92.5, 12.0, 'Approve', 'High faculty ratio (1:15), sufficient built-up area (652 sqm), all land documents verified.')
ON CONFLICT DO NOTHING;

INSERT INTO application_status (application_id, status, remarks, updated_by) VALUES
(1, 'SUBMITTED', 'Application submitted successfully. Under OCR Document verification.', 'collegeadmin')
ON CONFLICT DO NOTHING;
