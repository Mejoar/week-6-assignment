// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from the command log
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Add global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing on uncaught exceptions
  // Return false to prevent the error from failing the test
  console.error('Uncaught exception:', err);
  return false;
});

// Add viewport commands
Cypress.Commands.add('setViewport', (size) => {
  switch (size) {
    case 'mobile':
      cy.viewport(375, 667);
      break;
    case 'tablet':
      cy.viewport(768, 1024);
      break;
    case 'desktop':
    default:
      cy.viewport(1280, 720);
      break;
  }
});

// Add accessibility testing support
beforeEach(() => {
  // Inject axe-core for accessibility testing
  cy.injectAxe();
});

// Add custom matchers
chai.use(require('chai-string'));
