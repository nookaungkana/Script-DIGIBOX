export function loginApp() {
  cy.viewport(1920, 1080);
  cy.visit('https://app-staging.digiboxs.com/login');
  cy.wait(2000);
  cy.get('.accept-button').click();
  cy.xpath("//input[@type=\'email\']").type('aungkananook10@gmail.com');
  cy.xpath("//input[@type='password']").type('12341234');
  cy.xpath("//button[contains(text(),'เข้าสู่ระบบ')]").click();
  cy.wait(2000);

}