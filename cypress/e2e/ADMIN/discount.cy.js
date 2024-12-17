require('cypress-xpath');
import { login } from "./login.cy";
import 'cypress-file-upload';

const create_discount = () => cy.xpath("//div[@class=\"flex justify-end items-center\"]/button");
const picture = () => cy.xpath("//input[@type='file']");
const title = () => cy.xpath("//input[@name='title']");
const discounttype = () => cy.xpath("//select[@name=\"discountCategoryId\"]");
const discounttypeid2 = () => cy.xpath("//option[contains(text(),'คูปองสินค้า')]");
const discountCode = () => cy.xpath("//input[@id='discountCode']");
const percentage = () => cy.xpath("//input[@id='percentage']");
const maxDiscount = () => cy.xpath("//input[@id='maxDiscount']");
const minPrice = () => cy.xpath("//input[@id='minPrice']");
const maxUsage = () => cy.xpath("//input[@id='maxUsage']");
const startdate = () => cy.xpath("//tr[2]/td[3]/button[1]");
const enddate = () => cy.xpath("//tr[5]/td[7]/button[1]");
const condition = () => cy.xpath("//textarea[@id='condition']");
const description = () => cy.xpath("//textarea[@id='description']");
const btsave = () =>  cy.xpath("//button[contains(text(),'Submit')]");

const menu = () =>  cy.xpath("//tr[last()]/td[11]/button[1]/*[1]");
const edit_discount = () =>  cy.xpath("//body[1]/div[1]/div[1]/div[2]");

describe('Function Discount-Category', () => {
    beforeEach(() => {
        cy.clearCookies();
        login();
        cy.wait(2000);
        cy.reload();
        cy.wait(1000);
        cy.visit('https://admin-staging.digiboxs.com/discount');
    });

    it.skip('Create Discount-Category', () => {
        create_discount()
            .should('exist')
            .should('be.visible')
            .click({ timeout: 10000 });
        cy.wait(2000);
        cy.task('fetchGoogleSheetData', { range: 'Discount!E2:P13' }).then(data => {
            data.forEach((row, index) => {
                const [linkpicture,dtdiscounttype,dttitle,dtdiscountCode,dtpercentage,dtmaxDiscount,dtminPrice,
                    dtmaxUsage,dtdate,dtcondition,dtdescription,ExpectedAlertMessage ] = row;

                if (linkpicture) {
                    const fileName = 'discount-category.jpg';
                    cy.task('downloadFileFromUrl', { url: linkpicture, fileName }).then((filePath) => {
                        // ใช้ fileName โดยตรงแทนที่จะใช้ filePath
                        cy.fixture(fileName).then(() => {
                            picture().attachFile(fileName);
                        });
                    });
                }
                if(dtdiscounttype){
                    discounttype().select('คูปองสินค้า',{force: true});
                }
                if(dttitle){
                    title().type(dttitle);
                }
                if(dtdiscountCode){
                    discountCode().type(dtdiscountCode);
                }
                if(dtpercentage){
                    percentage().type(dtpercentage);
                }
                if(dtmaxDiscount){
                    maxDiscount().type(dtmaxDiscount);
                }
                if(dtminPrice){
                    minPrice().type(dtminPrice);
                }
                if(dtmaxUsage){
                    maxUsage().type(dtmaxUsage);
                }
                if(dtdate){
                    startdate().click();
                    cy.wait(1000);
                    enddate().click();
                }
                if(dtcondition){
                    condition().type(dtcondition);
                }
                if(dtdescription){
                    description().type(dtdescription);
                }
                btsave()
                    .should('exist')
                    .should('be.visible')
                    .dblclick({ timeout: 10000 });
                cy.wait(2000);

                cy.contains(ExpectedAlertMessage).then(($alert) => {
                    if ($alert.length > 0) {
                        cy.log('Alert matches expected message');
                        cy.task('updateStatus', {
                            row: index + 2,
                            status: 'Pass',
                            column: 'Q',
                            sheetName: 'Discount'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    if (ExpectedAlertMessage === 'เพิ่มส่วนลดสำเร็จ'){
                        cy.visit('https://admin-staging.digiboxs.com/discount/create');
                        cy.wait(2000);
                    }
                    cy.reload();
                    cy.wait(2000);
                });
            });
        });
    });
    it.skip('Edit Discount-Category', () => {
        menu().click();
        cy.wait(2000);
        edit_discount()
            .should('exist')
            .should('be.visible')
            .click({ timeout: 10000 });
        cy.wait(2000);
        cy.task('fetchGoogleSheetData', { range: 'Discount!W2:AH13' }).then(data => {
            data.forEach((row, index) => {
                const [linkpicture,dtdiscounttype,dttitle,dtdiscountCode,dtpercentage,dtmaxDiscount,dtminPrice,
                    dtmaxUsage,dtdate,dtcondition,dtdescription,ExpectedAlertMessage ] = row;

                if (linkpicture) {
                    const fileName = 'discount-category.jpg';
                    cy.task('downloadFileFromUrl', { url: linkpicture, fileName }).then((filePath) => {
                        // ใช้ fileName โดยตรงแทนที่จะใช้ filePath
                        cy.fixture(fileName).then(() => {
                            picture().attachFile(fileName);
                        });
                    });
                }
                if(dtdiscounttype){
                    discounttype().select('คูปองสินค้า',{force: true});
                }
                if(dttitle){
                    title().clear().type(dttitle);
                }else {
                    title().clear();
                }
                if(dtdiscountCode){
                    discountCode().clear().type(dtdiscountCode);
                }else {
                    discountCode().clear();
                }
                if(dtpercentage){
                    percentage().clear().type(dtpercentage);
                }else {
                    percentage().clear();
                }
                if(dtmaxDiscount){
                    maxDiscount().clear().type(dtmaxDiscount);
                }else {
                    maxDiscount().clear();
                }
                if(dtminPrice){
                    minPrice().clear().type(dtminPrice);
                }else {
                    minPrice().clear();
                }
                if(dtmaxUsage){
                    maxUsage().clear().type(dtmaxUsage);
                }else {
                    maxUsage().clear();
                }
                if(dtcondition){
                    condition().clear().type(dtcondition);
                }else {
                    condition().clear();
                }
                if(dtdescription) {
                    description().clear().type(dtdescription);
                }else {
                    description().clear();
                }
                btsave()
                    .should('exist')
                    .should('be.visible')
                    .dblclick({ timeout: 10000 });
                cy.wait(2000);

                cy.contains(ExpectedAlertMessage).then(($alert) => {
                    if ($alert.length > 0) {
                        cy.log('Alert matches expected message');
                        cy.task('updateStatus', {
                            row: index + 2,
                            status: 'Pass',
                            column: 'AI',
                            sheetName: 'Discount'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    if (ExpectedAlertMessage === 'แก้ไขข้อมูลส่วนลดสำเร็จ'){
                        cy.visit('https://admin-staging.digiboxs.com/discount');
                        cy.wait(2000);
                        menu().click();
                        cy.wait(2000);
                        edit_discount()
                            .should('exist')
                            .should('be.visible')
                            .click({ timeout: 10000 });
                        cy.wait(2000);
                    }else {
                        cy.reload();
                        cy.wait(2000);
                    }
                });
            });
        });
    });

});