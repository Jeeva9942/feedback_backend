-- REDESIGNED DATABASE SCHEMA FOR CT DEPARTMENT
-- Run this in your Supabase SQL Editor

-- 1. DROP EXISTING TABLES TO START FRESH (CAUTION: Deletes data)
DROP TABLE IF EXISTS public.ct_feedback;
DROP TABLE IF EXISTS public.ct_feedback_log;

-- 2. CREATE STUDENT TABLE (If not already there)
CREATE TABLE IF NOT EXISTS public."CT" (
    rollno VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(50) DEFAULT 'CT',
    status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREATE INDIVIDUAL FEEDBACK LOG TABLE
-- Stores every single response with JSON answers and text comments
CREATE TABLE public.ct_feedback_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    roll_no VARCHAR(20) REFERENCES public."CT"(rollno),
    student_name VARCHAR(255) NOT NULL,
    department VARCHAR(50) DEFAULT 'CT',
    answers JSONB NOT NULL,
    strengths TEXT,
    improvements TEXT,
    general_strengths TEXT,
    general_improvements TEXT,
    general_admin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CREATE AGGREGATE FEEDBACK TABLE (The Counting Table)
-- Redesigned for easier reporting and direct mapping from the form
CREATE TABLE public.ct_feedback (
    id SERIAL PRIMARY KEY,
    question_code VARCHAR(10) UNIQUE, -- e.g., 'A1', 'B1', 'C1'
    category VARCHAR(50),             -- e.g., 'Facilities', 'Participation', 'Accomplishment'
    criteria TEXT,                    -- The actual question text
    very_good_4 INTEGER DEFAULT 0,
    good_3 INTEGER DEFAULT 0,
    average_2 INTEGER DEFAULT 0,
    below_average_1 INTEGER DEFAULT 0,
    total_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. INITIALIZE ALL 42 QUESTIONS WITH ZERO COUNTS
-- This ensures the logic can find the rows to increment them.

-- A: Facilities (1-24)
INSERT INTO public.ct_feedback (question_code, category, criteria) VALUES
('A1', 'Facilities', 'Infrastructure Facility'),
('A2', 'Facilities', 'Library Facility'),
('A3', 'Facilities', 'Drinking Water Facility'),
('A4', 'Facilities', 'Canteen Facility'),
('A5', 'Facilities', 'Transport Facility'),
('A6', 'Facilities', 'Sport Facility'),
('A7', 'Facilities', 'Internet Facility'),
('A8', 'Facilities', 'Hostel Facility'),
('A9', 'Facilities', 'Banking Facility/ATM'),
('A10', 'Facilities', 'Quality of Teaching and Learning'),
('A11', 'Facilities', 'Laboratory Facilities'),
('A12', 'Facilities', 'Industrial Visit'),
('A13', 'Facilities', 'Guest Lecture'),
('A14', 'Facilities', 'Career Guidance / Placement Training'),
('A15', 'Facilities', 'Campus Environment'),
('A16', 'Facilities', 'Toilet Facility (Cleanliness)'),
('A17', 'Facilities', 'Stationary Store Facility'),
('A18', 'Facilities', 'Medical Health Centre'),
('A19', 'Facilities', 'Fitness Centre Facility'),
('A20', 'Facilities', 'Meditation / Yoga Centre Facility'),
('A21', 'Facilities', 'Industrial Collaboration (MoU)'),
('A22', 'Facilities', 'College Office for Information'),
('A23', 'Facilities', 'Availability of Scholarship Facilities'),
('A24', 'Facilities', 'Parking Facilities');

-- B: Students Participation (1-9)
INSERT INTO public.ct_feedback (question_code, category, criteria) VALUES
('B1', 'Participation', 'Did you participate in Sports events?'),
('B2', 'Participation', 'Did you participate in Seminar?'),
('B3', 'Participation', 'Did you participate in Workshop?'),
('B4', 'Participation', 'Are you did any Industry Project?'),
('B5', 'Participation', 'Are you member in Students Guild of Service (SGS)?'),
('B6', 'Participation', 'Are you a NSS Volunteer?'),
('B7', 'Participation', 'Have you received any scholarships during the study?'),
('B8', 'Participation', 'Did you attend any certified courses inside the campus (Swelect, Bosch, 3D Modeling, etc.)?'),
('B9', 'Participation', 'Do you attend any awareness program?');

-- C: Accomplishment (1-9)
INSERT INTO public.ct_feedback (question_code, category, criteria) VALUES
('C1', 'Accomplishment', 'Basic and Discipline specific knowledge'),
('C2', 'Accomplishment', 'Problem analysis'),
('C3', 'Accomplishment', 'Design/development of solutions'),
('C4', 'Accomplishment', 'Engineering Tools, Experimentation and Testing'),
('C5', 'Accomplishment', 'Engineering practices for society, sustainability and environment'),
('C6', 'Accomplishment', 'Project Management'),
('C7', 'Accomplishment', 'Life-long learning'),
('C8', 'Accomplishment', 'Program Specific Outcome (PSO1)'),
('C9', 'Accomplishment', 'Program Specific Outcome (PSO2)');

-- 6. PERMISSIONS
GRANT ALL ON TABLE public."CT" TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.ct_feedback_log TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.ct_feedback TO anon, authenticated, service_role;
