/**
 * Google Apps Script backend for the RabNongAnes 2026 RSVP form.
 *
 * Setup: see apps-script/README.md.
 */

// Paste the Google Sheet ID (from its URL) here. Required for a standalone
// script — SpreadsheetApp.getActiveSpreadsheet() returns null when a script
// isn't bound to a sheet and isn't opened from its UI, which is what
// previously caused "Cannot read properties of null (reading 'appendRow')".
const SPREADSHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "Responses";

const HEADERS = [
  "Timestamp",
  "ชื่อ-นามสกุล",
  "ตำแหน่ง",
  "สะดวกเข้าร่วม",
  "ช่วงที่เข้าร่วม",
  "ร่วมมื้อเย็น",
  "ต้องการที่พัก",
  "จำนวนผู้ติดตาม",
  "การเดินทาง",
  "แพ้อาหาร",
  "หมายเหตุ"
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet_();

    sheet.appendRow([
      new Date(),
      data.fullName || "",
      data.position || "",
      data.attendance || "",
      Array.isArray(data.activities) ? data.activities.join(", ") : (data.activities || ""),
      data.dinner || "",
      data.accommodation || "",
      data.followers || "",
      data.transportation || "",
      data.foodAllergy || "",
      data.note || ""
    ]);

    return jsonResponse_({ success: true });
  } catch (error) {
    return jsonResponse_({ success: false, error: error.message });
  }
}

function getOrCreateSheet_() {
  const spreadsheet = SPREADSHEET_ID && SPREADSHEET_ID !== "PASTE_YOUR_GOOGLE_SHEET_ID_HERE"
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error("Spreadsheet not found. Set SPREADSHEET_ID in Code.gs.");
  }

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
  }

  return sheet;
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
