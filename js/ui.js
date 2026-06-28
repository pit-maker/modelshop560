export function renderProducts(container, products) {

    container.innerHTML = "";

    if (!products.length) {
        container.innerHTML = "<p>Нет товаров.</p>";
        return;
    }

    products.forEach(product => {

        container.appendChild(
            createProductCard(product)
        );

    });

}

function createProductCard(product) {

    const card = document.createElement("div");
    card.className = "card";

    const stockClass =
        product.stock === "В наличии" ? "in" : "out";

    const stockText =
        product.stock === "В наличии"
            ? "🟢 В наличии"
            : "🔴 Нет в наличии";

    card.innerHTML = `
        <img
            class="product-image"
            src="${product.image}"
            alt="${product.name}"
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

            <div class="stock ${stockClass}">
                ${stockText}
            </div>

            <div class="price">
                ${product.price} ${product.currency}
            </div>

        </div>
    `;

    // const image = card.querySelector("img");

    // image.addEventListener("error", () => {
    //     image.src = "img/no-photo.png";
    // });

    return card;

}
