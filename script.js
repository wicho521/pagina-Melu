// =============================================
// JELLYFISH BACKGROUND ANIMATION
// =============================================
(function () {
    const canvas = document.getElementById('jellyfish-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const COLORS = [
        { r: 255, g: 0,   b: 127 },  // neon pink
        { r: 157, g: 0,   b: 255 },  // neon purple
        { r: 0,   g: 240, b: 255 },  // neon blue
    ];

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Jellyfish {
        constructor(spreadY) {
            this._init(spreadY);
        }

        _init(spreadY) {
            this.size   = 9 + Math.random() * 18;          // small – 9 to 27px bell radius
            this.col    = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.alpha  = 0.06 + Math.random() * 0.10;     // very subtle
            this.speed  = 0.22 + Math.random() * 0.38;     // slow drift upward
            this.startX = Math.random() * canvas.width;
            this.x      = this.startX;
            this.y      = spreadY !== undefined ? spreadY : canvas.height + this.size * 4;

            // Horizontal sine drift
            this.driftAmp   = 12 + Math.random() * 18;
            this.driftFreq  = 0.0025 + Math.random() * 0.003;
            this.driftPhase = Math.random() * Math.PI * 2;

            // Bell pulse
            this.pulse      = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.022 + Math.random() * 0.018;

            this.time = 0;

            // Pre-generate tentacles (avoids per-frame randomness / flicker)
            const count = 5 + Math.floor(Math.random() * 5);
            this.tentacles = Array.from({ length: count }, (_, i) => ({
                xOff   : -this.size * 0.85 + (this.size * 1.7 / Math.max(count - 1, 1)) * i,
                len    : this.size * (0.9 + Math.random() * 0.9),
                amp    : 2.5 + Math.random() * 4,
                phase  : Math.random() * Math.PI * 2,
                width  : 0.5 + Math.random() * 0.8,
            }));
        }

        update() {
            this.time  += 1;
            this.y     -= this.speed;
            this.pulse += this.pulseSpeed;
            this.x      = this.startX + Math.sin(this.time * this.driftFreq + this.driftPhase) * this.driftAmp;

            if (this.y < -this.size * 5) {
                this._init();   // respawn at bottom
            }
        }

        draw() {
            const { r, g, b } = this.col;
            const a  = this.alpha;
            const pf = 1 + Math.sin(this.pulse) * 0.09;    // pulse factor
            const bw = this.size * pf;                      // bell width
            const bh = this.size * 0.55;                    // bell height

            ctx.save();
            ctx.translate(this.x, this.y);

            // -- Outer glow halo --
            ctx.beginPath();
            ctx.ellipse(0, 0, bw * 1.45, bh * 1.45, 0, Math.PI, 0);
            ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.12})`;
            ctx.fill();

            // -- Bell body (radial gradient) --
            ctx.beginPath();
            ctx.ellipse(0, 0, bw, bh, 0, Math.PI, 0);
            const grad = ctx.createRadialGradient(0, -bh * 0.25, 0, 0, 0, bw);
            grad.addColorStop(0,   `rgba(${r},${g},${b},${a * 2.0})`);
            grad.addColorStop(0.55,`rgba(${r},${g},${b},${a * 1.0})`);
            grad.addColorStop(1,   `rgba(${r},${g},${b},${a * 0.1})`);
            ctx.fillStyle = grad;
            ctx.fill();

            // -- Inner dome highlight (white shimmer) --
            ctx.beginPath();
            ctx.ellipse(0, -bh * 0.08, bw * 0.48, bh * 0.30, 0, Math.PI, 0);
            ctx.fillStyle = `rgba(255,255,255,${a * 0.28})`;
            ctx.fill();

            // -- Tentacles --
            this.tentacles.forEach(t => {
                const wave = Math.sin(this.pulse * 1.4 + t.phase) * t.amp;
                ctx.beginPath();
                ctx.moveTo(t.xOff, 0);
                ctx.bezierCurveTo(
                    t.xOff + wave * 0.4, t.len * 0.33,
                    t.xOff + wave * 0.85, t.len * 0.66,
                    t.xOff + wave * 1.15, t.len
                );
                ctx.strokeStyle = `rgba(${r},${g},${b},${a * 0.75})`;
                ctx.lineWidth   = t.width;
                ctx.stroke();
            });

            ctx.restore();
        }
    }

    // Spawn ~28 jellyfish, spread randomly across full page height on load
    const jellies = Array.from({ length: 28 }, () =>
        new Jellyfish(Math.random() * (canvas.height + 200))
    );

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        jellies.forEach(j => { j.update(); j.draw(); });
        requestAnimationFrame(loop);
    }
    loop();
})();

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
