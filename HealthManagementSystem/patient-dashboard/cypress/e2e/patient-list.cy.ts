describe('Patient List Page', () => {
    beforeEach(() => {
      // Simula login (o accede directamente si no hay guard)
      cy.visit('/patients');
    });
  
    it('should display the patient list table', () => {
      cy.get('h2').contains('Patient List');
      cy.get('table').should('exist');
    });
  
    it('should allow searching by name', () => {
      cy.get('input[matinput]').type('john');
      cy.contains('Search').click();
  
      cy.get('table').contains('td', 'john', { matchCase: false });
    });
  
    it('should navigate to patient details on name click', () => {
      cy.get('table a').first().click();
      cy.url().should('include', '/patients/');
      cy.get('h2').should('exist');
    });
  });
  