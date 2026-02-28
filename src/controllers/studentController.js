const StudentModel = require('../models/studentModel');

const getAllStudents = async (req, res) => {
    try {
        const students = await StudentModel.getAllStudents();
        // Map DB snake_case to frontend camelCase if necessary (matching AdminDashboard expectations)
        const mappedStudents = students.map(s => ({
            rollNo: s.rollno,
            name: s.name,
            department: s.department,
            hasSubmitted: s.status
        }));
        return res.status(200).json(mappedStudents);
    } catch (err) {
        console.error('Error in getAllStudents Controller:', err.message);
        return res.status(500).json({ error: `Database Error: ${err.message}` });
    }
};

module.exports = {
    getAllStudents
};
