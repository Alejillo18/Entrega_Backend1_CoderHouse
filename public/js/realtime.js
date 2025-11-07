const socket = io();

const addProductForm = document.getElementById("addProductForm");
const formMessage = document.getElementById("formMessage");

function showCustomConfirm(productId, productTitle) {
    const modalHtml = `
        <div id="confirmModal" class="custom-modal-overlay">
            <div class="custom-modal-content">
                <h3 class="modal-title">Confirmar Eliminación</h3>
                <p class="modal-message">¿Estás seguro de que quieres eliminar permanentemente el producto:</p>
                <p class="modal-product-name"><strong>"${productTitle}"</strong> (ID: ${productId})?</p>
                <p class="modal-warning">Esta acción no se puede deshacer.</p>
                <div class="modal-actions">
                    <button id="cancelDelete" class="btn-cancel">Cancelar</button>
                    <button id="confirmDelete" class="btn-confirm" data-id="${productId}">Eliminar ⛔</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalElement = document.getElementById('confirmModal');
    document.getElementById('cancelDelete').addEventListener('click', () => {
        modalElement.remove();
    });
    document.getElementById('confirmDelete').addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        modalElement.remove();
        console.log("Confirmación recibida. Eliminando producto con ID:", id);
        socket.emit("deleteProduct", id);
    });
}

function displayFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = '';
    formMessage.classList.add(type);
    
    setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = '';
    }, 5000);
}

if (addProductForm) {
    addProductForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const formData = new FormData(addProductForm);
        const newProduct = {};
        
        for (const [key, value] of formData.entries()) {
            if (key === 'price' || key === 'stock') {
                const numValue = parseFloat(value);
                
                if (key === 'stock' && numValue < 0) {
                    displayFormMessage("Error: El stock no puede ser negativo.", 'error');
                    return;
                }
                
                newProduct[key] = numValue;
            } else if (key === 'thumbnails') {
                newProduct[key] = value.trim() ? [value.trim()] : [];
            } else {
                newProduct[key] = value.trim();
            }
        }
        
        newProduct.status = newProduct.stock > 0;
        
        socket.emit("addProduct", newProduct);
        addProductForm.reset();
        displayFormMessage("Producto enviado para ser agregado...", 'info');
    });
}

socket.on("productos", (productos) => {
    const container = document.getElementById("productosRealTime");
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
                    <button class="delete-btn" data-id="${prod.id}" data-title="${prod.title}">⛔</button>
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

        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                const productId = e.currentTarget.getAttribute("data-id");
                const productTitle = e.currentTarget.getAttribute("data-title");
                if (productId && productTitle) {
                    showCustomConfirm(productId, productTitle);
                }
            });
        });
    } else {
        container.innerHTML = "<p>No hay productos para mostrar.</p>";
    }
});

socket.on("addProductFeedback", (response) => {
    if (response.success) {
        displayFormMessage(response.message || "¡Producto agregado con éxito!", 'success');
    } else {
        displayFormMessage(response.message || "Error al agregar el producto.", 'error');
    }
});