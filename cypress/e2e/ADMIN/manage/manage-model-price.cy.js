require('cypress-xpath');
import { login } from "../login.cy";
import 'cypress-file-upload';

const menu = () => cy.xpath("//tbody/tr[1]/td[9]/button");
const create_model_price = () => cy.xpath("//body[1]/div[1]/div[1]/div[2]");
const amount1 = () => cy.xpath("//input[@name=\"modelPrices.0.amount\"]");
const price1 = () => cy.xpath("//input[@name=\"modelPrices.0.price\"]");
const percentage1 = () => cy.xpath("//input[@name=\"modelPrices.0.percentage\"]");

const amount2 = () => cy.xpath("//input[@name=\"modelPrices.1.amount\"]");
const price2 = () => cy.xpath("//input[@name=\"modelPrices.1.price\"]");
const percentage2 = () => cy.xpath("//input[@name=\"modelPrices.1.percentage\"]");

const amount3 = () => cy.xpath("//input[@name=\"modelPrices.2.amount\"]");
const price3 = () => cy.xpath("//input[@name=\"modelPrices.2.price\"]");
const percentage3 = () => cy.xpath("//input[@name=\"modelPrices.2.percentage\"]");

const amount4 = () => cy.xpath("//input[@name=\"modelPrices.3.amount\"]");
const price4 = () => cy.xpath("//input[@name=\"modelPrices.3.price\"]");
const percentage4 = () => cy.xpath("//input[@name=\"modelPrices.3.percentage\"]");

const amount5 = () => cy.xpath("//input[@name=\"modelPrices.4.amount\"]");
const price5 = () => cy.xpath("//input[@name=\"modelPrices.4.price\"]");
const percentage5 = () => cy.xpath("//input[@name=\"modelPrices.4.percentage\"]");

const amount6 = () => cy.xpath("//input[@name=\"modelPrices.5.amount\"]");
const price6 = () => cy.xpath("//input[@name=\"modelPrices.5.price\"]");
const percentage6 = () => cy.xpath("//input[@name=\"modelPrices.5.percentage\"]");
const btsave = () =>  cy.xpath("//button[contains(text(),'บันทึก')]");

describe('Function Manage-Model-Price', () => {
    beforeEach(() => {
        cy.clearCookies();
        login();
        cy.wait(2000);
        cy.reload();
        cy.wait(1000);
        cy.visit('https://admin-staging.digiboxs.com/manage-model');
    });

    it.skip('Create Manage-Model-Price', () => {
        menu().click();
        cy.wait(1000);
        create_model_price()
            .should('exist')
            .should('be.visible')
            .dblclick({ timeout: 10000 });  // รอสูงสุด 10 วินาที
        cy.wait(2000);
        cy.task('fetchGoogleSheetData', { range: 'Manage-model-price!E2:W22' }).then(data => {
            data.forEach((row, index) => {
                const [dtamount1, dtprice1, dtpercentage1, dtamount2, dtprice2, dtpercentage2,
                    dtamount3, dtprice3, dtpercentage3, dtamount4, dtprice4, dtpercentage4,
                    dtamount5, dtprice5, dtpercentage5, dtamount6, dtprice6, dtpercentage6, ExpectedAlertMessage ] = row;

                if (dtamount1) {
                    amount1().clear().type(dtamount1);
                } else {
                    amount1().clear();
                }
                if (dtprice1) {
                    price1().clear().type(dtprice1);
                } else {
                    price1().clear();
                }
                if (dtpercentage1) {
                    percentage1().clear().type(dtpercentage1);
                } else {
                    percentage1().clear();
                }
                //=====================================
                if (dtamount2) {
                    amount2().clear().type(dtamount2);
                } else {
                    amount2().clear();
                }
                if (dtprice2) {
                    price2().clear().type(dtprice2);
                } else {
                    price2().clear();
                }
                if (dtpercentage2) {
                    percentage2().clear().type(dtpercentage2);
                } else {
                    percentage2().clear();
                }
                //=====================================
                if (dtamount3) {
                    amount3().clear().type(dtamount3);
                } else {
                    amount3().clear();
                }
                if (dtprice3) {
                    price3().clear().type(dtprice3);
                } else {
                    price3().clear();
                }
                if (dtpercentage3) {
                    percentage3().clear().type(dtpercentage3);
                } else {
                    percentage3().clear();
                }
                //=====================================
                if (dtamount4) {
                    amount4().clear().type(dtamount4);
                } else {
                    amount4().clear();
                }
                if (dtprice4) {
                    price4().clear().type(dtprice4);
                } else {
                    price4().clear();
                }
                if (dtpercentage4) {
                    percentage4().clear().type(dtpercentage4);
                } else {
                    percentage4().clear();
                }
                //=====================================
                if (dtamount5) {
                    amount5().clear().type(dtamount5);
                } else {
                    amount5().clear();
                }
                if (dtprice5) {
                    price5().clear().type(dtprice5);
                } else {
                    price5().clear();
                }
                if (dtpercentage5) {
                    percentage5().clear().type(dtpercentage5);
                } else {
                    percentage5().clear();
                }
                //=====================================
                if (dtamount6) {
                    amount6().clear().type(dtamount6);
                } else {
                    amount6().clear();
                }
                if (dtprice6) {
                    price6().clear().type(dtprice6);
                } else {
                    price6().clear();
                }
                if (dtpercentage6) {
                    percentage6().clear().type(dtpercentage6);
                } else {
                    percentage6().clear();
                }
                //=====================================
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
                            column: 'X',
                            sheetName: 'Manage-model-price'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    cy.reload();
                    cy.wait(2000);
                    menu().click();
                    cy.wait(1000);
                    create_model_price()
                        .should('exist')
                        .should('be.visible')
                        .dblclick({ timeout: 10000 });
                });
            });
        });
    });
    it.skip('Edit Manage-Model-Price', () => {
        menu().click();
        cy.wait(1000);
        create_model_price()
            .should('exist')
            .should('be.visible')
            .dblclick({ timeout: 10000 });  // รอสูงสุด 10 วินาที
        cy.wait(2000);
        cy.task('fetchGoogleSheetData', { range: 'Manage-model-price!AD2:AV22' }).then(data => {
            data.forEach((row, index) => {
                const [dtamount1, dtprice1, dtpercentage1, dtamount2, dtprice2, dtpercentage2,
                    dtamount3, dtprice3, dtpercentage3, dtamount4, dtprice4, dtpercentage4,
                    dtamount5, dtprice5, dtpercentage5, dtamount6, dtprice6, dtpercentage6, ExpectedAlertMessage ] = row;

                if (dtamount1) {
                    amount1().clear().type(dtamount1);
                } else {
                    amount1().clear();
                }
                if (dtprice1) {
                    price1().clear().type(dtprice1);
                } else {
                    price1().clear();
                }
                if (dtpercentage1) {
                    percentage1().clear().type(dtpercentage1);
                } else {
                    percentage1().clear();
                }
                //=====================================
                if (dtamount2) {
                    amount2().clear().type(dtamount2);
                } else {
                    amount2().clear();
                }
                if (dtprice2) {
                    price2().clear().type(dtprice2);
                } else {
                    price2().clear();
                }
                if (dtpercentage2) {
                    percentage2().clear().type(dtpercentage2);
                } else {
                    percentage2().clear();
                }
                //=====================================
                if (dtamount3) {
                    amount3().clear().type(dtamount3);
                } else {
                    amount3().clear();
                }
                if (dtprice3) {
                    price3().clear().type(dtprice3);
                } else {
                    price3().clear();
                }
                if (dtpercentage3) {
                    percentage3().clear().type(dtpercentage3);
                } else {
                    percentage3().clear();
                }
                //=====================================
                if (dtamount4) {
                    amount4().clear().type(dtamount4);
                } else {
                    amount4().clear();
                }
                if (dtprice4) {
                    price4().clear().type(dtprice4);
                } else {
                    price4().clear();
                }
                if (dtpercentage4) {
                    percentage4().clear().type(dtpercentage4);
                } else {
                    percentage4().clear();
                }
                //=====================================
                if (dtamount5) {
                    amount5().clear().type(dtamount5);
                } else {
                    amount5().clear();
                }
                if (dtprice5) {
                    price5().clear().type(dtprice5);
                } else {
                    price5().clear();
                }
                if (dtpercentage5) {
                    percentage5().clear().type(dtpercentage5);
                } else {
                    percentage5().clear();
                }
                //=====================================
                if (dtamount6) {
                    amount6().clear().type(dtamount6);
                } else {
                    amount6().clear();
                }
                if (dtprice6) {
                    price6().clear().type(dtprice6);
                } else {
                    price6().clear();
                }
                if (dtpercentage6) {
                    percentage6().clear().type(dtpercentage6);
                } else {
                    percentage6().clear();
                }
                //=====================================
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
                            column: 'AW',
                            sheetName: 'Manage-model-price'
                        });
                        console.log(`Updating row ${index + 2} with status Pass`);
                    }
                    cy.reload();
                    cy.wait(2000);
                    menu().click();
                    cy.wait(1000);
                    create_model_price()
                        .should('exist')
                        .should('be.visible')
                        .dblclick({ timeout: 10000 });
                });
            });
        });
    });
});