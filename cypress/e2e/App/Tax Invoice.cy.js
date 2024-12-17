require('cypress-xpath');
import { login } from "../App/login.cy";
import 'cypress-file-upload';

const tax_invoice = () => cy.xpath("//div[@role=\"tablist\"]/button[2]")
const create_tax_invoice = () => cy.xpath("//div[@class='tax-wrapper w-full h-full']/div/button");
const taxPayerType = () => cy.xpath("//select[@name=\"taxPayerType\"]");
const taxId = () => cy.xpath("//input[@name=\"taxId\"]")

const firstname = () => cy.xpath("//input[@name='firstname']");
const lastname = () => cy.xpath("//input[@name='lastname']");
const taxPayerName = () => cy.xpath("//input[@name='taxPayerName']");
const phoneNumber = () => cy.xpath("//input[@name='phoneNumber']");
const email = () => cy.xpath("//input[@name='email']");
const address = () => cy.xpath("//input[@name='address']");
const zipCode = () => cy.xpath("//input[@name='zipCode']");
const subDistrict = () => cy.xpath("//select[@name='subDistrict']");
const btsave = () => cy.xpath("//button[contains(text(),'บันทึก')]");

const edit_tax_invoice = () => cy.xpath("//div[@class=\"CardAddressAccountCustom__CardAddressAccountCustomStyled-sc-9a19122e-0 kbdBBM\"]/div/img[1]");

describe('Function Tax-Invoice', () => {
    beforeEach(() => {
        cy.clearCookies();
        login();
        cy.wait(2000);
        cy.reload();
        cy.wait(1000);
        cy.visit('https://app-staging.digiboxs.com/my-account');
    });

    it.skip('Create Natural Person', () => {
        tax_invoice().click();
        cy.wait(2000);
        create_tax_invoice()
            .should('exist')
            .should('be.visible')
            .click({ timeout: 10000 });
        cy.wait(2000);
        cy.task('fetchGoogleSheetData', { range: 'Natural Person!E2:N9' }).then(data => {
            data.forEach((row, index) => {
                const [dttaxPayerType, dttaxId, dtfirstname,dtlastname,dtphoneNumber,dtemail,dtaddress,dtzipCode,ExpectedAlertMessage ] = row;

                if(dttaxId){
                  taxId().type(dttaxId);
                }
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
                            column: 'O',
                            sheetName: 'Natural Person'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    cy.reload();
                    tax_invoice().click();
                    cy.wait(2000);
                    //cy.xpath("//div[@class='address-wrapper w-full h-full']/button")
                    create_tax_invoice()
                        .should('exist')
                        .should('be.visible')
                        .click({ timeout: 10000 });
                });
            });
        });
    });
    it.skip('Edit Natural Person', () => {
        tax_invoice().click();
        cy.wait(2000);
        edit_tax_invoice()
            .should('exist')
            .should('be.visible')
            .click({ timeout: 10000 });
        cy.wait(2000);
        cy.task('fetchGoogleSheetData', { range: 'Natural Person!U2:AD9' }).then(data => {
            data.forEach((row, index) => {
                const [dttaxPayerType, dttaxId, dtfirstname,dtlastname,dtphoneNumber,dtemail,dtaddress,dtzipCode,ExpectedAlertMessage ] = row;

                if (dttaxId) {
                    taxId().clear().type(dttaxId);
                } else {
                    taxId().clear();
                }
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
                            column: 'AE',
                            sheetName: 'Natural Person'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    cy.reload();
                    tax_invoice().click();
                    cy.wait(2000);
                    //cy.xpath("//div[@class='address-wrapper w-full h-full']/button")
                    edit_tax_invoice()
                        .should('exist')
                        .should('be.visible')
                        .click({ timeout: 10000 });
                });
            });
        });
    });

    it.skip('Create Juristic Person', () => {
        tax_invoice().click();
        cy.wait(2000);
        create_tax_invoice()
            .should('exist')
            .should('be.visible')
            .click({ timeout: 10000 });
        cy.wait(2000);
        cy.task('fetchGoogleSheetData', { range: 'Juristic Person!E2:M8' }).then(data => {
            data.forEach((row, index) => {
                const [dttaxPayerType, dttaxId, dttaxPayerName, dtphoneNumber, dtemail, dtaddress, dtzipCode, ExpectedAlertMessage ] = row;

                if(dttaxPayerType){
                    taxPayerType().select('2',{force: true})
                }
                if(dttaxId){
                    taxId().type(dttaxId);
                }
                if(dttaxPayerName) {
                    taxPayerName().type(dttaxPayerName);
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
                            column: 'N',
                            sheetName: 'Juristic Person'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    cy.reload();
                    tax_invoice().click();
                    cy.wait(2000);
                    //cy.xpath("//div[@class='address-wrapper w-full h-full']/button")
                    create_tax_invoice()
                        .should('exist')
                        .should('be.visible')
                        .click({ timeout: 10000 });
                });
            });
        });
    });
    it.skip('Edit Juristic Person', () => {
        tax_invoice().click();
        cy.wait(2000);
        edit_tax_invoice()
            .should('exist')
            .should('be.visible')
            .click({ timeout: 10000 });
        cy.wait(2000);
        cy.task('fetchGoogleSheetData', { range: 'Juristic Person!T2:AB8' }).then(data => {
            data.forEach((row, index) => {
                const [dttaxPayerType, dttaxId, dttaxPayerName, dtphoneNumber, dtemail, dtaddress, dtzipCode, ExpectedAlertMessage ] = row;

                if(dttaxPayerType){
                    taxPayerType().select('2',{force: true})
                }
                if (dttaxId) {
                    taxId().clear().type(dttaxId);
                } else {
                    taxId().clear();
                }
                if (dttaxPayerName) {
                    taxPayerName().clear().type(dttaxPayerName);
                } else {
                    taxPayerName().clear();
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
                            column: 'AC',
                            sheetName: 'Juristic Person'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    cy.reload();
                    tax_invoice().click();
                    cy.wait(2000);
                    //cy.xpath("//div[@class='address-wrapper w-full h-full']/button")
                    edit_tax_invoice()
                        .should('exist')
                        .should('be.visible')
                        .click({ timeout: 10000 });
                });
            });
        });
    });

});