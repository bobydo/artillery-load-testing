// cypress/e2e/login.cy.js
// Mock login test for NestJS app

describe('Login Page', () => {
  it('should login with valid credentials', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('testpassword');
    cy.get('button[type="submit"]').click();
    // Mock: check for a successful login indicator (adjust as needed)
    cy.contains('Welcome').should('exist');
  });
});
