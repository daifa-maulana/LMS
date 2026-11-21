/**
 * SUPABASE-CLIENT.JS — Frontend Supabase Client & Realtime Adapter
 * Connects Frontend directly to Supabase with Automatic Hybrid Fallback
 * SIAK UFD Enterprise SaaS
 */

const SUPABASE_CONFIG = {
  url: window.ENV_SUPABASE_URL || 'https://your-project-id.supabase.co',
  anonKey: window.ENV_SUPABASE_ANON_KEY || 'your-anon-key-here'
};

class FrontendSupabaseClient {
  constructor() {
    this.client = null;
    this.init();
  }

  init() {
    if (window.supabase && SUPABASE_CONFIG.url !== 'https://your-project-id.supabase.co') {
      try {
        this.client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log('⚡ [Frontend] Connected to Supabase Realtime & DB');
      } catch (e) {
        console.warn('⚠️ [Frontend] Supabase init skipped, using local API adapter:', e.message);
      }
    }
  }

  isReady() {
    return this.client !== null;
  }
}

window.siakSupabase = new FrontendSupabaseClient();
