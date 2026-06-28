import { loadProducts } from "./api.js";
import { renderProducts } from "./ui.js";
import { state } from "./state.js";
import { filterBySearch } from "./search.js";

const app = document.getElementById("app");
const searchInput = document.getElementById("searchInput");

async function init() {

    app.innerHTML = "<p>Загрузка...</p>";

    state.products = await loadProducts();

    state.filteredProducts = [...state.products];

    renderProducts(app, state.filteredProducts);

}

searchInput.addEventListener("input", e => {

    filterBySearch(e.target.value);

    renderProducts(app, state.filteredProducts);

});

init();
