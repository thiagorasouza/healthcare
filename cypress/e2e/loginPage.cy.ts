describe("LoginPage", () => {
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

  it("prevents invalid fields from being submitted", () => {
    cy.get("[data-cy='email']").type("invalid_email");
    cy.get("[data-cy='password']").type("abc123"); // less than 8 chars
    cy.get("[data-cy='submit']").click();

    cy.get("[data-cy='emailError']").contains("Invalid email");
    cy.get("[data-cy='passwordError']").contains("Invalid password");
  });

  it("submits valid fields", () => {
    const userData = {
      email: "valid_email@email.com",
      password: "valid_password",
    };

    cy.intercept("POST", "/admin/login").as("formSubmit");

    cy.get("[data-cy='email']").type(userData.email);
    cy.get("[data-cy='password']").type(userData.password);
    cy.get("[data-cy='submit']").click();

    cy.wait("@formSubmit").then((interception) => {
      const requestBody = interception.request.body;
      const parsedRequestBody = JSON.parse(requestBody)[0];

      expect(parsedRequestBody).to.deep.equal(userData);
    });
  });
});
