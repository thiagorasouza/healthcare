describe("LoginPage Test Suite", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001/admin/login");
  });

  it("has an email field", () => {
    cy.get("[data-cy='email']").should("exist");
  });

  it("has a password field", () => {
    cy.get("[data-cy='password']").should("exist");
  });

  it("has a submit button", () => {
    cy.get("[data-cy='submit']").should("exist");
  });
});
