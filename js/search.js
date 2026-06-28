import { state } from "./state.js";

export function setSearch(text) {

    state.filters.search = text
        .trim()
        .toLowerCase();

}
