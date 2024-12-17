require('cypress-xpath');
import { login } from "../login.cy";
import 'cypress-file-upload';

const create_problem_type = () => cy.xpath("//span[contains(text(),'เพิ่มประเภทปัญหา')]");
const name = () => cy.xpath("//input[@name='name']");
const btsave = () =>  cy.xpath("//button[contains(text(),'บันทึก')]");

const menu = () =>  cy.xpath("//tbody[1]/tr[last()]/td[4]/button[1]");
const edit_problem_type = () =>  cy.xpath("//body[1]/div[1]/div[1]/div[2]");
describe('Function Claim-Problem', () => {
    beforeEach(() => {
        cy.clearCookies();
        login();
        cy.wait(2000);
        cy.reload();
        cy.wait(1000);
        cy.visit('https://admin-staging.digiboxs.com/claim-problem');
    });

    it.skip('Create Claim-Problem', () => {
        create_problem_type()
            .should('exist')
            .should('be.visible')
            .click({ timeout: 10000 });
        cy.wait(2000);
        cy.task('fetchGoogleSheetData', { range: 'Claim-problem!E2:F3' }).then(data => {
            data.forEach((row, index) => {
                const [dtname,ExpectedAlertMessage ] = row;

                if (dtname) {
                    name().type(dtname);
                }
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
                            column: 'G',
                            sheetName: 'Claim-problem'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    cy.reload();
                    cy.wait(2000);
                    create_problem_type()
                        .should('exist')
                        .should('be.visible')
                        .click({ timeout: 10000 });
                });
            });
        });
    });
    it.skip('Edit Claim-Problem', () => {
        menu().click();
        cy.wait(2000);
        edit_problem_type()
            .should('exist')
            .should('be.visible')
            .click({ timeout: 10000 });
        cy.wait(2000);
        cy.task('fetchGoogleSheetData', { range: 'Claim-problem!Q2:R3' }).then(data => {
            data.forEach((row, index) => {
                const [dtname,ExpectedAlertMessage ] = row;

                if (dtname) {
                    name().clear().type(dtname);
                }else {
                    name().clear();
                }
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
                            column: 'S',
                            sheetName: 'Claim-problem'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    cy.reload();
                    cy.wait(2000);
                    menu().click();
                    cy.wait(2000);
                    edit_problem_type()
                        .should('exist')
                        .should('be.visible')
                        .click({ timeout: 10000 });
                });
            });
        });
    });
});


