import { loadProducts } from "./api.js";

const app = document.getElementById("app");

function renderProducts(products) {
  app.innerHTML = "";

  if (!products.length) {
    app.innerHTML = "<p>Нет данных</p>";
    return;
  }

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${p.name || ""}</h3>
      <p><b>Артикул:</b> ${p.article || ""}</p>
      <p><b>Производитель:</b> ${p.manufacturer || ""}</p>
      <p><b>Масштаб:</b> ${p.scale || ""}</p>
      <p><b>Цена:</b> ${p.price || ""} ${p.currency || ""}</p>
    `;

    app.appendChild(card);
  });
}

async function init() {
  app.innerHTML = "<p>Загрузка товаров...</p>";

  const products = await loadProducts();

  renderProducts(products);
}

init();
