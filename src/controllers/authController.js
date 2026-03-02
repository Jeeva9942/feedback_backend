const StudentModel = require('../models/studentModel');

const login = async (req, res) => {
    const { role, rollNo, username, password } = req.body;

    if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('your-project')) {
        return res.status(500).json({ error: 'Supabase URL is not configured correctly in .env file' });
    }

    try {
        if (role === 'student') {
            console.log(`[AUTH] Login attempt for Student: ${rollNo}`);
            let student;
            try {
                student = await StudentModel.findByRollNo(rollNo);
            } catch (err) {
                console.error(`[AUTH ERROR] Find Student failed:`, err.message);
                return res.status(500).json({
                    error: 'Database connection failed.',
                    details: 'Ensure Supabase is reachable and your project URL is correct.'
                });
            }

            if (!student) {
                console.warn(`[AUTH] Student not found: ${rollNo}`);
                return res.status(401).json({ error: 'Invalid Login Credentials - Student not found' });
            }

            // --- CRITICAL CHECK: ALREADY SUBMITTED ---
            // We check both 'status' and 'hasSubmitted' just in case of different table mappings
            const alreadySubmitted = (student.status === true || student.status === 'TRUE' || student.hasSubmitted === true);

            console.log(`[AUTH] Student Found: ${student.rollno}, Status: ${student.status}, AlreadySubmitted: ${alreadySubmitted}`);

            if (alreadySubmitted) {
                return res.status(403).json({
                    error: 'Feedback already submitted',
                    suggestedAction: 'Please contact the department admin if you believe this is an error.'
                });
            }

            // Case insensitive check: password must match rollno
            const pwd = (password || '').toUpperCase();
            const roll = (student.rollno || '').toUpperCase();

            if (roll !== pwd) {
                return res.status(401).json({ error: 'Invalid Login Credentials (Roll No/Password mismatch)' });
            }

            return res.status(200).json({
                user: {
                    role: 'student',
                    rollNo: student.rollno,
                    name: student.name,
                    department: student.department || 'CT',
                    hasSubmitted: alreadySubmitted
                }
            });
        } else if (role === 'admin') {
            if (username === 'admin' && password === 'IQAC@nptc') {
                return res.status(200).json({
                    user: { role: 'admin', username: 'admin' }
                });
            }
            return res.status(401).json({ error: 'Invalid Admin Credentials' });
        } else {
            return res.status(400).json({ error: 'Invalid role specified' });
        }
    } catch (err) {
        console.error('[AUTH FATAL ERROR]:', err);
        res.status(500).json({ error: 'Internal server error during login processing' });
    }

};

module.exports = { login };
