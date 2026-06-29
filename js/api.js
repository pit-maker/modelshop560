const API_URL = "https://script.google.com/macros/s/AKfycbxMFj_oYxpTkih-wfIoFpj_xphK9-K3ahPBCvWtTT7oq-5FwqKmvXLhHc5G-cSW6P1TbA/exec";

export async function loadProducts() {
  try {
    const lang = localStorage.getItem("appLanguage") || document.documentElement.lang || "ru";
    const res = await fetch(`${API_URL}?lang=${encodeURIComponent(lang)}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Ошибка загрузки данных:", err);
    return [];
  }
}
