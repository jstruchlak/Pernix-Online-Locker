describe('Home Screen Navbar Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should display all navbar titles', () => {
    cy.get('h1').should('contain.text', 'Online Locker');
    cy.get('h3').should('contain.text', 'Your Info, Your Safe Place.');
  });

  it('should display all navbar links', () => {
    cy.get('a[href="/login"]').should('contain.text', 'Login');
    cy.get('a[href="/signup"]').should('contain.text', 'Signup');
  });

});


describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });

  it('should display an error for incorrect username', () => {
    cy.get('input#username').type('incorrectUser');
    cy.get('input#email').type('correct@example.com');
    cy.get('input#password').type('correctpasswordbl@ckb1rdPNX');
    cy.get('form.login').submit();
    cy.intercept('POST', '/api/login', { statusCode: 400, body: { error: 'Incorrect Username' } });
    cy.get('.error').should('contain.text', 'Incorrect Username');
    cy.wait(1500)
  });

  it('should display an error for incorrect email', () => {
    cy.get('input#username').type('correctUser');
    cy.get('input#email').type('incorrect@example.com');
    cy.get('input#password').type('correctpasswordbl@ckb1rdPNX');
    cy.get('form.login').submit();
    cy.intercept('POST', '/api/login', { statusCode: 400, body: { error: 'Incorrect Email' } });
    cy.get('.error').should('contain.text', 'Incorrect Email');
    cy.wait(1500)
  });

  it('should display an error for incorrect password', () => {
    cy.get('input#username').type('correctUser');
    cy.get('input#email').type('correct@example.com');
    cy.get('input#password').type('wrongpassword');
    cy.get('form.login').submit();
    cy.intercept('POST', '/api/login', { statusCode: 400, body: { error: 'Incorrect Password' } });
    cy.get('.error').should('contain.text', 'Incorrect Password');
    cy.wait(1500)
  });


  it('should show error when submitting empty form', () => {
    cy.get('form.login').submit();
    cy.get('.error').should('contain.text', 'All fields are required');
    cy.wait(1500)
  });

  it('should login with valid credentials and fill the user profile', () => {
    // login with valid user
    cy.get('input#username').type('correctUser');
    cy.get('input#email').type('correct@example.com');
    cy.get('input#password').type('correctpasswordbl@ckb1rdPNX');
    cy.get('form.login').submit();
    cy.wait(1500)
    // create profile details
    cy.get('#fullName').type('John Doe').should('have.value', 'John Doe');
    cy.get('#dob').type('1990-01-01').should('have.value', '1990-01-01');
    cy.get('#aboutMe').type('Software Developer').should('have.value', 'Software Developer');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/CY.jpg');
    cy.get('button').contains('Create Profile').click();
    cy.wait(3500)
    // test modal and delete user
    cy.get('.icon-container .material-symbols-outlined').contains('delete').click();
    cy.wait(3500)
    cy.get('.modal-buttons .delete-button').click();
    cy.wait(1000)
    // logout back to home 
    cy.get('.user-profile').should('not.exist');
    cy.wait(1000)
    cy.get('nav button').contains('Log Out').click();
  });

});


describe('Forgot Password Page Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });

  it('should navigate to forgot password page when link is clicked', () => {
    cy.get('a').contains('Forgot Password?').click();
    cy.url().should('eq', 'http://localhost:3000/forgot-password');
    cy.wait(1500)
    cy.get('h3').should('contain.text', 'Forgot Password');
    cy.visit('http://localhost:3000');
  });
});




