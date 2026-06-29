const JSON_FILE_NAME = "products.json";
const CACHE_FOLDER_NAME = "CacheData";
const STALE_AFTER_MS = 10 * 60 * 1000;

function doGet() {
  const jsonFile = ensureJsonFile();
  const content = jsonFile.getBlob().getDataAsString();

  return ContentService
    .createTextOutput(content)
    .setMimeType(ContentService.MimeType.JSON);
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

function ensureJsonFile() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  const spreadsheetUpdatedAt = getSpreadsheetLastUpdated();
  const existingFile = findJsonFile();

  const jsonContent = buildJsonContent(sheet);

  if (!existingFile) {
    return saveJsonFile(jsonContent);
  }

  const fileUpdatedAt = existingFile.getLastUpdated();
  const shouldRefresh = fileUpdatedAt.getTime() < spreadsheetUpdatedAt.getTime() - STALE_AFTER_MS;

  if (shouldRefresh) {
    existingFile.setContent(jsonContent);
  }

  return existingFile;
}

function buildJsonContent(sheet) {
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
      item[header] = row[index];
    });

    item.images = parseImageArray(item.allImages || "");
    item.image = item.images.length ? item.images[0] : "";

    delete item.allImages;

    result.push(item);
  }

  return JSON.stringify(result);
}

function saveJsonFile(content) {
  const folder = getOrCreateFolder(CACHE_FOLDER_NAME);
  const blob = Utilities.newBlob(content, MimeType.JSON, JSON_FILE_NAME);
  return folder.createFile(blob);
}

function findJsonFile() {
  const folder = getOrCreateFolder(CACHE_FOLDER_NAME);
  const files = folder.getFilesByName(JSON_FILE_NAME);

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

function parseImageArray(rawValue) {
  return String(rawValue)
    .split(/[,;\n]/)
    .map(url => String(url || "").trim())
    .filter(Boolean)
    .map(convertDriveLink);
}

function convertDriveLink(url) {
  if (!url) return "";

  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);

  if (!match) return url;

  return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
}