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
    modalSpecsTitle: "Характеристики"
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
    modalSpecsTitle: "Specifications"
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
    modalSpecsTitle: "Характеристики"
  }
};

const supportedLanguages = Object.keys(translations);
const savedLang = localStorage.getItem("appLanguage");
const defaultLang = savedLang || (() => {
  const lang = navigator.language || navigator.userLanguage || "";
  if (lang.startsWith("en")) return "en";
  if (lang.startsWith("uk") || lang.startsWith("uk-")) return "uk";
  return "ru";
})();

export const i18n = {
  currentLang: supportedLanguages.includes(defaultLang) ? defaultLang : "ru",

  t(key) {
    return translations[this.currentLang][key] ?? translations.ru[key] ?? key;
  },

  setLang(lang) {
    if (!supportedLanguages.includes(lang)) return;
    this.currentLang = lang;
    localStorage.setItem("appLanguage", lang);
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
