export function fillSelect(select, products, field, placeholder) {

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

        select.appendChild(option);

    });

}
