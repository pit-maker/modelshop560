export function renderProducts(container, products) {

    container.innerHTML = "";

    if (!products || !products.length) {
        container.innerHTML = "<p>Нет товаров.</p>";
        return;
    }

    const fragment = document.createDocumentFragment();

    products.forEach(product => {
        fragment.appendChild(createProductCard(product));
    });

    container.appendChild(fragment);
}


// -----------------------------
// Карточка товара
// -----------------------------
function createProductCard(product) {

    const card = document.createElement("div");
    card.className = "card";

    // -----------------------------
    // Картинка (безопасная логика)
    // -----------------------------
    const img = document.createElement("img");
    img.className = "product-image";

    img.src = product.image || "img/no-photo.png";
    img.alt = safeText(product.name);
    img.loading = "lazy";

    img.onerror = () => {
        img.onerror = null; // защита от бесконечного цикла
        img.src = "img/no-photo.png";
    };

    // -----------------------------
    // Статус наличия
    // -----------------------------
    const isAvailable = product.stock === "В наличии";

    const stockText = isAvailable
        ? "🟢 В наличии"
        : "🔴 Нет в наличии";

    const stockClass = isAvailable ? "in" : "out";

    // -----------------------------
    // HTML содержимого карточки
    // -----------------------------
    const body = document.createElement("div");
    body.className = "card-body";

    body.innerHTML = `
        <h3>${safeText(product.name)}</h3>

        <div class="article">
            Арт. ${safeText(product.article)}
        </div>

        <div class="manufacturer">
            ${safeText(product.manufacturer)}
        </div>

        <div class="scale">
            Масштаб: ${safeText(product.scale)}
        </div>

        <div class="stock ${stockClass}">
            ${stockText}
        </div>

        <div class="price">
            ${safeText(product.price)} ${safeText(product.currency)}
        </div>
    `;

    // -----------------------------
    // Сборка карточки
    // -----------------------------
    card.appendChild(img);
    card.appendChild(body);

    // -----------------------------
    // База для будущего модального окна
    // -----------------------------
    card.addEventListener("click", () => {
        openProductModal(product);
    });

    return card;
}


const modal = document.getElementById("productModal");
const modalClose = document.getElementById("modalClose");

function openProductModal(product) {
  document.getElementById("modalTitle").textContent = product.name;
  document.getElementById("modalPrice").textContent = product.price + " грн";
  document.getElementById("modalDescription").textContent = product.description || "";

  const img = document.getElementById("modalImage");
  img.src = product.image || "no-photo.png";

  const specs = document.getElementById("modalSpecs");
  specs.innerHTML = "";

  if (product.specs) {
    Object.entries(product.specs).forEach(([key, value]) => {
      const li = document.createElement("li");
      li.textContent = `${key}: ${value}`;
      specs.appendChild(li);
    });
  }

  modal.classList.remove("hidden");
}

modalClose.onclick = () => modal.classList.add("hidden");

document.querySelector(".modal-overlay").onclick = () => {
  modal.classList.add("hidden");
};

// -----------------------------
// Защита от HTML из Google Sheets
// -----------------------------
function safeText(value) {
    if (value === null || value === undefined) return "";

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

