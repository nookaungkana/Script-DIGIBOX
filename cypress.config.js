const { defineConfig } = require('cypress');
const { getData, updateStatus, downloadFile: downloadFileFromTest } = require('./test'); // เปลี่ยนชื่อฟังก์ชัน downloadFile
const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = defineConfig({
  e2e: {
    video: false,
    screenshotOnRunFailure: false,
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,ts}",
    setupNodeEvents(on, config) {
      // ลงทะเบียน task
      on('task', {
        // ดึงข้อมูลจาก Google Sheets
        async fetchGoogleSheetData({ range }) {
          const data = await getData(range); // ส่ง range ไปยังฟังก์ชัน getData
          return data;
        },

        // อัปเดตสถานะใน Google Sheets
        async updateStatus({ row, status, column, sheetName }) {
          await updateStatus(row, status, column, sheetName); // เรียกใช้ฟังก์ชันอัปเดตใน Google Sheets
          return null; // คืนค่า null เมื่อเสร็จสิ้น
        },

        // ดาวน์โหลดไฟล์จาก URL
        async downloadFileFromUrl({ url, fileName }) {
          const filePath = await downloadFileFromTest({ url, fileName }); // ใช้ฟังก์ชัน downloadFile จาก test.js
          return filePath;
        },

        // อ่านข้อมูลจากไฟล์
        readFromFile({ filePath }) {
          return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, filePath), 'utf8', (err, data) => {
              if (err) {
                return reject(err);
              }
              resolve(data);
            });
          });
        },

        // เขียนข้อมูลลงไฟล์
        writeToFile({ filePath, data }) {
          return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, filePath), data, (err) => {
              if (err) {
                return reject(err);
              }
              resolve(null);
            });
          });
        }
      });
    }
  },
});
