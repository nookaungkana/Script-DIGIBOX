export function login() {
    //cy.viewport(1920, 1080);
    cy.visit('https://admin-staging.digiboxs.com/login');
    cy.wait(2000);
    cy.get('#username').should('be.visible').type('admin@lucablock.io');
    cy.wait(2000);
    cy.get('#password').type('12341234', { force: true });
    cy.wait(2000);
    cy.xpath("//button[contains(text(),'Sign In')]").click();
    cy.wait(2000);
}