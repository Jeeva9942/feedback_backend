const data = require('./ct_data.json');
const fs = require('fs');
const path = require('path');

let sql = `-- Run this in your Supabase SQL Editor

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
`;

const values = data.map(student => {
    const rollno = student['Roll No.'];
    const name = `${student['First name']} ${student['Last name']}`.replace(/'/g, "''").trim();
    return `('${rollno}', '${name}', 'CT', FALSE)`;
});

sql += values.join(',\n') + ';\n';

fs.writeFileSync(path.join(__dirname, 'supabase_setup.sql'), sql);
console.log('SQL generated at supabase_setup.sql');
