require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Validate env vars early — gives a clear error instead of a cryptic crash
if (!supabaseUrl || !supabaseKey) {
    console.error('[FATAL] Missing Supabase environment variables!');
    console.error('  SUPABASE_URL:', supabaseUrl ? 'OK' : 'MISSING');
    console.error('  SUPABASE_SERVICE_KEY:', supabaseKey ? 'OK' : 'MISSING');
    console.error('  Fix: Vercel Dashboard -> Project -> Settings -> Environment Variables');
}

const clientOptions = {
    auth: { persistSession: false }
};

// Create clients only if credentials exist; null otherwise (avoids crash on load)
const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, clientOptions)
    : null;

const supabaseAdmin = supabase;

module.exports = { supabase, supabaseAdmin };
