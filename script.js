// --- COMPLETE MENU DATA ---
const menuData = {
    frutas: [
        { name: 'Fresas con Crema', hasSizes: true },
        { name: 'Uvas con Crema', hasSizes: true },
        { name: 'Duraznos con Crema', hasSizes: true }
    ],
    especiales: [
        { name: 'Cheesecake Oreo', price: 50, hasSizes: false },
        { name: 'Carlota de Limón', price: 30, hasSizes: false },
        { name: 'Flan', price: 40, hasSizes: false }
    ],
    snacks: [
        { name: 'Alitas', price: 70, hasSizes: false, hasFlavors: true },
        { name: 'Alitas con Papas', price: 90, hasSizes: false, hasFlavors: true },
        { name: 'Salchipulpos', price: 40, hasSizes: false },
        { name: 'Plátanos Macho', price: 35, hasSizes: false },
        { name: 'Salchipapas', price: 50, hasSizes: false },
        { name: 'Papas Fritas', price: 35, hasSizes: false },
        { name: 'Banderilla', price: 25, hasSizes: false },
        { name: 'Banderilla Mixta', price: 30, hasSizes: false },
        { name: 'Banderilla de Queso', price: 35, hasSizes: false }
    ]
};

const WA_NUMBER = "525642831842";

// --- Carousel Logic ---
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const dots = Array.from(document.querySelectorAll('.bullet'));
let currentSlideIndex = 0;

function updateSlide(targetIndex) {
    if (!slides[targetIndex]) return;
    slides.forEach(s => s.classList.remove('current-slide'));
    dots.forEach(d => d.classList.remove('active'));
    slides[targetIndex].classList.add('current-slide');
    dots[targetIndex].classList.add('active');
    currentSlideIndex = targetIndex;
}

function autoPlay() { updateSlide((currentSlideIndex + 1) % slides.length); }
let carouselTimer = setInterval(autoPlay, 4000);

// --- Scroll Progress ---
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("scroll-progress").style.width = scrolled + "%";
});

// --- Modal & Builder ---
const modal = document.getElementById('order-modal');
const catSelect = document.getElementById('cat-select');
const prodSelect = document.getElementById('prod-select');
const sizeGroup = document.getElementById('size-group');
const flavorGroup = document.getElementById('flavor-group');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalAmount = document.getElementById('cart-total-amount');

let cart = [];

function openOrderModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    cart = [];
    updateCartUI();
    resetModalInputs();
}

function resetModalInputs() {
    catSelect.value = "";
    prodSelect.innerHTML = '<option value="" disabled selected>Primero categoría</option>';
    prodSelect.disabled = true;
    sizeGroup.style.display = 'none';
    flavorGroup.style.display = 'none';
}

function updateProductOptions() {
    const category = catSelect.value;
    const products = menuData[category];
    prodSelect.disabled = false;
    prodSelect.innerHTML = '<option value="" disabled selected>Elige producto...</option>';
    products.forEach(p => {
        const option = document.createElement('option');
        option.value = p.name;
        option.textContent = `${p.name} ${p.price ? `($${p.price})` : ''}`;
        prodSelect.appendChild(option);
    });
    sizeGroup.style.display = 'none';
    flavorGroup.style.display = 'none';
}

function handleProductSelection() {
    const category = catSelect.value;
    const productName = prodSelect.value;
    const product = menuData[category].find(p => p.name === productName);
    
    // Reset subgroups
    sizeGroup.style.display = 'none';
    flavorGroup.style.display = 'none';

    if (product.hasSizes) {
        sizeGroup.style.display = 'block';
    } else if (product.hasFlavors) {
        flavorGroup.style.display = 'block';
    } else {
        addItemToCartDirect(product.name, product.price);
    }
}

function addWithSize(size, price) {
    const productName = prodSelect.value;
    addItemToCartDirect(`${productName} (${size})`, price);
}

function addWithFlavor(flavor) {
    const category = catSelect.value;
    const productName = prodSelect.value;
    const product = menuData[category].find(p => p.name === productName);
    addItemToCartDirect(`${productName} [${flavor}]`, product.price);
}

function addItemToCartDirect(name, price) {
    cart.push({ name, price });
    updateCartUI();
    showToast(`¡${name} añadido! 🍓`);
}

function showToast(text) {
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('out');
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

function updateCartUI() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-text">El carrito está vacío.</p>';
        cartTotalAmount.textContent = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <span>$${item.price.toFixed(2)}</span>
            </div>
            <button class="remove-btn" onclick="removeItem(${index})">&times;</button>
        `;
        cartItemsContainer.appendChild(itemEl);
        total += item.price;
    });
    cartTotalAmount.textContent = `$${total.toFixed(2)}`;
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm('¿Vaciar todo el carrito?')) {
        cart = [];
        updateCartUI();
    }
}

function sendOrderWhatsApp() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('whatsapp-input').value;
    if (!name || !phone) return alert('Por favor completa tus datos');
    if (cart.length === 0) return alert('Añade productos a tu carrito');
    let total = 0;
    let itemsText = '';
    cart.forEach(item => {
        itemsText += `- ${item.name}: $${item.price.toFixed(2)}%0A`;
        total += item.price;
    });
    const message = `*NUEVO PEDIDO ALUME 👾*%0A%0A*Nombre:* ${name}%0A*WhatsApp:* ${phone}%0A%0A*PRODUCTOS:*%0A${itemsText}%0A*TOTAL: $${total.toFixed(2)}*`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank');
}

const revealElements = document.querySelectorAll('[data-reveal]');
function reveal() {
    revealElements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 50) el.classList.add('revealed');
    });
}
window.addEventListener('scroll', reveal);
reveal();
