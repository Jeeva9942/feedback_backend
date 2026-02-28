const { supabaseAdmin } = require('../config/supabase');

class StudentModel {
    // Method to find a student by roll No
    // Method to find a student by roll No (Checks across ALL departments via all_students table)
    static async findByRollNo(rollNo) {
        const rollUpper = rollNo.toUpperCase();
        let retryCount = 0;
        const maxRetries = 2;

        while (retryCount <= maxRetries) {
            try {
                const { data, error } = await supabaseAdmin
                    .from('all_students')
                    .select('*')
                    .eq('rollno', rollUpper)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    throw new Error(error.message);
                }
                return data;
            } catch (err) {
                if (retryCount === maxRetries) throw err;
                console.warn(`Supabase login attempt ${retryCount + 1} failed. Retrying...`);
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }

    // Method to update submission status in the Supabase 'all_students' table
    static async updateSubmissionStatus(rollNo, status) {
        const rollUpper = rollNo.toUpperCase();

        const { data, error } = await supabaseAdmin
            .from('all_students')
            .update({ status })
            .eq('rollno', rollUpper);

        if (error) {
            throw new Error(`Database Sync Error: ${error.message}`);
        }

        return { success: true, data };
    }

    static async getAllStudents() {
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount <= maxRetries) {
            try {
                const { data, error } = await supabaseAdmin
                    .from('all_students')
                    .select('*')
                    .order('rollno', { ascending: true });

                if (error) {
                    throw new Error(error.message);
                }

                return data || [];
            } catch (err) {
                if (retryCount === maxRetries) {
                    console.error(`[DB ERROR] getAllStudents failed after ${maxRetries} retries:`, err.message);
                    throw err;
                }
                console.warn(`[DB RETRY] getAllStudents attempt ${retryCount + 1} failed. Retrying in 2s...`);
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }

}

module.exports = StudentModel;
