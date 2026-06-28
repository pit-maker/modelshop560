import { state } from "./state.js";

export function applyFilters() {

    state.filteredProducts = state.products.filter(product => {

        // Поиск
        if (state.filters.search) {

            const text = (
                `${product.name} ${product.article}`
            ).toLowerCase();

            if (!text.includes(state.filters.search))
                return false;
        }

        // Производитель
        if (
            state.filters.manufacturer &&
            product.manufacturer !== state.filters.manufacturer
        ) {
            return false;
        }

        // Масштаб
        if (
            state.filters.scale &&
            product.scale !== state.filters.scale
        ) {
            return false;
        }

        // Категория
        if (
            state.filters.category &&
            product.category !== state.filters.category
        ) {
            return false;
        }

        return true;

    });

}
