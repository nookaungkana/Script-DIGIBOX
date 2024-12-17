require('cypress-xpath');
import { faker } from '@faker-js/faker';
import { login } from "./login.cy";
import 'cypress-file-upload';

const create_discount_category = () => cy.xpath("//div[@class=\"flex justify-end items-center\"]/button");
const picture = () => cy.xpath("//input[@type='file']");
const name = () => cy.xpath("//input[@name='name']");
const btsave = () =>  cy.xpath("//button[contains(text(),'บันทึก')]");
const menu = () =>  cy.xpath("//tbody[1]/tr[last()]/td[3]/button[1]");
const edit_discount_category = () =>  cy.xpath("//body[1]/div[1]/div[1]/div[2]");

describe('Function Discount-Category', () => {
  beforeEach(() => {
    cy.clearCookies();
    login();
    cy.wait(2000);
    cy.reload();
    cy.wait(1000);
    cy.visit('https://admin-staging.digiboxs.com/discount-category');
  });

  it.skip('Create Discount-Category', () => {
    create_discount_category().click();
    cy.wait(5000);
    cy.task('fetchGoogleSheetData', { range: 'Discount-category!E2:G4' }).then(data => {
      data.forEach((row, index) => {
        const [linkpicture, dtname, ExpectedAlertMessage ] = row;

        if (linkpicture) {
          const fileName = 'discount-category.jpg';
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
        btsave().click();
        cy.wait(2000);

        cy.contains(ExpectedAlertMessage).then(($alert) => {
          if ($alert.length > 0) {
            cy.log('Alert matches expected message');
            cy.task('updateStatus', {
              row: index + 2,
              status: 'Pass',
              column: 'H',
              sheetName: 'Discount-category'
            });
            console.log(`Updating row ${index + 2} with status Pass`);
          }
          cy.reload();
          cy.wait(2000);
          create_discount_category().click();
        });
      });
    });
  });
  it.skip('Edit Discount-Category', () => {
    menu().click();
    cy.wait(1000);
    edit_discount_category()
        .should('exist')
        .should('be.visible')
        .click({ timeout: 10000 });
    cy.wait(2000);
    cy.task('fetchGoogleSheetData', { range: 'Discount-category!Q2:S4' }).then(data => {
      data.forEach((row, index) => {
        const [linkpicture, dtname, ExpectedAlertMessage ] = row;

        if (linkpicture) {
          const fileName = 'discount-category.jpg';
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
        btsave().click();
        cy.wait(2000);

        cy.contains(ExpectedAlertMessage).then(($alert) => {
          if ($alert.length > 0) {
            cy.log('Alert matches expected message');
            cy.task('updateStatus', {
              row: index + 2,
              status: 'Pass',
              column: 'T',
              sheetName: 'Discount-category'
            });
            console.log(`Updating row ${index + 2} with status Pass`);
          }
          cy.reload();
          cy.wait(2000);
          menu().click();
          cy.wait(1000);
          edit_discount_category()
              .should('exist')
              .should('be.visible')
              .click({ timeout: 10000 });
        });
      });
    });
  });
});


