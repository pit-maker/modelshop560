import { loadProducts } from "./api.js";
import { renderProducts } from "./ui.js";
import { state } from "./state.js";
import { applyFilters } from "./filters.js";
import { setSearch } from "./search.js";

const app = document.getElementById("app");
const searchInput = document.getElementById("searchInput");

async function init() {

    app.innerHTML = "<p>Загрузка...</p>";

    state.products = await loadProducts();

    refreshCatalog();

}

searchInput.addEventListener("input", e => {

    setSearch(e.target.value);

    refreshCatalog();

});

function refreshCatalog() {
    applyFilters();
    renderProducts(app, state.filteredProducts);
}

init();
