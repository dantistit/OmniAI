describe('Chat Feature', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123');
    cy.visit('/chat');
  });

  it('should display chat interface', () => {
    cy.get('[data-testid="chat-container"]').should('exist');
    cy.get('[data-testid="message-input"]').should('exist');
    cy.get('[data-testid="send-button"]').should('exist');
  });

  it('should send and receive messages', () => {
    const message = 'Hello, AI!';
    cy.get('[data-testid="message-input"]').type(message);
    cy.get('[data-testid="send-button"]').click();
    
    cy.get('[data-testid="message"]').should('contain', message);
    cy.get('[data-testid="message"]').should('have.length.at.least', 2);
  });

  it('should persist chat history', () => {
    const message = 'Test message';
    cy.get('[data-testid="message-input"]').type(message);
    cy.get('[data-testid="send-button"]').click();
    
    cy.reload();
    cy.get('[data-testid="message"]').should('contain', message);
  });
});