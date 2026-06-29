import { i18n } from "./i18n.js";

export function renderProducts(container, products) {

    container.innerHTML = "";

    if (!products || !products.length) {
        container.innerHTML = `<p>${i18n.t("noProducts")}</p>`;
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
        ? i18n.t("inStock")
        : i18n.t("outOfStock");

    const stockClass = isAvailable ? "in" : "out";

    // -----------------------------
    // HTML содержимого карточки
    // -----------------------------
    const body = document.createElement("div");
    body.className = "card-body";

    body.innerHTML = `
        <h3>${safeText(product.name)}</h3>

        <div class="article">
            ${i18n.t("article")} ${safeText(product.article)}
        </div>

        <div class="manufacturer">
            ${safeText(product.manufacturer)}
        </div>

        <div class="scale">
            ${i18n.t("scaleLabel")} ${safeText(product.scale)}
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
let isModalOpen = false;

function closeProductModal() {
  modal.classList.add("hidden");
  isModalOpen = false;
  window.history.replaceState({}, "", window.location.href);
}

function openProductModal(product) {
  document.getElementById("modalTitle").textContent = product.name;
  document.getElementById("modalPrice").textContent = product.price + " грн";
  document.getElementById("modalDescription").textContent = product.description || "";

  const img = document.getElementById("modalImage");
  const thumbnails = document.getElementById("modalThumbnails");

  const galleryImages = Array.isArray(product.images) && product.images.length
    ? product.images
    : [product.image].filter(Boolean);

  const mainImage = galleryImages.length ? galleryImages[0] : "img/no-photo.png";
  img.src = mainImage;
  img.alt = safeText(product.name);

  thumbnails.innerHTML = "";

  galleryImages.forEach((src, index) => {
    const thumb = document.createElement("img");
    thumb.className = "modal-thumb";
    thumb.src = src || "img/no-photo.png";
    thumb.alt = `${safeText(product.name)} ${index + 1}`;
    thumb.loading = "lazy";

    if (index === 0) {
      thumb.classList.add("active");
    }

    thumb.addEventListener("click", () => {
      img.src = src || "img/no-photo.png";
      thumbnails.querySelectorAll(".modal-thumb").forEach(node => node.classList.remove("active"));
      thumb.classList.add("active");
    });

    thumbnails.appendChild(thumb);
  });

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
  isModalOpen = true;
  window.history.pushState({ modalOpen: true }, "", window.location.href);
}

modalClose.onclick = () => closeProductModal();

document.querySelector(".modal-overlay").onclick = () => {
  closeProductModal();
};

window.addEventListener("popstate", () => {
  if (isModalOpen) {
    closeProductModal();
  }
});

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

