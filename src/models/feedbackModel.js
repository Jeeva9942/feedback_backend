const { supabaseAdmin } = require('../config/supabase');

class FeedbackModel {
    /**
     * Submit raw feedback log to [department]_feedback_log table
     */
    // Removed submitFeedback as individual log table doesn't exist in user's DB.
    // We only process counts in incrementDepartmentFeedbackCounters.

    /**
     * Update question-wise counters in the [department]_feedback table.
     * This table follows a row-per-question structure (Columns: question_code, total_count, very_good_4, etc.)
     */
    static async incrementDepartmentFeedbackCounters(department, answers) {
        if (!department || !answers || !Array.isArray(answers)) return;

        const tableName = `${department.toLowerCase()}_feedback`;
        const now = new Date().toISOString();

        // Sequential updates to avoid overloading flaky connections with parallel requests
        for (const ans of answers) {
            let code = '';
            // Match the question prefixes from the form sections
            if (ans.section === 'facilities') code = `A${ans.questionId}`;
            else if (ans.section === 'participation') code = `B${ans.questionId}`;
            else if (ans.section === 'accomplishment') code = `C${ans.questionId}`;

            if (!code) continue;

            // Map rating number to exact DB column name
            const ratingCol = {
                4: 'very_good_4',
                3: 'good_3',
                2: 'average_2',
                1: 'below_average_1'
            }[ans.rating];

            if (!ratingCol) continue;

            try {
                // Try RPC first for atomicity (if user created the suggested SQL function)
                const { error: rpcError } = await supabaseAdmin.rpc('increment_question_counter', {
                    t_name: tableName,
                    q_code: code,
                    rating_col: ratingCol
                });

                if (rpcError) {
                    // Manual Fallback: Fetch current value and update
                    const { data: row, error: fetchErr } = await supabaseAdmin
                        .from(tableName)
                        .select('*')
                        .eq('question_code', code)
                        .single();

                    if (!fetchErr && row) {
                        const newValues = {
                            total_count: (row.total_count || 0) + 1,
                            [ratingCol]: (row[ratingCol] || 0) + 1,
                            updated_at: now
                        };
                        await supabaseAdmin.from(tableName).update(newValues).eq('question_code', code);
                    }
                }
            } catch (err) {
                console.warn(`Could not increment counter for ${code}:`, err.message);
            }
        }
        console.log(`Counter increments completed for ${department}.`);
    }

    static async getFeedbackByDepartment(department) {
        // Since logs don't exist, we return the aggregate counts from ct_feedback
        const tableName = department && department !== 'ALL' ? `${department.toLowerCase()}_feedback` : 'ct_feedback';

        const { data, error } = await supabaseAdmin.from(tableName).select('*');
        if (error) throw new Error(`Database Fetch Error: ${error.message}`);
        return data || [];
    }
}

module.exports = FeedbackModel;
