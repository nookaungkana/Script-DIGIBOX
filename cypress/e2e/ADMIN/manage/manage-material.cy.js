require('cypress-xpath');
import { login } from "../login.cy";
import 'cypress-file-upload';

const create_manage_material = () => cy.xpath("//main[1]/div[1]/div[1]/button[1]");
const picture = () => cy.xpath("//input[@type='file']");
const name = () => cy.xpath("//input[@name='name']");
const gram = () => cy.xpath("//input[@name='gram']");
const selectcategory  = ()=> cy.xpath("//button[@name=\"categories\"]");
const category = () => cy.xpath("//span[contains(text(),'กล่องกระดาษ')]");
const btsave = () =>  cy.xpath("//button[contains(text(),'บันทึก')]");
const menu = () => cy.xpath("//tbody/tr[1]/td[6]/button");
const edit_manage_material = () => cy.xpath("//body[1]/div[1]/div[1]/div[2]");

describe('Function Manage-Material', () => {
    beforeEach(() => {
        cy.clearCookies();
        login();
        cy.wait(2000);
        cy.reload();
        cy.wait(1000);
        cy.visit('https://admin-staging.digiboxs.com/manage-material');
    });

    it.skip('Create Manage-Material', () => {
        create_manage_material()
            .should('exist')
            .should('be.visible')
            .dblclick({ timeout: 10000 });  // รอสูงสุด 10 วินาที
        cy.wait(2000);
        cy.task('fetchGoogleSheetData', { range: 'Manage-material!E2:I6' }).then(data => {
            data.forEach((row, index) => {
                const [linkpicture, dtname, dtgram, dtcategory, ExpectedAlertMessage ] = row;

                if (linkpicture) {
                    const fileName = 'material.jpg';
                    cy.task('downloadFileFromUrl', { url: linkpicture, fileName }).then((filePath) => {
                        cy.fixture(fileName).then(() => {
                            picture().attachFile(fileName);
                        });
                    });
                }
                if (dtname){
                    name().type(dtname);
                }
                if (dtgram){
                    gram().type(dtgram);
                }
                if (dtcategory){
                    selectcategory().click();
                    category().click();
                }
                btsave()
                    .should('exist')
                    .should('be.visible').click();
                cy.wait(2000);

                cy.contains(ExpectedAlertMessage).then(($alert) => {
                    if ($alert.length > 0) {
                        cy.log('Alert matches expected message');
                        cy.task('updateStatus', {
                            row: index + 2,
                            status: 'Pass',
                            column: 'J',
                            sheetName: 'Manage-material'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    cy.reload();
                    cy.wait(2000);
                    create_manage_material().click();
                });
            });
        });
    });
    it.skip('Edit Manage-Material', () => {
        cy.wait(1000);
        menu().click();
        cy.wait(1000);
        edit_manage_material()
            .should('exist')
            .should('be.visible')
            .dblclick({ timeout: 10000 });  // รอสูงสุด 10 วินาที
        cy.wait(2000);
        cy.task('fetchGoogleSheetData', { range: 'Manage-material!Q2:U6' }).then(data => {
            data.forEach((row, index) => {
                const [linkpicture, dtname, dtgram, dtcategory, ExpectedAlertMessage ] = row;

                if (linkpicture) {
                    const fileName = 'material.jpg';
                    cy.task('downloadFileFromUrl', { url: linkpicture, fileName }).then((filePath) => {
                        cy.fixture(fileName).then(() => {
                            picture().attachFile(fileName);
                        });
                    });
                }
                if (dtname){
                    name().clear().type(dtname);
                }else {
                    name().clear();
                }
                if (dtgram){
                    gram().clear().type(dtgram);
                }else {
                    gram().clear();
                }
                if (!dtcategory){
                    selectcategory().click();
                    cy.wait(1000);
                    cy.xpath("//div[@data-value=\"Clear\"]").click();
                }else {
                    selectcategory().click();
                    cy.wait(1000);
                    cy.xpath("//div[@data-value=\"Clear\"]").click();
                    cy.wait(1000);
                    category().click();
                }
                btsave()
                    .should('exist')
                    .should('be.visible').click();
                cy.wait(2000);

                cy.contains(ExpectedAlertMessage).then(($alert) => {
                    if ($alert.length > 0) {
                        cy.log('Alert matches expected message');
                        cy.task('updateStatus', {
                            row: index + 2,
                            status: 'Pass',
                            column: 'V',
                            sheetName: 'Manage-material'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    cy.reload();
                    cy.wait(2000);
                    menu().click();
                    cy.wait(1000);
                    edit_manage_material()
                        .should('exist')
                        .should('be.visible')
                        .dblclick({ timeout: 10000 });
                });
            });
        });
    });
});