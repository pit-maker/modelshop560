const API_URL = "https://script.google.com/macros/s/AKfycbx9sT--dQOpkzDRzPleJH71P-nlUCx0JQytLU3N5AKEp5fsUlxirzcagoMGH-Q80IcVTw/exec";

export async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Ошибка загрузки данных:", err);
    return [];
  }
}
