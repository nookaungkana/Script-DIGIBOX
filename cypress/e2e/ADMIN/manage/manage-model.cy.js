require('cypress-xpath');
import { login } from "../login.cy";
import 'cypress-file-upload';

const create_manage_model = () => cy.xpath("//span[contains(text(),'เพิ่มโมเดล')]");
const picture = () => cy.xpath("//input[@type='file']");
const select_product = () => cy.xpath("//select[@name='productId']");
const productid = () => cy.xpath("//select[@name='productId']/option[last()]");
const name = () => cy.xpath("//input[@name='name']");
const code = () => cy.xpath("//input[@name='modelCode']");
const description = () => cy.xpath("//textarea[@name='description']");
const btsave = () =>  cy.xpath("//button[contains(text(),'บันทึก')]");
const menu = () => cy.xpath("//tbody/tr[last()]/td[9]/button");
const edit_manage_model = () => cy.xpath("//body/div[1]/div[1]/div[4]");

describe('Function Manage-Model', () => {
  beforeEach(() => {
    cy.clearCookies();
    login();
    cy.wait(2000);
    cy.reload();
    cy.wait(1000);
    cy.visit('https://admin-staging.digiboxs.com/manage-model');
  });

  it.skip('Create Manage-Model', () => {
    create_manage_model()
        .should('exist')
        .should('be.visible')
        .dblclick({ timeout: 10000 });  // รอสูงสุด 10 วินาที
    cy.wait(2000);
    cy.task('fetchGoogleSheetData', { range: 'Manage-model!E2:J7' }).then(data => {
      data.forEach((row, index) => {
        const [linkpicture, dtproduct, dtname, dtcode, dtdescription, ExpectedAlertMessage ] = row;

        if (linkpicture) {
          const fileName = 'model.jpg';
          cy.task('downloadFileFromUrl', { url: linkpicture, fileName }).then((filePath) => {
            // ใช้ fileName โดยตรงแทนที่จะใช้ filePath
            cy.fixture(fileName).then(() => {
              picture().attachFile(fileName);
            });
          });
        }
        if(dtproduct){
          select_product()
              .find('option')      // หา element ทั้งหมดที่เป็น `option`
              .last()              // เลือก option สุดท้าย
              .invoke('val')       // ดึงค่า value ของ option นั้นออกมา
              .then((lastOptionValue) => {
                select_product().select(lastOptionValue, {force: true});
              });
        }
        if(dtname){
          name().type(dtname);
        }
        if(dtcode){
          code().type(dtcode);
        }
        if(dtdescription){
          description().type(dtdescription);
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
              column: 'K',
              sheetName: 'Manage-model'
            });
            console.log(`Updating row ${index + 2} with status Pass`);
          }
          cy.reload();
          cy.wait(2000);
          create_manage_model().click();
        });
      });
    });
  });
  it.skip('Edit Manage-Model', () => {
    cy.wait(1000);
    menu().click();
    cy.wait(1000);
    edit_manage_model().click();
    cy.wait(2000);
    cy.task('fetchGoogleSheetData', { range: 'Manage-model!Q2:V7' }).then(data => {
      data.forEach((row, index) => {
        const [linkpicture, dtproduct, dtname, dtcode, dtdescription, ExpectedAlertMessage ] = row;

        if (linkpicture) {
          const fileName = 'model.jpg';
          cy.task('downloadFileFromUrl', { url: linkpicture, fileName }).then((filePath) => {
            // ใช้ fileName โดยตรงแทนที่จะใช้ filePath
            cy.fixture(fileName).then(() => {
              picture().attachFile(fileName);
            });
          });
        }
        if(dtproduct){
          select_product()
              .find('option')      // หา element ทั้งหมดที่เป็น `option`
              .last()              // เลือก option สุดท้าย
              .invoke('val')       // ดึงค่า value ของ option นั้นออกมา
              .then((lastOptionValue) => {
                cy.wait(2000);
                select_product().select(lastOptionValue, {force: true});
              });
        }
        if(dtname){
          name().clear().type(dtname);
        }else {
          name().clear();
        }
        if(dtcode){
          code().clear().type(dtcode);
        }else {
          code().clear();
        }
        if(dtdescription){
          description().clear().type(dtdescription);
        }else {
          description().clear();
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
              column: 'W',
              sheetName: 'Manage-model'
            });
            console.log(`Updating row ${index + 2} with status Pass`);
          }
          cy.reload();
          cy.wait(2000);
          menu().click();
          cy.wait(1000);
          edit_manage_model().click();
        });
      });
    });
  });
});