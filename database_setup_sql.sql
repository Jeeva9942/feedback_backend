-- RUN THIS IN SUPABASE SQL EDITOR
-- This setup is specifically for the CT (Computer Technology) department.

-- 1. Student Table for CT
CREATE TABLE IF NOT EXISTS public."CT" (
    rollno VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(50) DEFAULT 'CT',
    status BOOLEAN DEFAULT FALSE, -- FALSE = Not Submitted, TRUE = Submitted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Feedback Log Table (Individual responses for CT)
CREATE TABLE IF NOT EXISTS public.ct_feedback_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    roll_no VARCHAR(20) REFERENCES public."CT"(rollno),
    student_name VARCHAR(255) NOT NULL,
    answers JSONB NOT NULL,
    strengths TEXT,
    improvements TEXT,
    general_strengths TEXT,
    general_improvements TEXT,
    general_admin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Aggregate Feedback Table (For Reports, specifically for CT)
-- This stores the tally/counts for each question rating.
CREATE TABLE IF NOT EXISTS public.ct_feedback (
    id SERIAL PRIMARY KEY,
    "S.No" INTEGER,
    "COMMENT" VARCHAR(255),
    "Very Good (4)" INTEGER DEFAULT 0,
    "Good (3)" INTEGER DEFAULT 0,
    "Average (2)" INTEGER DEFAULT 0,
    "Below Average (1)" INTEGER DEFAULT 0,
    "Total Count (0)" INTEGER DEFAULT 0
);

-- 4. Initialize Aggregate Data at 0 (A1-A24, B1-B9, C1-C9)
-- Section A: Facilities (1-24)
INSERT INTO public.ct_feedback ("S.No", "COMMENT") VALUES 
(1, 'A1'), (2, 'A2'), (3, 'A3'), (4, 'A4'), (5, 'A5'), (6, 'A6'), (7, 'A7'), (8, 'A8'), (9, 'A9'), (10, 'A10'),
(11, 'A11'), (12, 'A12'), (13, 'A13'), (14, 'A14'), (15, 'A15'), (16, 'A16'), (17, 'A17'), (18, 'A18'), (19, 'A19'), (20, 'A20'),
(21, 'A21'), (22, 'A22'), (23, 'A23'), (24, 'A24')
ON CONFLICT (id) DO NOTHING;

-- Section B: Students Participation (9 Questions)
INSERT INTO public.ct_feedback ("S.No", "COMMENT") VALUES 
(25, 'B1'), (26, 'B2'), (27, 'B3'), (28, 'B4'), (29, 'B5'), (30, 'B6'), (31, 'B7'), (32, 'B8'), (33, 'B9')
ON CONFLICT (id) DO NOTHING;

-- Section C: Assessment of Accomplishment (9 Questions)
INSERT INTO public.ct_feedback ("S.No", "COMMENT") VALUES 
(34, 'C1'), (35, 'C2'), (36, 'C3'), (37, 'C4'), (38, 'C5'), (39, 'C6'), (40, 'C7'), (41, 'C8'), (42, 'C9')
ON CONFLICT (id) DO NOTHING;

-- 5. Permissions
GRANT ALL ON TABLE public."CT" TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.ct_feedback_log TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.ct_feedback TO anon, authenticated, service_role;
