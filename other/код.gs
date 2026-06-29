const CACHE_FOLDER_NAME = "CacheData";
const STALE_AFTER_MS = 1 * 60 * 1000;
const TRANSLATION_SHEET_CANDIDATES = ["i18n", "translations_sheet"];

function doGet(e) {
  const lang = (e && e.parameter && e.parameter.lang) || "ru";
  const jsonFile = ensureJsonFile(lang);
  const content = jsonFile.getBlob().getDataAsString();

  return ContentService
    .createTextOutput(content)
    .setMimeType(ContentService.MimeType.JSON);
    //.setHeader("Access-Control-Allow-Origin", "*");
}

function getSpreadsheetLastUpdated() {
  // 1. Get the active spreadsheet object
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 2. Extract its unique ID
  let id = ss.getId();
  
  // 3. Open it as a generic file in Google Drive
  let file = DriveApp.getFileById(id);
  
  // 4. Retrieve the last updated Date object
  let lastUpdated = file.getLastUpdated();
  
  // Log the result (returns a JavaScript Date object)
 // Logger.log(lastUpdated);
  return lastUpdated;
}

function ensureJsonFile(lang) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  const spreadsheetUpdatedAt = getSpreadsheetLastUpdated();
  const fileName = getJsonFileName(lang);
  const existingFile = findJsonFile(fileName);

  const jsonContent = buildJsonContent(spreadsheet, sheet, lang);

  if (!existingFile) {
    return saveJsonFile(jsonContent, fileName);
  }

  const fileUpdatedAt = existingFile.getLastUpdated();
  const shouldRefresh = fileUpdatedAt.getTime() < spreadsheetUpdatedAt.getTime() - STALE_AFTER_MS;

  if (shouldRefresh) {
    existingFile.setContent(jsonContent);
  }

  return existingFile;
}

function buildJsonContent(spreadsheet, sheet, lang) {
  const translations = getTranslationsMap(spreadsheet);
  const values = sheet.getDataRange().getValues();

  if (values.length < 2) {
    return "[]";
  }

  const headers = values[0];
  const result = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];

    if (row.every(cell => cell === "")) continue;

    const item = {};

    headers.forEach((header, index) => {
      const rawValue = row[index];
      const normalizedHeader = String(header).trim().toLowerCase();

      if (String(header).endsWith("_i18n")) {
        const propertyName = String(header).replace(/_i18n$/, "");
        item[propertyName] = resolveTranslationValue(translations, rawValue, lang);
      } else if (normalizedHeader === "specs") {
        item[header] = parseSpecsArray(rawValue);
      } else {
        item[header] = rawValue;
      }
    });

    item.images = parseImageArray(item.allImages || "");
    item.image = item.images.length ? item.images[0] : "";

    delete item.allImages;

    result.push(item);
  }

  return JSON.stringify(result);
}

function saveJsonFile(content, fileName) {
  const folder = getOrCreateFolder(CACHE_FOLDER_NAME);
  const blob = Utilities.newBlob(content, MimeType.JSON, fileName);
  return folder.createFile(blob);
}

function findJsonFile(fileName) {
  const folder = getOrCreateFolder(CACHE_FOLDER_NAME);
  const files = folder.getFilesByName(fileName);

  if (!files.hasNext()) {
    return null;
  }

  let latestFile = null;

  while (files.hasNext()) {
    const file = files.next();
    if (!latestFile || file.getLastUpdated() > latestFile.getLastUpdated()) {
      latestFile = file;
    }
  }

  return latestFile;
}

function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);

  if (folders.hasNext()) {
    return folders.next();
  }

  return DriveApp.createFolder(folderName);
}

function getJsonFileName(lang) {
  const normalizedLang = String(lang || "ru").toLowerCase();
  if (normalizedLang === "en") return "products_en.json";
  if (normalizedLang === "uk") return "products_uk.json";
  return "products_ru.json";
}

function getTranslationsMap(spreadsheet) {
  const sheet = getTranslationsSheet(spreadsheet);
  if (!sheet) return {};

  const values = sheet.getDataRange().getValues();
  if (!values.length) return {};

  const headers = values[0].map(header => String(header || "").trim().toLowerCase());
  const keyIndex = headers.indexOf("key");
  const ruIndex = headers.indexOf("ru");
  const enIndex = headers.indexOf("en");
  const ukIndex = headers.indexOf("uk");

  if (keyIndex === -1) return {};

  const translations = {};

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (row.every(cell => cell === "")) continue;

    const key = String(row[keyIndex] || "").trim();
    if (!key) continue;

    translations[key] = {
      ru: ruIndex >= 0 ? String(row[ruIndex] || "").trim() : "",
      en: enIndex >= 0 ? String(row[enIndex] || "").trim() : "",
      uk: ukIndex >= 0 ? String(row[ukIndex] || "").trim() : ""
    };
  }

  return translations;
}

function getTranslationsSheet(spreadsheet) {
  for (const sheetName of TRANSLATION_SHEET_CANDIDATES) {
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (sheet) {
      const firstRow = sheet.getRange(1, 1, 1, 4).getValues()[0].map(value => String(value || "").trim().toLowerCase());
      if (firstRow.includes("key") && firstRow.includes("ru") && firstRow.includes("en") && firstRow.includes("uk")) {
        return sheet;
      }
    }
  }

  const sheets = spreadsheet.getSheets();
  for (const sheet of sheets) {
    const firstRow = sheet.getRange(1, 1, 1, 4).getValues()[0].map(value => String(value || "").trim().toLowerCase());
    if (firstRow.includes("key") && firstRow.includes("ru") && firstRow.includes("en") && firstRow.includes("uk")) {
      return sheet;
    }
  }

  return null;
}

function resolveTranslationValue(translations, key, lang) {
  const normalizedKey = String(key || "").trim();
  if (!normalizedKey) return "";

  const entry = translations[normalizedKey];
  if (!entry) return normalizedKey;

  const languagePriority = [lang, "ru", "en", "uk"];

  for (const language of languagePriority) {
    const value = entry[language];
    if (value) return value;
  }

  return normalizedKey;
}

function parseImageArray(rawValue) {
  return String(rawValue)
    .split(/[,;\n]/)
    .map(url => String(url || "").trim())
    .filter(Boolean)
    .map(convertDriveLink);
}

function parseSpecsArray(rawValue) {
  return String(rawValue || "")
    .split(/;/)
    .map(spec => String(spec || "").trim())
    .filter(Boolean);
}

function convertDriveLink(url) {
  if (!url) return "";

  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);

  if (!match) return url;

  return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
}