/**
 * DEV.JS — Concurrent Dev Runner for Frontend & Backend
 * Spawns both Backend (Port 5000) and Frontend (Port 3000)
 * SIAK UFD Enterprise SaaS
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('==================================================================');
console.log('🚀 Starting SIAK UFD Enterprise SaaS (Frontend & Backend)...');
console.log('==================================================================');

// 1. Start Backend
const backendPath = path.join(__dirname, '../backend');
const backend = spawn('node', ['src/server.js'], {
  cwd: backendPath,
  stdio: 'inherit',
  shell: true
});

// 2. Start Frontend Static Server on Port 3000
const frontendPath = path.join(__dirname, '../frontend');
const frontend = spawn('npm', ['start'], {
  cwd: frontendPath,
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  console.log('\nStopping servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});
