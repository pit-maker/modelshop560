import { loadProducts } from "./api.js";
import { renderProducts } from "./ui.js";
import { state } from "./state.js";
import { applyFilters } from "./filters.js";
import { setSearch } from "./search.js";
import { fillSelect } from "./filterUI.js";

const app = document.getElementById("app");
const searchInput = document.getElementById("searchInput");
const categoryFilter =
    document.getElementById("categoryFilter");
const scaleFilter =
    document.getElementById("scaleFilter");
const manufacturerFilter =
    document.getElementById("manufacturerFilter");

async function init() {

    app.innerHTML = "<p>Загрузка...1</p>";

    state.products = await loadProducts();

    fillSelect(categoryFilter, state.products, "category", "Все категории");
    fillSelect(scaleFilter, state.products, "scale", "Все масштабы");
    fillSelect(manufacturerFilter, state.products, "manufacturer", "Все производители");

    refreshCatalog();

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

function refreshCatalog() {
    applyFilters();
    renderProducts(app, state.filteredProducts);
}

init();
