-- --- FINAL DATABASE SCHEMA ---
-- Consolidation of all department tables and unified student records.

-- 1. Unified Students Table
CREATE TABLE IF NOT EXISTS public.all_students (
  id SERIAL PRIMARY KEY,
  rollno VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(50) NOT NULL,
  status BOOLEAN DEFAULT FALSE, -- FALSE = Not Submitted, TRUE = Submitted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Aggregate Feedback Tables for each Department
-- CE
CREATE TABLE IF NOT EXISTS public.ce_feedback (
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

-- CT
CREATE TABLE IF NOT EXISTS public.ct_feedback (
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

-- TT
CREATE TABLE IF NOT EXISTS public.tt_feedback (
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

-- PT
CREATE TABLE IF NOT EXISTS public.pt_feedback (
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

-- CCN
CREATE TABLE IF NOT EXISTS public.ccn_feedback (
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

-- ECE Aided
CREATE TABLE IF NOT EXISTS public.ece_aided_feedback (
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

-- ECE SF
CREATE TABLE IF NOT EXISTS public.ece_sf_feedback (
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

-- EEE Aided
CREATE TABLE IF NOT EXISTS public.eee_aided_feedback (
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

-- EEE SF
CREATE TABLE IF NOT EXISTS public.eee_sf_feedback (
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

-- MECH Aided
CREATE TABLE IF NOT EXISTS public.mech_aided_feedback (
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

-- Mechanical SF
CREATE TABLE IF NOT EXISTS public.mechanical_sf_feedback (
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

-- Automobile Aided
CREATE TABLE IF NOT EXISTS public.automobile_aided_feedback (
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

-- Automobile SF
CREATE TABLE IF NOT EXISTS public.automobile_sf_feedback (
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

-- Mechatronics (SF) - stored in mcs_feedback
CREATE TABLE IF NOT EXISTS public.mcs_feedback (
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

-- R&AC Aided
CREATE TABLE IF NOT EXISTS public.rac_feedback (
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
