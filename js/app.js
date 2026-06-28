import { loadProducts } from "./api.js";
import { renderProducts } from "./ui.js";
import { state } from "./state.js";

const app = document.getElementById("app");

async function init() {

    app.innerHTML = "<p>Загрузка...</p>";

    state.products = await loadProducts();

    state.filteredProducts = [...state.products];

    renderProducts(app, state.filteredProducts);

}

init();
