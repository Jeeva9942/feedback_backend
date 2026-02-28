-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public."CT" (
    rollno VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(50) DEFAULT 'CT',
    status BOOLEAN DEFAULT FALSE
);

-- Give access to anon role (Optional but needed if frontend inserts/reads directly)
GRANT ALL ON TABLE public."CT" TO anon;
GRANT ALL ON TABLE public."CT" TO authenticated;
GRANT ALL ON TABLE public."CT" TO service_role;

-- Insert the 31 students
INSERT INTO public."CT" (rollno, name, department, status) VALUES 
('23CT01', 'Abdul Fattah A', 'CT', FALSE),
('23CT02', 'Abhijit M', 'CT', FALSE),
('23CT03', 'Anbarasu S', 'CT', FALSE),
('23CT04', 'Athiseshan P R', 'CT', FALSE),
('23CT05', 'Bhavin S', 'CT', FALSE),
('23CT06', 'Govarthanan M', 'CT', FALSE),
('23CT07', 'GOWTHAM A', 'CT', FALSE),
('23CT08', 'Harshit Ariya M K', 'CT', FALSE),
('23CT09', 'Harshit Balu N S', 'CT', FALSE),
('23CT10', 'Janani N', 'CT', FALSE),
('23CT11', 'Janarthanan S', 'CT', FALSE),
('23CT12', 'Jeevan Adhithya M', 'CT', FALSE),
('23CT13', 'Kani Sudhan M', 'CT', FALSE),
('23CT14', 'Mohmed Hafeez Z', 'CT', FALSE),
('23CT16', 'Nalin Srithar M', 'CT', FALSE),
('23CT17', 'Navin S R', 'CT', FALSE),
('23CT18', 'Navin Rahava J', 'CT', FALSE),
('23CT19', 'Netra R', 'CT', FALSE),
('23CT20', 'Saanvi G T', 'CT', FALSE),
('23CT21', 'Sandhiya S', 'CT', FALSE),
('23CT22', 'Sanjith T', 'CT', FALSE),
('23CT23', 'Subaharish N', 'CT', FALSE),
('23CT24', 'Subhashri M', 'CT', FALSE),
('23CT25', 'Vignesh T S', 'CT', FALSE),
('23CT26', 'Vijaysrisaran V S', 'CT', FALSE),
('23CT27', 'Yashwanthraj M', 'CT', FALSE),
('23CT28', 'Yuvahari M', 'CT', FALSE),
('24CTA01', 'Jagan Pradap S', 'CT', FALSE),
('24CTA02', 'Thaarani K', 'CT', FALSE),
('24CTA03', 'Kaveen K', 'CT', FALSE),
('24CTA04', 'Poomalar S', 'CT', FALSE);
