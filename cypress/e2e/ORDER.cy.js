import {loginApp} from "./App/login.cy";
import {login} from "./ADMIN/login.cy";
require('cypress-xpath');
import 'cypress-file-upload';

const Add_Order = () => cy.xpath("//span[contains(text(),'เพิ่มไปยังรถเข็น')]");

const Confirm_Order = () => cy.xpath("//button[contains(text(),'ยืนยันการสั่งซื้อ')]");
const Product_Coupon = () => cy.xpath("//button[contains(text(),'ดูคูปองที่ใช้ได้')]");
const Product_Coupon1 = () => cy.xpath("//input[@name=\"คูปองสินค้า\"]");
const btsaveCoupon = () => cy.xpath("//div[@class=\"box-bottom\"]/button");

const Proceed = () => cy.xpath("//button[contains(text(),'ดำเนินการต่อไป')]");
//const btsave = () => cy.xpath("//button[contains(text(),'ยืนยันการสั่งซื้อ')]");
//หมายเลขออเดอร์ที่ได้มา
const subheader = () => cy.xpath("//span[@class=\"subheader\"]");

const search = () => cy.xpath("//input[@type=\"search\"]");
const search2 = () => cy.xpath("//body[1]/div[2]/div[1]/div[1]/input[1]");

const Confirm_Quotation = () => cy.xpath("//button[contains(text(),'ยืนยันรายการเสนอราคา')]");

const orderDetail = () => cy.xpath("//button[contains(text(),'ดูรายละเอียด')]");
const payment_wrapper = () => cy.xpath("//div[@class=\"payment-wrapper\"]/button");
const picture = () => cy.xpath("//input[@type=\"file\"]");
const amount = () => cy.xpath("//input[@name=\"amount\"]");
const description = () => cy.xpath("//textarea[@name=\"description\"]");
const Confirm_Payment = () => cy.xpath("//button[contains(text(),'ยืนยันชำระเงิน')]");

const admin_confirm_Payment = () => cy.xpath("//button[contains(text(),'ยืนยันการชำระเงิน')]");

const menu = () => cy.xpath("//div[@class=\"order__item__name\"]/div/button/*[1]");
const Prepare_Data = () => cy.xpath("//div[contains(text(),'เตรียมข้อมูล')]");
const In_Production = () => cy.xpath("//div[contains(text(),'กำลังผลิต')]");
const Completed = () => cy.xpath("//div[contains(text(),'สำเร็จ')]");

const Confirm_Self_Pickup = () => cy.xpath("//button[contains(text(),'ยืนยันการรับสินค้าด้วยตัวเอง')]");
const name = () => cy.xpath("//input[@id='name']");
const description_Self_Pickup = () => cy.xpath("//textarea[@name=\"description\"]");
const btsaveConfirm_Self_Pickup = () => cy.xpath("//form[1]/div[1]/button[2]");
const Confirm_Success = () => cy.xpath("//button[contains(text(),'ยืนยันสถานะสำเร็จ')]");
const OK = () => cy.xpath("//button[contains(text(),'OK')]");

const Cancel_Quotation = () => cy.xpath("//button[contains(text(),'ยกเลิกรายการเสนอราคา')]");
const Description_Cancel = () => cy.xpath("//textarea[@name=\"description\"]");
const CFCancel_Quotation = () => cy.xpath("//button[contains(text(),'ยืนยันยกเลิกรายการ')]");

function checkAlertAndUpdateStatus(alertMessage, index, column) {
    if (alertMessage) {
        cy.wrap(null).then(() => {
            cy.contains(alertMessage).then(($alert) => {
                if ($alert.length > 0) {
                    cy.log('Alert matches expected message');
                    cy.task('updateStatus', {
                        row: index + 3,
                        status: 'Pass',
                        column: column,
                        sheetName: 'ชีต14'
                    });
                    console.log(`Updating row ${index + 3} with status Pass in column ${column}`);
                }
            });
        });
    }
}
let subheaderText = '';
const start = 3;
const end = 4;
function filterDataByRange(data, start, end) {
    return data.filter((_, index) => index + 1 >= start && index + 1 <= end);
}

const menudelivery = () => cy.xpath("//div[@aria-haspopup=\"menu\"]/img");
const shipping = () => cy.xpath("//div[contains(text(),'จัดส่งขนส่งเอกชน')]");
const addaddress = () => cy.xpath("//span[contains(text(),'เพิ่มที่อยู่')]");
const saveaddress = () => cy.xpath("//button[contains(text(),'บันทึก')]");


describe('Function Order', () => {
    beforeEach(() => {
        cy.wait(2000);
        cy.reload();
    });

    it('ADD Order App', () => {
        loginApp();
        cy.wait(2000);
        cy.visit('https://app-staging.digiboxs.com/customize');
        cy.wait(1000);
        Add_Order().click();
        cy.wait(1000);
        cy.task('fetchGoogleSheetData', { range: 'ชีต14!E3:J50' }).then(data => {
            const filteredData = filterDataByRange(data, start, end);
            filteredData.forEach((row, index) => {
                const [cforder, coupon, proceed, H, ExpectedAlertMessage] = row;

                if (cforder) {
                    cy.wait(2000);
                    Confirm_Order().click();
                }
                if (coupon) {
                    cy.wait(2000);
                    Product_Coupon().click();
                    cy.wait(2000);
                    Product_Coupon1().click();
                    cy.wait(2000);
                    btsaveCoupon().click();
                }
                if (proceed) {
                    cy.wait(2000);
                    Proceed().click();
                }
                if (H) {
                    cy.wait(2000);
                    Confirm_Order().click();
                    cy.wait(2000);
                    subheader().invoke('text').then((text) => {
                        cy.task('writeToFile', { filePath: 'cypress/fixtures/subheaderText.txt', data: text });
                    });
                }
                checkAlertAndUpdateStatus(ExpectedAlertMessage, index, 'J');
            });
        });
    });
    it('CF Order Admin', () => {
        login();
        cy.wait(2000);
        cy.visit('https://admin-staging.digiboxs.com/order');
        cy.wait(1000);
        search().click();
        cy.wait(1000);
        cy.log(subheaderText);
        cy.task('readFromFile', { filePath: 'cypress/fixtures/subheaderText.txt'}).then((text) => {
            cy.log('Read from file:', text);
            subheaderText = text;
            search2().type(subheaderText, { delay: 200 });
        });
        cy.wait(1000);
        cy.xpath("//div[@data-radix-scroll-area-viewport]/div/div/div[1]").click();

        cy.task('fetchGoogleSheetData', { range: 'ชีต14!K3:O50' }).then(data => {
            const filteredData = filterDataByRange(data, start, end);
            filteredData.forEach((row, index) => {
                const [ccquotation, descriptioncc, cfquotation, ExpectedAlertMessage] = row;

                if(ccquotation){
                    cy.wait(1000);
                    Cancel_Quotation().click();
                    if(descriptioncc){
                        cy.wait(1000);
                        Description_Cancel().type(descriptioncc);
                    }
                    cy.wait(1000);
                    CFCancel_Quotation().click();
                }
                if (cfquotation) {
                    cy.wait(2000);
                    Confirm_Quotation().click();
                }
                checkAlertAndUpdateStatus(ExpectedAlertMessage, index, 'O');
                cy.wait(2000);
                cy.reload();
            });
        });
    });
    it('CF Payment App', () => {
        loginApp()
        cy.wait(2000);
        cy.visit('https://app-staging.digiboxs.com/my-orders?status=2');
        cy.wait(1000);
        orderDetail().click();
        cy.wait(1000);
        payment_wrapper().click();
        cy.wait(1000);
        cy.task('fetchGoogleSheetData', { range: 'ชีต14!P3:V50' }).then(data => {
            const filteredData = filterDataByRange(data, start, end);
            filteredData.forEach((row, index) => {
                const [linkpicture, dtamount, date, dtdescription, button, ExpectedAlertMessage] = row;

                if (linkpicture) {
                    const fileName = 'slip_payment.jpg';
                    cy.task('downloadFileFromUrl', { url: linkpicture, fileName }).then((filePath) => {
                        cy.fixture(fileName).then(() => {
                            picture().attachFile(fileName);
                        });
                    });
                }
                if (dtamount) {
                    amount().type(dtamount);
                }else {
                    amount().clear();
                }
                if (dtdescription) {
                    description().type(dtdescription);

                }else {
                    description().clear();
                }
                if (button){
                    cy.wait(1000);
                    Confirm_Payment().click();
                }
                checkAlertAndUpdateStatus(ExpectedAlertMessage, index, 'V');
            });
        });
    });
    it('CF Payment Admin', () => {
        login();
        cy.wait(2000);
        cy.visit('https://admin-staging.digiboxs.com/order');
        cy.wait(1000);
        search().click();
        cy.wait(1000);
        cy.log(subheaderText);
        cy.task('readFromFile', { filePath: 'cypress/fixtures/subheaderText.txt'}).then((text) => {
            cy.log('Read from file:', text);
            subheaderText = text;
            search2().type(subheaderText, { delay: 200 });
        });
        cy.wait(1000);
        cy.task('fetchGoogleSheetData', { range: 'ชีต14!W3:AA50' }).then(data => {
            const filteredData = filterDataByRange(data, start, end);
            filteredData.forEach((row, index) => {
                const [ccpayment, description, cfpayment, ExpectedAlertMessage] = row;

                if(ccpayment){
                    if(description){

                    }
                }
                if(cfpayment) {
                    cy.wait(2000);
                    cy.xpath("//div[@data-radix-scroll-area-viewport]/div/div/div[1]").click();
                    cy.wait(2000);
                    admin_confirm_Payment().click();
                }
                checkAlertAndUpdateStatus(ExpectedAlertMessage, index, 'AA');
            });
        });
    });
    it('Update Status Admin', () => {
        login();
        cy.wait(2000);
        cy.visit('https://admin-staging.digiboxs.com/order');
        cy.wait(1000);
        search().click({ force: true });
        cy.wait(2000);
        cy.log(subheaderText);
        cy.task('readFromFile', { filePath: 'cypress/fixtures/subheaderText.txt'}).then((text) => {
            cy.log('Read from file:', text);
            subheaderText = text;
            search2().type(subheaderText, { delay: 300 });
        });
        cy.wait(1000);
        cy.xpath("//div[@data-radix-scroll-area-viewport]/div/div/div[1]").click();

        cy.task('fetchGoogleSheetData', { range: 'ชีต14!AB3:AF50' }).then(data => {
            const filteredData = filterDataByRange(data, start, end);
            filteredData.forEach((row, index) => {
                const [dtPrepare_Data, dtIn_Production, dtCompleted, ExpectedAlertMessage] = row;

                if (dtPrepare_Data) {
                    cy.wait(1000);
                    menu().click();
                    cy.wait(1000);
                    Prepare_Data().click();
                }
                if (dtIn_Production) {
                    cy.wait(1000);
                    menu().click();
                    cy.wait(1000);
                    In_Production().click();
                }
                if (dtCompleted) {
                    cy.wait(1000);
                    menu().click();
                    cy.wait(1000);
                    Completed().click();
                }
                checkAlertAndUpdateStatus(ExpectedAlertMessage, index, 'AG');
            });
        });
    });
    it('CF Self_Pickup Admin', () => {
        login();
        cy.wait(2000);
        cy.visit('https://admin-staging.digiboxs.com/order');
        cy.wait(1000);
        search().click({ force: true });
        cy.wait(2000);
        cy.log(subheaderText);
        cy.task('readFromFile', { filePath: 'cypress/fixtures/subheaderText.txt'}).then((text) => {
            cy.log('Read from file:', text);
            subheaderText = text;
            search2().type(subheaderText, { delay: 300 });
        });
        cy.wait(1000);
        cy.xpath("//div[@data-radix-scroll-area-viewport]/div/div/div[1]").click();
        cy.wait(2000);
        Confirm_Self_Pickup().click();

        cy.task('fetchGoogleSheetData', { range: 'ชีต14!AG3:AJ50' }).then(data => {
            const filteredData = filterDataByRange(data, start, end);
            filteredData.forEach((row, index) => {
                const [dtname, dtdescription, ExpectedAlertMessage] = row;

                if (dtname) {
                    cy.wait(1000);
                    name().type(dtname);
                }else {
                    cy.wait(1000);
                    name().clear();
                }
                if (dtdescription) {
                    cy.wait(1000);
                    description_Self_Pickup().type(dtdescription);
                }else {
                    cy.wait(1000);
                    description_Self_Pickup().clear();
                }
                cy.wait(1000);
                btsaveConfirm_Self_Pickup().click();
                checkAlertAndUpdateStatus(ExpectedAlertMessage, index, 'AJ');
            });
        });
    });
    it('CF Success Admin', () => {
        login();
        cy.wait(2000);
        cy.visit('https://admin-staging.digiboxs.com/order');
        cy.wait(1000);
        search().click({ force: true });
        cy.wait(2000);
        cy.log(subheaderText);
        cy.task('readFromFile', { filePath: 'cypress/fixtures/subheaderText.txt'}).then((text) => {
            cy.log('Read from file:', text);
            subheaderText = text;
            search2().type(subheaderText, { delay: 300 });
        });
        cy.wait(1000);
        cy.xpath("//div[@data-radix-scroll-area-viewport]/div/div/div[1]").click();
        cy.wait(2000);

        cy.task('fetchGoogleSheetData', { range: 'ชีต14!AK3:AM50' }).then(data => {
            const filteredData = filterDataByRange(data, start, end);
            filteredData.forEach((row, index) => {
                const [cfsuccess, ExpectedAlertMessage] = row;

                if (cfsuccess) {
                    cy.wait(1000);
                    Confirm_Success().click();
                }
                checkAlertAndUpdateStatus(ExpectedAlertMessage, index, 'AN');
            });
        });
    });

//==============================================================================
    it('ADD Order Delivery App', () => {
        loginApp();
        cy.wait(2000);
        cy.visit('https://app-staging.digiboxs.com/customize');
        cy.wait(1000);
        Add_Order().click();
        cy.wait(1000);
        cy.task('fetchGoogleSheetData', { range: 'Order Self-pickup!E3:K50' }).then(data => {
            const filteredData = filterDataByRange(data, start, end);
            filteredData.forEach((row, index) => {
                const [cforder, delivery, address, coupon, proceed, cforder2, ExpectedAlertMessage] = row;

                if (cforder) {
                    cy.wait(2000);
                    Confirm_Order().click();
                }
                if(delivery){
                    cy.wait(2000);
                    menudelivery().should('be.visible').click();
                    cy.wait(2000);
                    shipping().click();
                }
                if(address){
                    cy.wait(2000);
                    addaddress().click();
                    cy.wait(2000);
                    saveaddress().click();
                }
                if (coupon) {
                    cy.wait(2000);
                    Product_Coupon().click();
                    cy.wait(2000);
                    Product_Coupon1().click();
                    cy.wait(2000);
                    btsaveCoupon().click();
                }
                if (proceed) {
                    cy.wait(2000);
                    Proceed().click();
                }
                if (cforder2) {
                    cy.wait(2000);
                    Confirm_Order().click();
                    cy.wait(2000);
                    subheader().invoke('text').then((text) => {
                        cy.task('writeToFile', { filePath: 'cypress/fixtures/subheaderText.txt', data: text });
                    });
                }
                checkAlertAndUpdateStatus(ExpectedAlertMessage, index, 'L');
            });
        });
    });
    it.only('CF Order Admin', () => {
        login();
        cy.wait(2000);
        cy.visit('https://admin-staging.digiboxs.com/order');
        cy.wait(1000);
        search().click();
        cy.wait(1000);
        cy.log(subheaderText);
        cy.task('readFromFile', { filePath: 'cypress/fixtures/subheaderText.txt'}).then((text) => {
            cy.log('Read from file:', text);
            subheaderText = text;
            search2().type(subheaderText, { delay: 200 });
        });
        cy.wait(1000);
        cy.xpath("//div[@data-radix-scroll-area-viewport]/div/div/div[1]").click();

        cy.task('fetchGoogleSheetData', { range: 'Order Self-pickup!M3:Q50' }).then(data => {
            const filteredData = filterDataByRange(data, start, end);
            filteredData.forEach((row, index) => {
                const [ccquotation, descriptioncc, cfquotation, ExpectedAlertMessage] = row;

                if(ccquotation){
                    cy.wait(1000);
                    Cancel_Quotation().click();
                    if(descriptioncc){
                        cy.wait(1000);
                        Description_Cancel().type(descriptioncc);
                    }
                    cy.wait(1000);
                    CFCancel_Quotation().click();
                }
                if (cfquotation) {
                    cy.wait(2000);
                    Confirm_Quotation().click();
                }
                checkAlertAndUpdateStatus(ExpectedAlertMessage, index, 'O');
                cy.wait(2000);
                cy.reload();
            });
        });
    });

});