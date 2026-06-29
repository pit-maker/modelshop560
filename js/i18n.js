const translations = {
  ru: {
    pageTitle: "Каталог продукции PIT",
    headerTitle: "Каталог продукции PIT",
    searchPlaceholder: "Поиск по названию или артикулу",
    allCategories: "Все категории",
    allScales: "Все масштабы",
    allManufacturers: "Все производители",
    addToCart: "В корзину",
    favorite: "★ В избранное",
    inStock: "🟢 В наличии",
    outOfStock: "🔴 Нет в наличии",
    article: "Арт.",
    scaleLabel: "Масштаб:",
    noProducts: "Нет товаров.",
    loading: "Загрузка...",
    productImageAlt: "изображение товара",
    languageLabel: "Язык",
    modalSpecsTitle: "Характеристики",
    filterToggle: "Фильтр"
  },
  en: {
    pageTitle: "PIT Product Catalog",
    headerTitle: "PIT Product Catalog",
    searchPlaceholder: "Search by name or article",
    allCategories: "All categories",
    allScales: "All scales",
    allManufacturers: "All manufacturers",
    addToCart: "Add to cart",
    favorite: "★ Add to favorites",
    inStock: "🟢 In stock",
    outOfStock: "🔴 Out of stock",
    article: "Art.",
    scaleLabel: "Scale:",
    noProducts: "No products found.",
    loading: "Loading...",
    productImageAlt: "product image",
    languageLabel: "Language",
    modalSpecsTitle: "Specifications",
    filterToggle: "Filter"
  },
  uk: {
    pageTitle: "Каталог продукції PIT",
    headerTitle: "Каталог продукції PIT",
    searchPlaceholder: "Пошук за назвою або артикулом",
    allCategories: "Усі категорії",
    allScales: "Усі масштаби",
    allManufacturers: "Усі виробники",
    addToCart: "У кошик",
    favorite: "★ В обране",
    inStock: "🟢 В наявності",
    outOfStock: "🔴 Немає в наявності",
    article: "Арт.",
    scaleLabel: "Масштаб:",
    noProducts: "Товарів не знайдено.",
    loading: "Завантаження...",
    productImageAlt: "зображення товару",
    languageLabel: "Мова",
    modalSpecsTitle: "Характеристики",
    filterToggle: "Фільтр"
  }
};

const supportedLanguages = Object.keys(translations);

function normalizeLanguageCode(lang) {
  const value = String(lang || "").toLowerCase();
  if (value.startsWith("uk")) return "uk";
  if (value.startsWith("ru")) return "ru";
  if (value.startsWith("en")) return "en";
  return null;
}

function detectLanguageFromBrowser() {
  const preferredLanguages = [
    ...(navigator.languages || []),
    navigator.language,
    navigator.userLanguage
  ].filter(Boolean);

  for (const lang of preferredLanguages) {
    const normalized = normalizeLanguageCode(lang);
    if (normalized) return normalized;
  }

  return "ru";
}

function getInitialLanguage() {
  const savedLang = localStorage.getItem("appLanguage");
  if (savedLang && supportedLanguages.includes(savedLang)) {
    return savedLang;
  }

  return detectLanguageFromBrowser();
}

export const i18n = {
  currentLang: getInitialLanguage(),

  t(key) {
    return translations[this.currentLang][key] ?? translations.ru[key] ?? key;
  },

  setLang(lang) {
    if (!supportedLanguages.includes(lang)) return;
    this.currentLang = lang;
    localStorage.setItem("appLanguage", lang);
  },

  detectLanguage() {
    const detectedLang = getInitialLanguage();
    if (detectedLang !== this.currentLang) {
      this.currentLang = detectedLang;
      localStorage.setItem("appLanguage", detectedLang);
    }
    return detectedLang;
  }
};

export function translatePage() {
  document.querySelectorAll("[data-i18n-key]").forEach(el => {
    const key = el.dataset.i18nKey;
    const attr = el.dataset.i18nAttr || "text";
    const value = i18n.t(key);

    if (attr === "placeholder") {
      el.placeholder = value;
    } else if (attr === "title") {
      el.title = value;
    } else if (attr === "alt") {
      el.alt = value;
    } else {
      el.textContent = value;
    }
  });

  document.documentElement.lang = i18n.currentLang;
  document.title = i18n.t("pageTitle");

  const languageSelect = document.getElementById("languageSelect");
  if (languageSelect) {
    languageSelect.value = i18n.currentLang;
  }
}
