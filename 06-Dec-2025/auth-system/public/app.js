// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerUserForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const registerFormContainer = document.getElementById('registerForm');
const loginFormContainer = document.querySelector('.form-container');
const logoutBtn = document.getElementById('logoutBtn');

// Toggle between login and register forms
if (showRegister) {
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
    });
}

if (showLogin) {
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.style.display = 'block';
        registerFormContainer.style.display = 'none';
    });
}

// Check if user is logged in
const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (window.location.pathname.endsWith('products.html') && !token) {
        window.location.href = 'login.html';
    } else if (window.location.pathname.endsWith('login.html') && token) {
        window.location.href = 'products.html';
    }
};

// Handle login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = 'products.html';
            } else {
                alert(data.msg || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
}

// Handle registration
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            
            if (response.ok) {
                alert('Registration successful! Please login.');
                registerForm.reset();
                loginFormContainer.style.display = 'block';
                registerFormContainer.style.display = 'none';
            } else {
                alert(data.msg || 'Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
}

// Handle logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
}

// Product Management
if (window.location.pathname.endsWith('products.html')) {
    const productForm = document.getElementById('productForm');
    const productsContainer = document.getElementById('productsContainer');

    // Load products when page loads
    document.addEventListener('DOMContentLoaded', loadProducts);

    // Add new product
    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const product = {
                name: document.getElementById('productName').value,
                price: parseFloat(document.getElementById('productPrice').value),
                description: document.getElementById('productDescription').value
            };

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(product)
                });

                if (response.ok) {
                    productForm.reset();
                    loadProducts();
                } else {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to add product');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to add product. Please try again.');
            }
        });
    }

    // Load products
    async function loadProducts() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const products = await response.json();
                displayProducts(products);
            } else {
                throw new Error('Failed to load products');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to load products. Please try again.');
        }
    }

    // Display products
    function displayProducts(products) {
        productsContainer.innerHTML = '';
        
        if (products.length === 0) {
            productsContainer.innerHTML = '<p>No products found. Add some products to get started!</p>';
            return;
        }

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-card';
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                ${product.description ? `<p>${product.description}</p>` : ''}
                <button onclick="deleteProduct('${product._id}')">Delete</button>
            `;
            productsContainer.appendChild(productElement);
        });
    }

    // Make deleteProduct available globally
    window.deleteProduct = async (productId) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                loadProducts();
            } else {
                throw new Error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete product. Please try again.');
        }
    };
}

// Check authentication on page load
checkAuth();
