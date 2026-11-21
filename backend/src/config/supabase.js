/**
 * SUPABASE.JS — Supabase Database & Auth Client
 * SIAK UFD Enterprise SaaS
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project.supabase.co') {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    console.log('⚡ [Supabase] Connected to Supabase Cloud Database at:', supabaseUrl);
  } catch (err) {
    console.warn('⚠️ [Supabase] Initialization failed:', err.message);
  }
} else {
  console.log('ℹ️ [Supabase] Credentials not configured yet. Operating in Local Hybrid Mode (db.json).');
}

function isSupabaseConfigured() {
  return supabase !== null;
}

module.exports = {
  supabase,
  isSupabaseConfigured
};
