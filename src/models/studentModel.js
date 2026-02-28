const { supabaseAdmin } = require('../config/supabase');

function checkDb() {
    if (!supabaseAdmin) {
        throw new Error('Database not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in Vercel environment variables.');
    }
}

class StudentModel {

    /** Find a student by roll number — single fast query, no slow retries */
    static async findByRollNo(rollNo) {
        checkDb();
        const rollUpper = rollNo.toUpperCase();

        const { data, error } = await supabaseAdmin
            .from('all_students')
            .select('*')
            .eq('rollno', rollUpper)
            .single();

        // PGRST116 = "no rows found" — treat as null, not an error
        if (error && error.code !== 'PGRST116') {
            throw new Error(error.message);
        }
        return data;
    }

    /** Mark a student as submitted — single fast update */
    static async updateSubmissionStatus(rollNo, status) {
        checkDb();
        const rollUpper = rollNo.toUpperCase();

        const { error } = await supabaseAdmin
            .from('all_students')
            .update({ status })
            .eq('rollno', rollUpper);

        if (error) {
            throw new Error(`Database Sync Error: ${error.message}`);
        }
        return { success: true };
    }

    /** Get all students — single fast query, no slow retries */
    static async getAllStudents() {
        checkDb();

        const { data, error } = await supabaseAdmin
            .from('all_students')
            .select('*')
            .order('rollno', { ascending: true });

        if (error) {
            throw new Error(`Database Error: ${error.message}`);
        }
        return data || [];
    }
}

module.exports = StudentModel;
