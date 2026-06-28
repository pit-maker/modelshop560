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

    applyFilters();

    renderProducts(app, state.filteredProducts);

}

searchInput.addEventListener("input", e => {

    setSearch(e.target.value);

    applyFilters();

    renderProducts(app, state.filteredProducts);

});

init();
