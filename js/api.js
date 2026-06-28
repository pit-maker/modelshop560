const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnSOhGm0J6oTXW8lFSd9y5lQGZ4KQrVs8SGnHd77_PQDbiZunmYStxQLWtQStBgC7Fl5d32nYuP_lqGa3f2k-5-8aaEhsicMjkVho0-zwqtSc4dhurN9QLToibv_RcgHAqYoTGU1vaHu73xWIk2HL_D52bzSLiVXnWE3aCwV6eH6g4zNUrS4OBw4-JDq1yRf1aR_SoVonMIvBAlnBfAYDfmQrmud_AKLpN6JtwLe9IhVQeOPwlC1JwpHmq6SOT0SZTS1RD2GZWUyORw1hzi0WPp645Fetg&lib=MlRQs5rfKg_r8UnphOtcUBKetveII9RHp";

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
