const container = document.getElementById("productos");
    container.innerHTML = "";
    if (productos.length > 0) {
        productos.forEach((prod) => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("card-product");
            const imageUrl =
                prod.thumbnails && prod.thumbnails.length > 0
                    ? prod.thumbnails[0]
                    : "placeholder.jpg";
            productDiv.innerHTML = `
                <div class="product-header">
                    <h3 class="product-title">${prod.title}</h3>
                    <p class="product-code">Código: ${prod.code}</p>
                </div>
                <img src="${imageUrl}" alt="Imagen de ${
                prod.title
                }" class="product-thumbnail">
                <div class="product-details">
                    <p class="product-description">${prod.description}</p>
                    <p class="product-category">Categoría: <strong>${prod.category.toUpperCase()}</strong></p>
                </div>
                <div class="product-footer">
                    <p class="product-stock">Stock: <span>${prod.stock}</span></p>
                    <p class="product-price">$${prod.price.toLocaleString("es-AR")}</p>
                </div>
            `;
            container.appendChild(productDiv);
        });
    }