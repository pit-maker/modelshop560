const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnRtyGqlX0pUHN_b5bF38DmaLH7Zs4-QnW-Jl8yoplgZP7nQEaWOPnWp2eXaC4MW9I_OFfOSmA7WoIxvbjT-lUXPNyoM6f1f28Jiy1x--7hqKrZdxMFZvjKVPsZnkDHrFEEBIUB5kVCWSPIPxQaqoR0u1WAb0NbR3ZaMl_5m-xfa6oDxk82sOtM1ByZuy_kBkZuLGYixKWGv83cxnupei3RFUrJhUZjsKThva6sEopwsr9UXyLVEP7zFQ1l8iJNVDd-_Pw5Vi-JoUk1laSZPTaRqYjRl5g&lib=MlRQs5rfKg_r8UnphOtcUBKetveII9RHp";

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
