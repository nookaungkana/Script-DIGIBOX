require('cypress-xpath');
import { faker } from '@faker-js/faker';
import { login } from "../login.cy";
import 'cypress-file-upload';

// ฟังก์ชันสำหรับสุ่มตัวอักษร a-z จำนวน 3 ตัว
function getRandomLetters() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 3; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return result;
}

const create_blog = () => cy.xpath("//span[contains(text(),'สร้างบทความ')]");
const content = () => cy.xpath("//div[@class='ql-editor ql-blank']");

const title = () => cy.xpath("//input[@name='title']");
const description = () => cy.xpath("//input[@name='description']");
const keyword = () => cy.xpath("//input[@name='keyword']");

const type = () => cy.xpath("//div[@class='space-y-2'][4]/select");
const tags = () => cy.xpath("//button[@name='tags']");
const tags1 = () => cy.xpath("//div[1]/div[@role='group']/div[2]");

const urlSlug = () => cy.xpath("//input[@name='urlSlug']");
const thumbnailUrl = () => cy.xpath("//input[@name='thumbnailUrl']");
const btsave = () =>  cy.xpath("//button[contains(text(),'บันทึก')]");

describe('Function Blog', () => {
    beforeEach(() => {
        login();
        cy.wait(2000);
        cy.reload();
        cy.wait(1000);
        cy.visit('https://admin-staging.digiboxs.com/blog');

        //cy.xpath("//nav[1]/div[1]/div[1]").click();
        //cy.wait(1000);
        //cy.xpath("//SPAN[text()='บทความ']").click();
        //cy.wait(1000);

    });
    it('Create Blog', () => {
        create_blog().click();
        cy.wait(2000);
        cy.task('fetchGoogleSheetData', { range: 'Blog!E2:N11' }).then(data => {
            data.forEach((row, index) => {
                const [dtcontent, dttitle, dtdescription, dtkeyword, dttype, dttage, dturlslug, linkthumbnailUrl, ExpectedAlertMessage ] = row;

                if(dtcontent){
                   content().type(faker.lorem.paragraph());
                }
                if(dttitle){
                    title().type(faker.lorem.sentence());
                }
                if (dtdescription){
                    description().type(faker.lorem.sentence());
                }
                if (dtkeyword){
                    keyword().type(faker.lorem.words());
                }
                if (dttype){
                    type().select('test');
                }
                if (dttage){
                    tags().click();
                    tags1().click();
                }
                if (dturlslug){
                    urlSlug().type(getRandomLetters());
                }
                if (linkthumbnailUrl) {
                    thumbnailUrl().type(linkthumbnailUrl);
                }
                btsave().click();
                cy.wait(2000);

                cy.contains(ExpectedAlertMessage).then(($alert) => {
                    if ($alert.length > 0) {
                        cy.log('Alert matches expected message');
                        cy.task('updateStatus', {
                            row: index + 2,
                            status: 'Pass',
                            column: 'O',
                            sheetName: 'Blog'
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