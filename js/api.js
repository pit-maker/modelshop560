const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnRtmjchaFqXKWEHl9azzHzVfLA7pOyqzy2FeTLThRKi2PhUuXZnu7ShplnL6EzqqE9g0Qo7XKLaJODwhv60-g13Q-g4BF6-DsPAqSKKtLo2fQkY7ZcDLCYHo6ZlMIKE8nuk3Yk8QUrLsnIdclnsdKoKk30rj0OFAxj12ggveNYiWX_6Wv4NEmURRnUFryUtB0nuK5Iouw1yp-9_FAvaSYRlc0DtIJPOaGWJ5LipiICyNDh6iRVTX_wltpsWph0rb5StJjyuQojDMppi5C_Uqpjxm3Jzuw&lib=MlRQs5rfKg_r8UnphOtcUBKetveII9RHp";

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
