const { google } = require('googleapis');
const fs = require('fs');
const { join} = require("node:path");
const axios = require('axios'); // นำเข้า axios

// ตั้งค่าการเข้าถึง Google Sheets API
const auth = new google.auth.GoogleAuth({
    keyFile: './keyaccountdigibox.json', // พาธของไฟล์ credentials.json
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// ฟังก์ชันทั่วไปสำหรับการดึงข้อมูล
async function getData(range) {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = '1sQjSOBk8w0djYDX98vD9lPP9c1bwlsM9d1kDClDHOpg'; // ID ของ Google Sheets

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        // ใช้ค่าเป็นอาร์เรย์ว่างถ้าไม่มีข้อมูล
        const values = response.data.values || [];
        return values;
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        return [];
    }
}

// ฟังก์ชันทั่วไปสำหรับการอัปเดตสถานะ
async function updateStatus(row, status, column, sheetName) {
    console.log(`Updating row ${row} with status: ${status} in sheet: ${sheetName}`); // Log ที่ส่งไป
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = '1sQjSOBk8w0djYDX98vD9lPP9c1bwlsM9d1kDClDHOpg'; // ID ของ Google Sheets // ID ของ Google Sheets
    const range = `${sheetName}!${column}${row}`; // ใช้ชื่อชีตในการระบุตำแหน่ง

    try {
        const response = await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            resource: {
                values: [[status]] // ใส่ข้อมูลสถานะ (Pass หรือ Fail)
            },
        });

        console.log(`Row ${row} updated successfully with status: ${status}`);
        console.log(response.data); // Log ข้อมูลการตอบกลับ
    } catch (error) {
        console.error('Error updating status in Google Sheets:', error);
    }
}

// ฟังก์ชันสำหรับดาวน์โหลดไฟล์
async function downloadFile({ url, fileName }) {
    if (!fileName || !url) {
        throw new Error('Missing "filePath" or "fileName". Please make sure you are passing either "filePath" or "fileName".');
    }
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer'
    });
    // ตรวจสอบสถานะของการตอบกลับ
    console.log('Response status:', response.status);
    if (response.status !== 200) {
        throw new Error(`Failed to download file from ${url}`);
    }
    const filePath = join(__dirname, '..', 'DIGIBOX', 'cypress', 'fixtures', fileName);
    console.log('Saving file to:', filePath); // แสดง path ที่กำลังจะบันทึก
    fs.writeFileSync(filePath, response.data);
    return filePath; // คืนค่า path ของไฟล์ที่ดาวน์โหลด
}

// ส่งออกฟังก์ชันทั้งหมด
module.exports = { getData, updateStatus, downloadFile };
