require('cypress-xpath');
import { faker } from '@faker-js/faker';
import { login } from "../login.cy";
import 'cypress-file-upload';

const create_manage_category = () => cy.xpath("//span[contains(text(),'เพิ่มหมวดหมู่ผลิตภัณฑ์')]");
const picture = () => cy.xpath("//input[@type='file']");
const name = () => cy.xpath("//input[@name='name']");
const description = () => cy.xpath("//textarea[@name='description']");
const btsave = () =>  cy.xpath("//button[contains(text(),'บันทึก')]");

const menu = () => cy.xpath("//tbody/tr[last()]/td[6]/button[1]/*[1]");
const edit_manage_category = () => cy.xpath("//div[@role=\"menu\"]/div[2]");

describe('Function Manage-Category', () => {
    beforeEach(() => {
        cy.clearCookies();
        login();
        cy.wait(2000);
        cy.reload();
        cy.wait(1000);
        cy.visit('https://admin-staging.digiboxs.com/manage-category');
    });

    it.skip('Create Manage-Category', () => {
        create_manage_category().click();
        cy.wait(5000);
        cy.task('fetchGoogleSheetData', { range: 'Manage-category!E2:H5' }).then(data => {
            data.forEach((row, index) => {
                const [linkpicture, dtname, dtdescription, ExpectedAlertMessage ] = row;

                if (linkpicture) {
                    const fileName = 'category.jpg';
                    cy.task('downloadFileFromUrl', { url: linkpicture, fileName }).then((filePath) => {
                        // ใช้ fileName โดยตรงแทนที่จะใช้ filePath
                        cy.fixture(fileName).then(() => {
                            picture().attachFile(fileName);
                        });
                    });
                }

                if(dtname){
                    name().type(dtname);
                }
                if(dtdescription){
                    description().type(dtdescription);
                }
                btsave().click();
                cy.wait(2000);

                cy.contains(ExpectedAlertMessage).then(($alert) => {
                    if ($alert.length > 0) {
                        cy.log('Alert matches expected message');
                        cy.task('updateStatus', {
                            row: index + 2,
                            status: 'Pass',
                            column: 'I',
                            sheetName: 'Manage-category'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    cy.reload();
                    cy.wait(2000);
                    create_manage_category().click();
                });
            });
        });
    });
    it.skip('Edit Manage-Category', () => {
        menu().click();
        cy.wait(2000);
        edit_manage_category().click();
        cy.wait(2000);

        cy.task('fetchGoogleSheetData', { range: 'Manage-category!Q2:T5' }).then(data => {
            data.forEach((row, index) => {
                const [linkpicture, dtname, dtdescription, ExpectedAlertMessage ] = row;

                if (linkpicture) {
                    const fileName = 'category.jpg';
                    cy.task('downloadFileFromUrl', { url: linkpicture, fileName }).then((filePath) => {
                        // ใช้ fileName โดยตรงแทนที่จะใช้ filePath
                        cy.fixture(fileName).then(() => {
                            picture().attachFile(fileName);
                        });
                    });
                }
                if(dtname){
                    name().clear().type(dtname);
                }else {
                    name().clear();
                }
                if(dtdescription){
                    description().clear().type(dtdescription);
                }else {
                    description().clear();
                }
                btsave().click();
                cy.wait(2000);

                cy.contains(ExpectedAlertMessage).then(($alert) => {
                    if ($alert.length > 0) {
                        cy.log('Alert matches expected message');
                        cy.task('updateStatus', {
                            row: index + 2,
                            status: 'Pass',
                            column: 'U',
                            sheetName: 'Manage-category'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    cy.reload();
                    cy.wait(2000);
                    menu().click();
                    cy.wait(2000);
                    edit_manage_category().click();
                });
            });
        });
    });

});