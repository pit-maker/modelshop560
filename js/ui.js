export function renderProducts(container, products) {

    container.innerHTML = "";

    if (!products.length) {
        container.innerHTML = "<p>Нет товаров.</p>";
        return;
    }

    products.forEach(product => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${product.name}</h3>

            <p><strong>Артикул:</strong> ${product.article}</p>

            <p>${product.manufacturer}</p>

            <p>${product.scale}</p>

            <p class="price">
                ${product.price} ${product.currency}
            </p>
        `;

        container.appendChild(card);

    });

}
