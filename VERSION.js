/**
 * Version History for EventsRegister
 * 
 * This file tracks all deployments of the EventsRegister Google Apps Script project.
 * Each entry records the version number, deployment date, machine used, and changes made.
 */

const VERSION_HISTORY = [
  {
    version: 1,
    date: '2026-01-18 16:57',
    machine: 'tom-HP-Pavilion-Laptop-16-af0xxx',
    changes: 'Initial VERSION.js tracking setup'
  },
,
  {
    version: 72,
    date: '2026-01-18 17:01',
    machine: 'tom-HP-Pavilion-Laptop-16-af0xxx',
    changes: 'Add VERSION.js tracking for deployments'
  }
  ,
  {
    version: 73,
    date: '2026-01-26 17:57',
    machine: 'tom-HP-Pavilion-Laptop-16-af0xxx',
    changes: 'Changed to handle new event code format'
  }
    // Add new entries above this line
];

/**
 * Gets the current version number
 * @return {number} Current version number
 */
function getCurrentVersion() {
  return VERSION_HISTORY[0].version;
}

/**
 * Gets the full version history
 * @return {Array} Array of version objects
 */
function getVersionHistory() {
  return VERSION_HISTORY;
}
