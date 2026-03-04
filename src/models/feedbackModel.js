const { supabaseAdmin } = require('../config/supabase');

function checkDb() {
    if (!supabaseAdmin) {
        throw new Error('Database not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in Vercel environment variables.');
    }
}

class FeedbackModel {

    /**
     * Update question-wise counters in the [department]_feedback table.
     *
     * FAST VERSION: Instead of 42 sequential RPC calls, we:
     *  1. Fetch ALL rows for the table in ONE query
     *  2. Compute all the new values in memory
     *  3. Fire all updates in PARALLEL with Promise.all()
     *
     * This reduces the time from ~20s → ~1-2s.
     */
    static getTableName(department) {
        const d = (department || '').toUpperCase().trim();
        const map = {
            'MC': 'mcs_feedback',
            'PT': 'pt_feedback',
            'MECH_AIDED': 'mech_aided_feedback',
            'MECH_SF': 'mechanical_sf_feedback',
            'RAC': 'rac_feedback',
            'R&AC': 'rac_feedback',
        };
        return map[d] || `${d.toLowerCase()}_feedback`;
    }

    static async incrementDepartmentFeedbackCounters(department, answers) {
        if (!department || !answers || !Array.isArray(answers)) return;
        checkDb();

        const tableName = this.getTableName(department);
        const now = new Date().toISOString();

        // Build a map: code → ratingCol for all answers
        const answerMap = {};
        for (const ans of answers) {
            let code = '';
            if (ans.section === 'facilities') code = `A${ans.questionId}`;
            else if (ans.section === 'participation') code = `B${ans.questionId}`;
            else if (ans.section === 'accomplishment') code = `C${ans.questionId}`;
            if (!code) continue;

            const ratingCol = { 4: 'very_good_4', 3: 'good_3', 2: 'average_2', 1: 'below_average_1' }[ans.rating];
            if (!ratingCol) continue;

            answerMap[code] = ratingCol;
        }

        const codes = Object.keys(answerMap);
        if (codes.length === 0) return;

        // STEP 1: Fetch all relevant rows in ONE query
        const { data: rows, error: fetchError } = await supabaseAdmin
            .from(tableName)
            .select('*')
            .in('question_code', codes);

        if (fetchError) {
            console.warn(`[FEEDBACK] Could not fetch rows from ${tableName}:`, fetchError.message);
            return;
        }

        const rowMap = {};
        for (const row of (rows || [])) {
            rowMap[(row.question_code || '').toUpperCase()] = row;
        }

        // STEP 2: Build all updates in memory — no extra DB calls
        const updateTasks = codes.map(code => {
            const ratingCol = answerMap[code];
            const row = rowMap[code.toUpperCase()];

            if (!row) {
                console.warn(`[FEEDBACK] No row found for ${code} in ${tableName}`);
                return Promise.resolve();
            }

            const newValues = {
                total_count: (row.total_count || 0) + 1,
                [ratingCol]: (row[ratingCol] || 0) + 1,
                updated_at: now,
            };

            return supabaseAdmin
                .from(tableName)
                .update(newValues)
                .eq('question_code', code)
                .then(({ error }) => {
                    if (error) console.warn(`[FEEDBACK] Update failed for ${code}:`, error.message);
                });
        });

        // STEP 3: Run ALL updates in parallel
        await Promise.all(updateTasks);
        console.log(`[FEEDBACK] ✅ Updated ${codes.length} questions for ${department} in parallel.`);
    }

    static async getFeedbackByDepartment(department) {
        checkDb();
        const tableName = department && department !== 'ALL'
            ? this.getTableName(department)
            : 'ct_feedback';

        const { data, error } = await supabaseAdmin.from(tableName).select('*');
        if (error) {
            // Log for debugging but don't crash if it's just a missing table
            if (error.code === '42P01') {
                console.warn(`[BACKEND] Table ${tableName} not found.`);
                return [];
            }
            throw new Error(`Database Fetch Error: ${error.message}`);
        }
        return data || [];
    }
}

module.exports = FeedbackModel;
