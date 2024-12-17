require('cypress-xpath');
import { faker } from '@faker-js/faker';
import { login } from "../login.cy";
import 'cypress-file-upload';

const create_manage_product = () => cy.xpath("//span[contains(text(),'เพิ่มผลิตภัณฑ์')]");
const picture = () => cy.xpath("//input[@type='file']");
const name = () => cy.xpath("//input[@name='name']");
const category = () => cy.xpath("//select[@name='category']");
const categoryid = () => cy.xpath("//select[@name='category']/option[last()]").invoke('val');
const btsave = () =>  cy.xpath("//button[contains(text(),'บันทึก')]");

const menu = () => cy.xpath("//tbody/tr[last()]/td[6]/button");
const edit_manage_product = () => cy.xpath("//div[contains(text(),'แก้ไข')]");

describe('Function Manage-Product', () => {
  beforeEach(() => {
    cy.clearCookies();
    login();
    cy.wait(2000);
    cy.reload();
    cy.wait(1000);
    cy.visit('https://admin-staging.digiboxs.com/manage-product');
  });

  it.skip('Create Manage-Product', () => {
    create_manage_product().click();
    cy.wait(3000);
    cy.task('fetchGoogleSheetData', { range: 'Manage-product!E2:H5' }).then(data => {
      data.forEach((row, index) => {
        const [linkpicture, dtname, dtcategory, ExpectedAlertMessage ] = row;

        if (linkpicture) {
          const fileName = 'product.jpg';
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
        if(dtcategory){
          categoryid().then((lastOptionValue) => {
            // ใช้ select() เพื่อเลือกค่าจาก dropdown โดยอิงจากค่า value ของตัวเลือกสุดท้าย
            category().select(lastOptionValue,{force: true});
          });
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
              sheetName: 'Manage-product'
            });
            console.log(`Updating row ${index + 2} with status Pass`);
          }
          cy.reload();
          cy.wait(2000);
          create_manage_product().click();
        });
      });
    });
  });
  it.skip('Edit Manage-Product', () => {
    menu().click();
    cy.wait(2000);
    edit_manage_product().click();
    cy.wait(3000);

    cy.task('fetchGoogleSheetData', { range: 'Manage-product!Q2:T5' }).then(data => {
      data.forEach((row, index) => {
        const [linkpicture, dtname, dtcategory, ExpectedAlertMessage ] = row;

        if (linkpicture) {
          const fileName = 'product.jpg';
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
        if(dtcategory){
          categoryid().then((lastOptionValue) => {
            // ใช้ select() เพื่อเลือกค่าจาก dropdown โดยอิงจากค่า value ของตัวเลือกสุดท้าย
            category().select(lastOptionValue,{force: true});
          });
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
              sheetName: 'Manage-product'
            });
            console.log(`Updating row ${index + 2} with status Pass`);
          }
          cy.reload();
          cy.wait(2000);
          menu().click();
          cy.wait(2000);
          edit_manage_product().click();
        });
      });
    });
  });

});