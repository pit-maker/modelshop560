function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const values = sheet.getDataRange().getValues();

  if (values.length < 2) {
    return ContentService
      .createTextOutput("[]")
      .setMimeType(ContentService.MimeType.JSON);
  }

  const headers = values[0];
  const result = [];

  for (let i = 1; i < values.length; i++) {

    const row = values[i];

    // Пропускаем полностью пустые строки
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

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
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