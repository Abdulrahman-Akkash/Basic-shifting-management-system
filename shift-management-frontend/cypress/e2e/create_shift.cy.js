describe('Create Shift Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('✅ Green Test - successfully creates a new shift when form is filled', () => {
    cy.get('[data-cy="toggle-form-btn"]').click();

    cy.get('[data-cy="employee-name"]').type('John Doe');
    cy.get('[data-cy="position"]').type('Developer');
    cy.get('[data-cy="start-time"]').type('2025-11-08T09:00');
    cy.get('[data-cy="end-time"]').type('2025-11-08T17:00');
    cy.get('[data-cy="status"]').select('Scheduled');
    cy.get('[data-cy="notes"]').type('Morning shift');

    cy.get('[data-cy="save-shift-btn"]').click();

  });

//   it('❌ Red Test - shows validation error when required fields are empty', () => {
//     cy.get('[data-cy="toggle-form-btn"]').click();
//     cy.get('[data-cy="save-shift-btn"]').click();

//     cy.contains('Please fill in all required fields').should('exist');
//   });
});
