import {login} from "./cypress/e2e/ADMIN/login.cy";

const linkpicture = 'https://i.pinimg.com/736x/7e/1b/34/7e1b341cb8ae355d3597c3b984222523.jpg'; // แทนที่ด้วย URL ที่ถูกต้อง
const fileName = 'category.jpg';
const create_manage_category = () => cy.xpath("//span[contains(text(),'เพิ่มหมวดหมู่ผลิตภัณฑ์')]");
const picture = () => cy.xpath("//input[@type='file']");

// ทำการแนบไฟล์
login()
cy.wait(1000);
cy.visit('https://admin-staging.digiboxs.com/manage-category');
create_manage_category().click();
cy.wait(1000);
cy.task('downloadFile', { url: linkpicture, fileName }).then((filePath) => {
    console.log(`Downloaded file to: ${filePath}`);

    picture().attachFile(fileName);
});
