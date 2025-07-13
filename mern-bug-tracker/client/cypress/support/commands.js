// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to seed the database with test data
Cypress.Commands.add('seedDatabase', (bugs = []) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/test/seed`,
    body: { bugs },
    failOnStatusCode: false
  });
});

// Custom command to clear the database
Cypress.Commands.add('clearDatabase', () => {
  cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/test/clear`,
    failOnStatusCode: false
  });
});

// Custom command to create a bug via API
Cypress.Commands.add('createBugViaAPI', (bugData) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/bugs`,
    body: bugData
  });
});

// Custom command to get all bugs via API
Cypress.Commands.add('getBugsViaAPI', () => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/bugs`
  });
});

// Custom command to delete a bug via API
Cypress.Commands.add('deleteBugViaAPI', (bugId) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/bugs/${bugId}`
  });
});

// Custom command to fill out the bug form
Cypress.Commands.add('fillBugForm', (bugData) => {
  if (bugData.title) {
    cy.get('[data-testid="bug-title"]').clear().type(bugData.title);
  }
  if (bugData.description) {
    cy.get('[data-testid="bug-description"]').clear().type(bugData.description);
  }
  if (bugData.reporter) {
    cy.get('[data-testid="bug-reporter"]').clear().type(bugData.reporter);
  }
  if (bugData.severity) {
    cy.get('[data-testid="bug-severity"]').select(bugData.severity);
  }
  if (bugData.priority) {
    cy.get('[data-testid="bug-priority"]').select(bugData.priority);
  }
  if (bugData.status) {
    cy.get('[data-testid="bug-status"]').select(bugData.status);
  }
  if (bugData.assignee) {
    cy.get('[data-testid="bug-assignee"]').clear().type(bugData.assignee);
  }
  if (bugData.tags) {
    cy.get('[data-testid="bug-tags"]').clear().type(bugData.tags);
  }
  if (bugData.stepsToReproduce) {
    cy.get('[data-testid="bug-steps"]').clear().type(bugData.stepsToReproduce);
  }
  if (bugData.environment) {
    if (bugData.environment.browser) {
      cy.get('[data-testid="bug-environment-browser"]').clear().type(bugData.environment.browser);
    }
    if (bugData.environment.os) {
      cy.get('[data-testid="bug-environment-os"]').clear().type(bugData.environment.os);
    }
    if (bugData.environment.version) {
      cy.get('[data-testid="bug-environment-version"]').clear().type(bugData.environment.version);
    }
  }
  if (bugData.dueDate) {
    cy.get('[data-testid="bug-due-date"]').clear().type(bugData.dueDate);
  }
});

// Custom command to submit bug form
Cypress.Commands.add('submitBugForm', (action = 'create') => {
  const buttonText = action === 'create' ? 'Create Bug' : 'Update Bug';
  cy.get('button').contains(buttonText).click();
});

// Custom command to wait for bug list to load
Cypress.Commands.add('waitForBugList', () => {
  cy.get('[data-testid="bug-list"]', { timeout: 10000 }).should('be.visible');
});

// Custom command to check if bug exists in the list
Cypress.Commands.add('bugShouldExist', (bugTitle) => {
  cy.get('[data-testid="bug-item"]').contains(bugTitle).should('exist');
});

// Custom command to check if bug does not exist in the list
Cypress.Commands.add('bugShouldNotExist', (bugTitle) => {
  cy.get('[data-testid="bug-item"]').contains(bugTitle).should('not.exist');
});

// Custom command to edit a bug
Cypress.Commands.add('editBug', (bugTitle) => {
  cy.get('[data-testid="bug-item"]')
    .contains(bugTitle)
    .parent()
    .find('[data-testid="edit-bug-btn"]')
    .click();
});

// Custom command to delete a bug
Cypress.Commands.add('deleteBug', (bugTitle) => {
  cy.get('[data-testid="bug-item"]')
    .contains(bugTitle)
    .parent()
    .find('[data-testid="delete-bug-btn"]')
    .click();
});

// Custom command to check accessibility
Cypress.Commands.add('checkA11y', (context, options) => {
  cy.checkA11y(context, options, (violations) => {
    if (violations.length > 0) {
      cy.task('log', 'Accessibility violations found:');
      cy.task('table', violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.length
      })));
    }
  });
});

// Custom command to take visual snapshot
Cypress.Commands.add('matchImageSnapshot', (name) => {
  cy.screenshot(name);
});

// Custom command to wait for API response
Cypress.Commands.add('waitForAPI', (alias) => {
  cy.wait(alias).then((interception) => {
    expect(interception.response.statusCode).to.be.oneOf([200, 201]);
  });
});

// Custom command to intercept API calls
Cypress.Commands.add('interceptAPI', () => {
  cy.intercept('GET', `${Cypress.env('apiUrl')}/bugs*`, { fixture: 'bugs.json' }).as('getBugs');
  cy.intercept('POST', `${Cypress.env('apiUrl')}/bugs`, { statusCode: 201 }).as('createBug');
  cy.intercept('PUT', `${Cypress.env('apiUrl')}/bugs/*`, { statusCode: 200 }).as('updateBug');
  cy.intercept('DELETE', `${Cypress.env('apiUrl')}/bugs/*`, { statusCode: 204 }).as('deleteBug');
});

// Custom command to verify form validation
Cypress.Commands.add('verifyFormValidation', (field, errorMessage) => {
  cy.get(`[data-testid="${field}-error"]`).should('contain', errorMessage);
});

// Custom command to verify toast notifications
Cypress.Commands.add('verifyToast', (message, type = 'success') => {
  cy.get(`[data-testid="toast-${type}"]`).should('contain', message);
});

// Add typing command that doesn't print keys to Command Log
Cypress.Commands.add('typeWithoutLog', { prevSubject: true }, (subject, text) => {
  return cy.wrap(subject).type(text, { log: false });
});

// Add custom command for login (if authentication is implemented)
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('[data-testid="email"]').type(email);
  cy.get('[data-testid="password"]').type(password);
  cy.get('[data-testid="login-btn"]').click();
});

// Add custom command for logout (if authentication is implemented)
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-btn"]').click();
});
