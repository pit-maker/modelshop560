const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnShQV8cCod9jqLGOwiyj8WjAnukbRGg4km6XsLMZkj6GkCKsP-24yidgLzYIzvTEmGY3uDaAiibGfWFKFHVI51-reoWoPZbU4uw47a3lVizcHQjlZa6KOBmcOFPqdHoCcP56du2d6pjOXt-S8VieKZicR2_5VdFGTzxQtBUAOjt14VdBnK3chD11AuqxT7RCh_MY247Rc6ruMxciZDOOXewV3CRyEK_mMWsnudJk7KLbhkApsiz3dmiucLQcdAHI0Ve60YZq98SyhPdEiG8Q3b3YDz0LQ&lib=MlRQs5rfKg_r8UnphOtcUBKetveII9RHp";

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
