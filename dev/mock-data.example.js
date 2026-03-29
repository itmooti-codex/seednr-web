// Mock Ontraport merge field values for local development.
// In production, these are set by Ontraport's server-side rendering
// before the page reaches the browser.
//
// SETUP: Copy this file to mock-data.js and fill in your values.
//   cp dev/mock-data.example.js dev/mock-data.js

window.__ONTRAPORT_MOCK__ = true;

// Simulates [Visitor//Contact ID]
window.__MOCK_CONTACT_ID__ = '12345';

// Simulates a VitalSync API key (get from VitalStats dashboard)
window.__MOCK_API_KEY__ = '';

// Add more mock values as needed for your project.
// These correspond to the merge fields used in html/header.html.
