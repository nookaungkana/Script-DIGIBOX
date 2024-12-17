require('cypress-xpath');
import { login } from "../App/login.cy";
import 'cypress-file-upload';

const create_address_shipping = () => cy.xpath("//div[@class='w-full'][2]/div[2]/div//button");
const firstname = () => cy.xpath("//input[@name='firstname']");
const lastname = () => cy.xpath("//input[@name='lastname']");
const phoneNumber = () => cy.xpath("//input[@name='phoneNumber']");
const email = () => cy.xpath("//input[@name='email']");
const address = () => cy.xpath("//input[@name='address']");
const zipCode = () => cy.xpath("//input[@name='zipCode']");
const subDistrict = () => cy.xpath("//select[@name='subDistrict']");
const btsave = () => cy.xpath("//button[contains(text(),'บันทึก')]");

const edit_address_shipping = () => cy.xpath("//div[@class=\"CardAddressAccountCustom__CardAddressAccountCustomStyled-sc-9a19122e-0 kbdBBM\"]/div/img[1]");

describe('Function Shipping-Address', () => {
    beforeEach(() => {
        cy.clearCookies();
        login();
        cy.wait(2000);
        cy.reload();
        cy.wait(1000);
        cy.visit('https://app-staging.digiboxs.com/my-account');
    });

    it.skip('Create Shipping-Address', () => {
        create_address_shipping()
            .should('exist')
            .should('be.visible')
            .click({ timeout: 10000 });
        cy.wait(2000);
        cy.task('fetchGoogleSheetData', { range: 'Shipping Address!E2:L8' }).then(data => {
            data.forEach((row, index) => {
                const [dtfirstname,dtlastname,dtphoneNumber,dtemail,dtaddress,dtzipCode,ExpectedAlertMessage ] = row;

                if(dtfirstname) {
                    firstname().type(dtfirstname);
                }
                if(dtlastname){
                    lastname().type(dtlastname);
                }
                if(dtphoneNumber){
                   phoneNumber().type(dtphoneNumber);
                }
                if(dtemail){
                    email().type(dtemail);
                }
                if(dtaddress){
                    address().type(dtaddress);
                }
                if(dtzipCode){
                    zipCode().type(dtzipCode);
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
                            column: 'M',
                            sheetName: 'Shipping Address'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    cy.reload();
                    cy.wait(2000);
                    create_address_shipping()
                        .should('exist')
                        .should('be.visible')
                        .click({ timeout: 10000 });
                });
            });
        });
    });
    it.skip('Edit Shipping-Address', () => {
        edit_address_shipping()
            .should('exist')
            .should('be.visible')
            .click({ timeout: 10000 });
        cy.wait(2000);
        cy.task('fetchGoogleSheetData', { range: 'Shipping Address!S2:Z8' }).then(data => {
            data.forEach((row, index) => {
                const [dtfirstname,dtlastname,dtphoneNumber,dtemail,dtaddress,dtzipCode,ExpectedAlertMessage ] = row;

                if (dtfirstname) {
                    firstname().clear().type(dtfirstname);
                } else {
                    firstname().clear();
                }
                if (dtlastname) {
                    lastname().clear().type(dtlastname);
                } else {
                    lastname().clear();
                }
                if (dtphoneNumber) {
                    phoneNumber().clear().type(dtphoneNumber);
                } else {
                    phoneNumber().clear();
                }
                if (dtemail) {
                    email().clear().type(dtemail);
                } else {
                    email().clear();
                }
                if (dtaddress) {
                    address().clear().type(dtaddress);
                } else {
                    address().clear();
                }
                if (dtzipCode) {
                    zipCode().clear().type(dtzipCode);
                } else {
                    zipCode().clear();
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
                            column: 'AA',
                            sheetName: 'Shipping Address'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    cy.reload();
                    cy.wait(2000);
                    edit_address_shipping()
                        .should('exist')
                        .should('be.visible')
                        .click({ timeout: 10000 });
                });
            });
        });
    });
});