require('cypress-xpath');
import { faker } from '@faker-js/faker';
import { login } from "../login.cy";
import 'cypress-file-upload';

const create_blog_type = () => cy.get('.flex-col.gap-4 > :nth-child(1) > .inline-flex');
const name = () => cy.xpath("//input[@name='name']");
const urlSlug = () => cy.xpath("//input[@name='urlSlug']");
const btsave = () => cy.xpath("//button[contains(text(),'บันทึก')]");

describe('Function Blog Type', () => {
  beforeEach(() => {
    cy.clearCookies();
    login();
    cy.wait(2000);
    cy.reload();
    cy.wait(1000);
    cy.visit('https://admin-staging.digiboxs.com/blog-type');

  });
  it('Create Blog Type', () => {
    create_blog_type().dblclick();
    cy.wait(5000);
    cy.task('fetchGoogleSheetData', { range: 'Blog-type!E2:G4' }).then(data => {
      data.forEach((row, index) => {
        const [dtname, dturlslug, ExpectedAlertMessage ] = row;

        if(dtname){
          name().type(dtname);
        }
        if(dturlslug){
          urlSlug().type(dturlslug);
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
              sheetName: 'Blog-type'
            });
            console.log(`Updating row ${index + 2} with status Pass`);
          }
          cy.reload();
          cy.wait(2000);
        });
      });
    });
  });
});