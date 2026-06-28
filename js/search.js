import { state } from "./state.js";

export function filterBySearch(text) {

    const query = text.toLowerCase().trim();

    state.filteredProducts = state.products.filter(product => {

        return (
            product.name.toLowerCase().includes(query) ||
            product.article.toLowerCase().includes(query)
        );

    });

}
