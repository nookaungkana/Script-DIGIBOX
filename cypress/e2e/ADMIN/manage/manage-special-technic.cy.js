require('cypress-xpath');
import { login } from "../login.cy";
import 'cypress-file-upload';

const create_manage_special_technic = () => cy.xpath("//span[contains(text(),'เพิ่มเทคนิคพิเศษ')]");
const picture = () => cy.xpath("//input[@type='file']");
const name = () => cy.xpath("//input[@name='name']");
const price = () => cy.xpath("//input[@name='price']");
const category  = ()=> cy.xpath("//button[@name=\"categories\"]");
const categoryid2 = () => cy.xpath("//span[contains(text(),'กล่องกระดาษ')]");
const btsave = () =>  cy.xpath("//button[contains(text(),'บันทึก')]");
const menu = () => cy.xpath("//tbody/tr[last()]/td[6]/button");
const edit_manage_special_technic = () => cy.xpath("//body[1]/div[1]/div[1]/div[2]");

describe('Function Manage-Coating', () => {
    beforeEach(() => {
        cy.clearCookies();
        login();
        cy.wait(2000);
        cy.reload();
        cy.wait(1000);
        cy.visit('https://admin-staging.digiboxs.com/manage-special-technic');
    });

    it.skip('Create Manage-Special-Technic', () => {
        create_manage_special_technic()
            .should('exist')
            .should('be.visible')
            .dblclick({ timeout: 10000 });  // รอสูงสุด 10 วินาที
        cy.wait(2000);
        cy.task('fetchGoogleSheetData', { range: 'Manage-special-technic!E2:I6' }).then(data => {
            data.forEach((row, index) => {
                const [linkpicture, dtname, dtprice, dtcategory, ExpectedAlertMessage ] = row;

                if (linkpicture) {
                    const fileName = 'special-technic.jpg';
                    cy.task('downloadFileFromUrl', { url: linkpicture, fileName }).then((filePath) => {
                        cy.fixture(fileName).then(() => {
                            picture().attachFile(fileName);
                        });
                    });
                }
                if (dtname){
                    name().type(dtname);
                }
                if (dtprice){
                    price().type(dtprice);
                }
                if (dtcategory){
                    category().click();
                    cy.wait(1000);
                    categoryid2().click();
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
                            sheetName: 'Manage-special-technic'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    cy.reload();
                    cy.wait(2000);
                    create_manage_special_technic().click();
                });
            });
        });
    });
    it('Edit Manage-Special-Technic', () => {
        menu().click();
        cy.wait(1000);
        edit_manage_special_technic()
            .should('exist')
            .should('be.visible')
            .dblclick({ timeout: 10000 });  // รอสูงสุด 10 วินาที
        cy.wait(2000);
        cy.task('fetchGoogleSheetData', { range: 'Manage-special-technic!Q2:U6' }).then(data => {
            data.forEach((row, index) => {
                const [linkpicture, dtname, dtprice, dtcategory, ExpectedAlertMessage ] = row;

                if (linkpicture) {
                    const fileName = 'special-technic.jpg';
                    cy.task('downloadFileFromUrl', { url: linkpicture, fileName }).then((filePath) => {
                        cy.fixture(fileName).then(() => {
                            picture().attachFile(fileName);
                        });
                    });
                }
                if (dtname){
                    name().clear().type(dtname);
                }
                else {
                    name().clear();
                }
                if (dtprice){
                    price().clear().type(dtprice);
                }else {
                    price().clear();
                }
                if (!dtcategory){
                    category().click();
                    cy.wait(1000);
                    cy.xpath("//div[@data-value=\"Clear\"]").click();
                }else {
                    category().click();
                    cy.wait(1000);
                    cy.xpath("//div[@data-value=\"Clear\"]").click();
                    cy.wait(1000);
                    categoryid2().click();
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
                            sheetName: 'Manage-special-technic'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    cy.reload();
                    cy.wait(2000);
                    menu().click();
                    cy.wait(1000);
                    edit_manage_special_technic()
                        .should('exist')
                        .should('be.visible')
                        .dblclick({ timeout: 10000 });
                });
            });
        });
    });
});