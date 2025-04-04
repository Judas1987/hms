describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('should show error on invalid login', () => {
      cy.get('input[formControlName=email]').type('wrong@email.com');
      cy.get('input[formControlName=password]').type('wrongpassword');
      cy.get('[data-cy="login-button"]').click();
  
      cy.contains('Invalid credentials').should('exist');
    });
  
    it('should login successfully and redirect based on role', () => {
      // Credenciales válidas (asegúrate que existan en tu backend)
      cy.get('input[formControlName=email]').type('admin@hms.com');
      cy.get('input[formControlName=password]').type('Admin123!');
      cy.get('[data-cy="login-button"]').click();
  
      // Espera redirección
      cy.url().should('include', '/patients'); // para Admin
      cy.get('h2').contains('Patient List').should('exist');
    });
  });
  