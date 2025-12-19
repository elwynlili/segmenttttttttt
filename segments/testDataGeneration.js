// Simple test script to verify data generation
const fs = require('fs');
const path = require('path');

// Set up a mock localStorage for Node.js environment
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

// Import the data generation functions
const { ensureTestDataExists, generateTestData, generateAccounts, generateContacts } = require('./src/utils/testDataGenerator.ts');

// Test the data generation
console.log('Testing data generation...');
ensureTestDataExists();

// Verify the generated data
const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');

console.log(`Generated ${accounts.length} accounts`);
console.log(`Generated ${contacts.length} contacts`);

if (accounts.length > 0) {
  console.log('First few accounts:', JSON.stringify(accounts.slice(0, 5), null, 2));
}

if (contacts.length > 0) {
  console.log('First few contacts:', JSON.stringify(contacts.slice(0, 5), null, 2));
}
