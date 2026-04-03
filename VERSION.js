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
  ,
  {
    version: 74,
    date: '2026-01-31 14:54',
    machine: 'tom-HP-Pavilion-Laptop-16-af0xxx',
    changes: 'Fixed send register by email - new event codes not handled correctly'
  }
  ,
  {
    version: 75,
    date: '2026-02-15 11:00',
    machine: 'tom-HP-Pavilion-Laptop-16-af0xxx',
    changes: 'Colour changes to match Groups app'
  }
  ,
  {
    version: 76,
    date: '2026-02-16 11:23',
    machine: 'tom-HP-Pavilion-Laptop-16-af0xxx',
    changes: 'full screen icons added'
  }
  ,
  {
    version: 78,
    date: '2026-02-16 11:46',
    machine: 'tom-HP-Pavilion-Laptop-16-af0xxx',
    changes: 'Enter button for login enabled'
  }
  ,
  {
    version: 79,
    date: '2026-02-20 11:41',
    machine: 'tom-HP-Pavilion-Laptop-16-af0xxx',
    changes: 'Extend tabe size'
  }
  ,
  {
    version: 80,
    date: '2026-03-28 17:53',
    machine: 'tom-HP-Pavilion-Laptop-16-af0xxx',
    changes: 'Fixed add guest'
  }
  ,
  {
    version: 81,
    date: '2026-04-03 12:09',
    machine: 'tom-HP-Pavilion-Laptop-16-af0xxx',
    changes: 'Synchronise VERSION.js tracking with existing live v80 deployment'
  }
    // Add new entries above this line
];

// Current deployed version
const CURRENT_VERSION = VERSION_HISTORY[VERSION_HISTORY.length - 1];

/**
 * Gets the current version number
 * @return {number} Current version number
 */
function getCurrentVersion() {
  return CURRENT_VERSION.version;
}

/**
 * Get current version info
 */
function getVersionInfo() {
  return CURRENT_VERSION;
}

/**
 * Gets the full version history
 * @return {Array} Array of version objects
 */
function getVersionHistory() {
  return VERSION_HISTORY;
}

/**
 * Log all version history
 */
function logVersionHistory() {
  Logger.log('=== VERSION HISTORY ===');
  VERSION_HISTORY.forEach(v => {
    Logger.log(`v${v.version} [${v.date}] ${v.machine}: ${v.changes}`);
  });
}
