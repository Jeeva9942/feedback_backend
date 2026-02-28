const departments = ['CIVIL', 'MECH', 'EEE', 'ECE', 'CSE', 'IT', 'CT', 'ICE'];

let sql = `-- FULL DATABASE SCHEMA FOR ALL DEPARTMENTS
-- Run this in your Supabase SQL Editor

`;

// Student tables and logs
departments.forEach(dept => {
    sql += `-- --- ${dept} ---
CREATE TABLE IF NOT EXISTS public."${dept.toUpperCase()}" (
    rollno VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(50) DEFAULT '${dept}',
    status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.${dept.toLowerCase()}_feedback_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    roll_no VARCHAR(20),
    student_name VARCHAR(255),
    department VARCHAR(50) DEFAULT '${dept}',
    answers JSONB NOT NULL,
    strengths TEXT,
    improvements TEXT,
    general_strengths TEXT,
    general_improvements TEXT,
    general_admin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.${dept.toLowerCase()}_feedback (
    id SERIAL PRIMARY KEY,
    question_code VARCHAR(10) UNIQUE,
    category VARCHAR(50),
    criteria TEXT,
    very_good_4 INTEGER DEFAULT 0,
    good_3 INTEGER DEFAULT 0,
    average_2 INTEGER DEFAULT 0,
    below_average_1 INTEGER DEFAULT 0,
    total_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initialize Aggregate Data for ${dept}
INSERT INTO public.${dept.toLowerCase()}_feedback (question_code, category, criteria) VALUES
('A1', 'Facilities', 'Infrastructure Facility'), ('A2', 'Facilities', 'Library Facility'), ('A3', 'Facilities', 'Drinking Water Facility'), ('A4', 'Facilities', 'Canteen Facility'), ('A5', 'Facilities', 'Transport Facility'), ('A6', 'Facilities', 'Sport Facility'), ('A7', 'Facilities', 'Internet Facility'), ('A8', 'Facilities', 'Hostel Facility'), ('A9', 'Facilities', 'Banking Facility/ATM'), ('A10', 'Facilities', 'Quality of Teaching and Learning'), ('A11', 'Facilities', 'Laboratory Facilities'), ('A12', 'Facilities', 'Industrial Visit'), ('A13', 'Facilities', 'Guest Lecture'), ('A14', 'Facilities', 'Career Guidance / Placement Training'), ('A15', 'Facilities', 'Campus Environment'), ('A16', 'Facilities', 'Toilet Facility (Cleanliness)'), ('A17', 'Facilities', 'Stationary Store Facility'), ('A18', 'Facilities', 'Medical Health Centre'), ('A19', 'Facilities', 'Fitness Centre Facility'), ('A20', 'Facilities', 'Meditation / Yoga Centre Facility'), ('A21', 'Facilities', 'Industrial Collaboration (MoU)'), ('A22', 'Facilities', 'College Office for Information'), ('A23', 'Facilities', 'Availability of Scholarship Facilities'), ('A24', 'Facilities', 'Parking Facilities'),
('B1', 'Participation', 'Sports Events Participation'), ('B2', 'Participation', 'Seminar Participation'), ('B3', 'Participation', 'Workshop Participation'), ('B4', 'Participation', 'Industrial Projects'), ('B5', 'Participation', 'Students Guild of Service (SGS) Membership'), ('B6', 'Participation', 'NSS Volunteer Status'), ('B7', 'Participation', 'Scholarship Benefits'), ('B8', 'Participation', 'Certified Courses'), ('B9', 'Participation', 'Awareness Programs'),
('C1', 'Accomplishment', 'Basic Knowledge'), ('C2', 'Accomplishment', 'Problem Analysis'), ('C3', 'Accomplishment', 'Design Solutions'), ('C4', 'Accomplishment', 'Engineering Tools'), ('C5', 'Accomplishment', 'Society and Sustainability'), ('C6', 'Accomplishment', 'Project Management'), ('C7', 'Accomplishment', 'Life-long Learning'), ('C8', 'Accomplishment', 'PSO1'), ('C9', 'Accomplishment', 'PSO2')
ON CONFLICT (question_code) DO NOTHING;

GRANT ALL ON TABLE public."${dept.toUpperCase()}" TO service_role;
GRANT ALL ON TABLE public.${dept.toLowerCase()}_feedback_log TO service_role;
GRANT ALL ON TABLE public.${dept.toLowerCase()}_feedback TO service_role;

`;
});

// Add Unified View for Login and Logs
sql += `-- --- UNIFIED VIEWS ---
CREATE OR REPLACE VIEW public.all_students AS
${departments.map(dept => `SELECT rollno, name, department, status, created_at FROM public."${dept.toUpperCase()}"`).join('\nUNION ALL\n')};

CREATE OR REPLACE VIEW public.all_feedback_logs AS
${departments.map(dept => `SELECT id, roll_no, student_name, department, answers, strengths, improvements, created_at FROM public.${dept.toLowerCase()}_feedback_log`).join('\nUNION ALL\n')};

GRANT SELECT ON public.all_students TO service_role;
GRANT SELECT ON public.all_feedback_logs TO service_role;
`;

console.log(sql);
