/**
 * REPOSITORY.JS — Data Access Layer
 * In-Memory Database with Auto JSON Persistence
 * SIAK UFD Enterprise SaaS
 */

const fs = require('fs');
const path = require('path');

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
}

module.exports = new Repository();
