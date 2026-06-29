import { loadProducts } from "./api.js";
import { renderProducts } from "./ui.js";
import { state } from "./state.js";
import { applyFilters } from "./filters.js";
import { setSearch } from "./search.js";
import { fillSelect } from "./filterUI.js";
import { i18n, translatePage } from "./i18n.js";

const app = document.getElementById("app");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const scaleFilter = document.getElementById("scaleFilter");
const manufacturerFilter = document.getElementById("manufacturerFilter");
const languageSelect = document.getElementById("languageSelect");
const filtersToggle = document.getElementById("filtersToggle");
const filtersPanel = document.getElementById("filtersPanel");

async function init() {

    translatePage();
    app.innerHTML = `<p>${i18n.t("loading")}</p>`;

    state.products = await loadProducts();

    fillFilters();
    refreshCatalog();

}

function fillFilters() {
    fillSelect(categoryFilter, state.products, "category", i18n.t("allCategories"));
    fillSelect(scaleFilter, state.products, "scale", i18n.t("allScales"));
    fillSelect(manufacturerFilter, state.products, "manufacturer", i18n.t("allManufacturers"));
}

searchInput.addEventListener("input", e => {

    setSearch(e.target.value);

    refreshCatalog();

});

categoryFilter.addEventListener("change", e => {

    state.filters.category = e.target.value;

    refreshCatalog();

});

scaleFilter.addEventListener("change", e => {

    state.filters.scale = e.target.value;

    refreshCatalog();

});

manufacturerFilter.addEventListener("change", e => {

    state.filters.manufacturer = e.target.value;

    refreshCatalog();

});

languageSelect.addEventListener("change", e => {
    i18n.setLang(e.target.value);
    translatePage();
    fillFilters();
    refreshCatalog();
});

filtersToggle.setAttribute("aria-expanded", "false");

filtersToggle.addEventListener("click", () => {
    const isOpen = filtersPanel.classList.toggle("is-open");
    filtersToggle.setAttribute("aria-expanded", String(isOpen));
});

function refreshCatalog() {
    applyFilters();
    renderProducts(app, state.filteredProducts);
}

init();
