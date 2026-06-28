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
        <img
            class="product-image"
            src="${product.image || "img/no-photo.png"}"
            alt="${product.name}"
            loading="lazy"
            onerror="this.src='img/no-photo.png'"
        >
    
        <div class="card-body">

            <h3>${product.name}</h3>

            <div class="article">
                Арт. ${product.article}
            </div>
    
            <div class="manufacturer">
                ${product.manufacturer}
            </div>
    
            <div class="scale">
                Масштаб: ${product.scale}
            </div>

            <div class="price">
                ${product.price} ${product.currency}
            </div>
    
        </div>
    `;

        container.appendChild(card);

    });

}
