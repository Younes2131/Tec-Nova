document.addEventListener('DOMContentLoaded', function() {
    // Error handling
    window.onerror = function(message, source, lineno, colno, error) {
        console.error('An error occurred:', message, 'at', source, 'line', lineno);
        document.getElementById('loader').innerHTML = 'An error occurred. Please try reloading the page.';
    };

    // Loader
    const loader = document.getElementById('loader');
    const lottieLoader = lottie.loadAnimation({
        container: document.getElementById('lottie-loader'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'path/to/your/lottie/file.json' // Replace with your Lottie file path
    });

    // Remove loader after everything is initialized
    function removeLoader() {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }

    // Particle system for hero and category sections
    class ParticleSystem {
        constructor(container, count = 1000) {
            if (!container) return;
            this.container = container;
            this.count = count;
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            this.renderer = new THREE.WebGLRenderer({ alpha: true });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(this.renderer.domElement);

            this.particles = new THREE.BufferGeometry();
            this.positions = new Float32Array(this.count * 3);
            this.colors = new Float32Array(this.count * 3);

            for (let i = 0; i < this.count * 3; i++) {
                this.positions[i] = (Math.random() - 0.5) * 10;
                this.colors[i] = Math.random();
            }

            this.particles.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
            this.particles.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

            const material = new THREE.PointsMaterial({ size: 0.05, vertexColors: true });
            this.particleSystem = new THREE.Points(this.particles, material);
            this.scene.add(this.particleSystem);

            this.camera.position.z = 5;

            this.animate = this.animate.bind(this);
            this.animate();
        }

        animate() {
            requestAnimationFrame(this.animate);
            this.particleSystem.rotation.x += 0.001;
            this.particleSystem.rotation.y += 0.002;
            this.renderer.render(this.scene, this.camera);
        }
    }

    // Initialize particle systems
    const heroContainer = document.getElementById('hero-particle-network');
    const categoryContainer = document.getElementById('category-galaxy');
    if (heroContainer) new ParticleSystem(heroContainer);
    if (categoryContainer) new ParticleSystem(categoryContainer, 500);

    // Product Carousel
    class ProductCarousel {
        constructor(element) {
            this.element = element;
            this.currentIndex = 0;
            this.products = [
                { name: "Product 1", image: "path/to/image1.jpg", price: "$99.99" },
                { name: "Product 2", image: "path/to/image2.jpg", price: "$149.99" },
                { name: "Product 3", image: "path/to/image3.jpg", price: "$199.99" },
                // Add more products as needed
            ];
            this.render();
            this.attachEventListeners();
        }

        render() {
            this.element.innerHTML = `
                <div class="carousel-item">
                    <img src="${this.products[this.currentIndex].image}" alt="${this.products[this.currentIndex].name}">
                    <h3>${this.products[this.currentIndex].name}</h3>
                    <p>${this.products[this.currentIndex].price}</p>
                </div>
            `;
        }

        attachEventListeners() {
            document.getElementById('prev-product').addEventListener('click', () => this.prevProduct());
            document.getElementById('next-product').addEventListener('click', () => this.nextProduct());
        }

        prevProduct() {
            this.currentIndex = (this.currentIndex - 1 + this.products.length) % this.products.length;
            this.render();
        }

        nextProduct() {
            this.currentIndex = (this.currentIndex + 1) % this.products.length;
            this.render();
        }
    }

    // Initialize Product Carousel
    const carouselElement = document.getElementById('product-carousel');
    if (carouselElement) new ProductCarousel(carouselElement);

    // Product Grid
    class ProductGrid {
        constructor(element) {
            this.element = element;
            this.products = [
                { name: "Product 1", image: "path/to/image1.jpg", price: "$99.99", category: "Electronics" },
                { name: "Product 2", image: "path/to/image2.jpg", price: "$149.99", category: "Fashion" },
                { name: "Product 3", image: "path/to/image3.jpg", price: "$199.99", category: "Home" },
                // Add more products as needed
            ];
            this.render();
            this.attachEventListeners();
        }

        render() {
            this.element.innerHTML = this.products.map(product => `
                <div class="product-card glassmorph">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.price}</p>
                    <button class="add-to-cart" data-product="${product.name}">Add to Cart</button>
                </div>
            `).join('');
        }

        attachEventListeners() {
            this.element.addEventListener('click', (e) => {
                if (e.target.classList.contains('add-to-cart')) {
                    const productName = e.target.dataset.product;
                    this.addToCart(productName);
                }
            });

            document.getElementById('search-products').addEventListener('input', (e) => this.filterProducts(e.target.value));
            document.getElementById('sort-products').addEventListener('change', (e) => this.sortProducts(e.target.value));
        }

        addToCart(productName) {
            // Implement add to cart functionality
            console.log(`Added ${productName} to cart`);
        }

        filterProducts(searchTerm) {
            // Implement product filtering
            console.log(`Filtering products by: ${searchTerm}`);
        }

        sortProducts(sortMethod) {
            // Implement product sorting
            console.log(`Sorting products by: ${sortMethod}`);
        }
    }

    // Initialize Product Grid
    const productGridElement = document.getElementById('product-grid');
    if (productGridElement) new ProductGrid(productGridElement);

    // Cart functionality
    class Cart {
        constructor() {
            this.items = [];
            this.total = 0;
            this.attachEventListeners();
        }

        attachEventListeners() {
            document.getElementById('cart-toggle').addEventListener('click', () => this.toggleCart());
            document.getElementById('checkout-button').addEventListener('click', () => this.checkout());
        }

        toggleCart() {
            const cartModal = document.getElementById('cart-modal');
            cartModal.style.display = cartModal.style.display === 'none' ? 'block' : 'none';
        }

        addItem(product) {
            this.items.push(product);
            this.updateCart();
        }

        removeItem(index) {
            this.items.splice(index, 1);
            this.updateCart();
        }

        updateCart() {
            const cartItems = document.getElementById('cart-items');
            cartItems.innerHTML = this.items.map((item, index) => `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span>${item.price}</span>
                    <button onclick="cart.removeItem(${index})">Remove</button>
                </div>
            `).join('');

            this.total = this.items.reduce((sum, item) => sum + parseFloat(item.price.slice(1)), 0);
            document.getElementById('cart-total-amount').textContent = `$${this.total.toFixed(2)}`;
            document.getElementById('cart-count').textContent = this.items.length;
        }

        checkout() {
            // Implement checkout functionality
            console.log('Proceeding to checkout');
        }
    }

    // Initialize Cart
    window.cart = new Cart();

    // Custom cursor
    const cursor = document.querySelector(".custom-cursor");
    document.addEventListener("mousemove", (e) => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Newsletter form submission
    document.getElementById('newsletter-form').addEventListener('submit', function(e) {
        e.preventDefault();
        // Implement newsletter subscription logic
        console.log('Newsletter form submitted');
    });

    // Remove loader after everything is initialized
    removeLoader();
});