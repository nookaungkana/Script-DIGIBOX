require('cypress-xpath');
import 'cypress-file-upload';
const { faker } = require('@faker-js/faker');

const firstname = () => cy.xpath("//input[@name='firstname']");
const lastname = () => cy.xpath("//input[@name='lastname']");
const email = () => cy.xpath("//input[@name='email']");
const password = () => cy.xpath("//input[@name='password']");
const condition = () => cy.xpath("//div[@class=\"flex items-center\"]/button");
const btsave = () => cy.xpath("//button[contains(text(),'สร้างบัญชี')]");

describe('Function Register', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.wait(2000);
        cy.reload();
        cy.wait(1000);
        cy.visit('https://app-staging.digiboxs.com/register');
        cy.wait(1000);
        cy.get('.accept-button').click();
    });
    it('Register', () => {
        cy.task('fetchGoogleSheetData', { range: 'Register!E2:K6' }).then(data => {
            data.forEach((row, index) => {
                const [dtfirstname,dtlastname,dtemail,dtpassword,I,J,ExpectedAlertMessage ] = row;

                if(dtfirstname){
                    firstname().type(dtfirstname);
                }
                if(dtlastname){
                    lastname().type(dtlastname);
                }
                if(dtemail){
                    email().type(faker.internet.email());
                }
                if(dtpassword){
                    password().type(dtpassword,{force: true});
                }
                condition().click();
                cy.wait(2000);
                btsave()
                    .should('exist')
                    .should('be.visible')
                    .click({ timeout: 10000 });
                cy.wait(2000);

                cy.contains(ExpectedAlertMessage).then(($alert) => {
                    if ($alert.length > 0) {
                        cy.log('Alert matches expected message');
                        cy.task('updateStatus', {
                            row: index + 2,
                            status: 'Pass',
                            column: 'L',
                            sheetName: 'Register'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    cy.reload();
                    cy.visit('https://app-staging.digiboxs.com/register');
                });
            });
        });
    });
});