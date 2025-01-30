describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('contain', 'Sign in');
  });

  it('should show validation errors for empty form submission', () => {
    cy.get('button[type="submit"]').click();
    cy.get('p.text-red-600').should('have.length.at.least', 1);
  });

  it('should show error for invalid email format', () => {
    cy.get('input[type="email"]').type('invalid-email');
    cy.get('button[type="submit"]').click();
    cy.get('p.text-red-600').should('contain', 'Invalid email format');
  });

  it('should navigate to dashboard after successful login', () => {
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/chat');
  });
});