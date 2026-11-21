/**
 * REPOSITORY.JS — Hybrid Data Access Layer
 * Supports Supabase PostgreSQL Cloud with Auto-Fallback to In-Memory JSON
 * SIAK UFD Enterprise SaaS
 */

const fs = require('fs');
const path = require('path');
const { supabase, isSupabaseConfigured } = require('../config/supabase');

const DB_FILE = path.join(__dirname, '../data/db.json');

class Repository {
  constructor() {
    this.data = this._loadData();
  }

  _loadData() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('[Repository] Error loading db.json:', err);
    }
    return {
      tenants: [],
      users: [],
      students: [],
      lecturers: [],
      courses: [],
      classes: [],
      krs_enrollments: [],
      attendances: [],
      grades: [],
      grade_revisions: [],
      announcements: []
    };
  }

  _saveData() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Repository] Error writing db.json:', err);
    }
  }

  // Local In-Memory & JSON Operations (Instant & Reliable Fallback)
  findAll(collectionName) {
    return this.data[collectionName] || [];
  }

  findBy(collectionName, predicate) {
    const coll = this.data[collectionName] || [];
    return coll.filter(predicate);
  }

  findOne(collectionName, predicate) {
    const coll = this.data[collectionName] || [];
    return coll.find(predicate) || null;
  }

  insert(collectionName, item) {
    if (!this.data[collectionName]) {
      this.data[collectionName] = [];
    }
    this.data[collectionName].push(item);
    this._saveData();
    return item;
  }

  update(collectionName, predicate, updates) {
    const coll = this.data[collectionName] || [];
    const index = coll.findIndex(predicate);
    if (index !== -1) {
      this.data[collectionName][index] = { ...this.data[collectionName][index], ...updates };
      this._saveData();
      return this.data[collectionName][index];
    }
    return null;
  }

  delete(collectionName, predicate) {
    const coll = this.data[collectionName] || [];
    const initialLen = coll.length;
    this.data[collectionName] = coll.filter(item => !predicate(item));
    if (this.data[collectionName].length !== initialLen) {
      this._saveData();
      return true;
    }
    return false;
  }

  // Supabase PostgreSQL Cloud Operations
  async fromSupabase(tableName) {
    if (!isSupabaseConfigured()) {
      return null;
    }
    return supabase.from(tableName);
  }

  async syncWithSupabase(tableName, localData) {
    if (!isSupabaseConfigured()) return;
    try {
      const { error } = await supabase.from(tableName).upsert(localData);
      if (error) {
        console.warn(`[Supabase] Sync warning on ${tableName}:`, error.message);
      }
    } catch (err) {
      console.error(`[Supabase] Sync failed on ${tableName}:`, err.message);
    }
  }
}

module.exports = new Repository();
