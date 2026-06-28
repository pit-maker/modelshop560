export function fillSelect(select, products, field, placeholder, selectedValue = "") {

    const values = [...new Set(
        products
            .map(p => p[field])
            .filter(Boolean)
    )].sort();

    select.innerHTML =
        `<option value="">${placeholder}</option>`;

    values.forEach(value => {

        const option =
            document.createElement("option");

        option.value = value;
        option.textContent = value;
        if (value === selectedValue) {
            option.selected = true;
        }

        select.appendChild(option);

    });

    if (!selectedValue) {
        select.value = "";
    }

}
