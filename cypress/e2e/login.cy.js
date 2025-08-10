// cypress/e2e/login.cy.js
// Data-driven login test using shared configuration

import config from '../support/config-loader';

describe('Login Page', () => {
  let selectors, text, urls;

  before(() => {
    // Load configuration once before all tests
    return config.loadConfig().then(() => {
      selectors = config.getSelectors();
      text = config.getText();
      urls = config.getUrls();
    });
  });

  beforeEach(() => {
    cy.visit(urls.login_page);
  });

  it('should display login page correctly', () => {
    cy.get('h1').should('contain', text.page_title);
    cy.get(selectors.username_input).should('be.visible');
    cy.get(selectors.password_input).should('be.visible');
    cy.get(selectors.submit_button).should('contain', text.submit_button_text);
  });

  it('should login with valid credentials', () => {
    const validUser = config.getValidUser();

    cy.get(selectors.username_input).type(validUser.username);
    cy.get(selectors.password_input).type(validUser.password);
    cy.get(selectors.submit_button).click();

    // Check for welcome message
    cy.get(selectors.welcome_message).should(
      'contain',
      text.welcome_message_text,
    );
  });

  it('should handle invalid credentials', () => {
    const invalidUser = config.getInvalidUser();

    cy.get(selectors.username_input).type(invalidUser.username);
    cy.get(selectors.password_input).type(invalidUser.password);
    cy.get(selectors.submit_button).click();

    // Check for error message (if implemented)
    // cy.get(selectors.error_message).should('contain', invalidUser.expected_error);
  });

  it('should validate required fields', () => {
    const emptyFieldUser = config.getInvalidUser(1); // Username empty

    cy.get(selectors.password_input).type(emptyFieldUser.password);
    cy.get(selectors.submit_button).click();

    // HTML5 validation or custom error handling
    cy.get(selectors.username_input).should('have.attr', 'required');
  });
});
