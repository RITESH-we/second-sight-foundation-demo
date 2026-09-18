/**
 * Second Sight Foundation - Reactive Storefront Engine
 * Features:
 * - Live dynamic currency exchange across the entire catalog & cart
 * - Client-side reactive Cart with persistent local storage
 * - Free shipping progress calculation & Promo Code engine (SPIRIT50)
 * - Category filter tabs & instant live search
 * - Product Quick View modal with rich ingredient/benefit displays
 * - Interactive Checkout simulation modal
 * - Testimonial auto-carousel
 * - FAQ interactive accordion
 * - Non-intrusive Toast notification system
 */

(function () {
  'use strict';

  // State
  let currentCurrency = localStorage.getItem('ssf_currency') || 'INR';
  let cart = JSON.parse(localStorage.getItem('ssf_cart')) || [];
  let appliedDiscountPercent = 0;
  let activeCategory = 'all';
  let searchQuery = '';
  let activeSort = 'featured';

  // DOM Elements Cache
  const currencyBtn = document.getElementById('currencyBtn');
  const currencyDropdown = document.getElementById('currencyDropdown');
  const currencyFlagImg = document.getElementById('currencyFlagImg');
  const currencyLabel = document.getElementById('currencyLabel');
  const productsGrid = document.getElementById('productsGrid');
  const categoryTabsContainer = document.getElementById('categoryTabs');
  const searchInput = document.getElementById('productSearchInput');
  const sortSelect = document.getElementById('productSortSelect');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartBadge = document.getElementById('cartBadge');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartDiscountRow = document.getElementById('cartDiscountRow');
  const cartDiscountAmountEl = document.getElementById('cartDiscountAmount');
  const cartShippingEl = document.getElementById('cartShipping');
  const cartTotalEl = document.getElementById('cartTotal');
  const freeShippingFill = document.getElementById('freeShippingFill');
  const freeShippingText = document.getElementById('freeShippingText');
  const promoInput = document.getElementById('promoCodeInput');
  const quickViewModal = document.getElementById('quickViewModal');
  const quickViewContent = document.getElementById('quickViewContent');
  const checkoutModal = document.getElementById('checkoutModal');
  const toastContainer = document.getElementById('toastContainer');
  const tickerText = document.getElementById('tickerText');

  // Currency Converter Utility
  function formatPrice(amountInINR) {
    const cur = CURRENCIES[currentCurrency] || CURRENCIES.INR;
    const converted = amountInINR * cur.rate;
    if (currentCurrency === 'INR') {
      return cur.symbol + Math.round(converted).toLocaleString('en-IN');
    } else {
      return cur.symbol + converted.toFixed(2);
    }
  }

  function saveCart() {
    localStorage.setItem('ssf_cart', JSON.stringify(cart));
    updateCartUI();
  }

  // Toast System
  function showToast(message, icon = '✓') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color:var(--primary-gold);font-weight:bold;">${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Currency Handling
  function initCurrency() {
    const cur = CURRENCIES[currentCurrency] || CURRENCIES.INR;
    if (currencyLabel) currencyLabel.textContent = cur.name;
    if (currencyFlagImg) currencyFlagImg.src = cur.flag;

    if (currencyBtn && currencyDropdown) {
      currencyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currencyDropdown.classList.toggle('show');
      });

      document.addEventListener('click', () => {
        currencyDropdown.classList.remove('show');
      });

      currencyDropdown.querySelectorAll('.currency-item').forEach((item) => {
        item.addEventListener('click', () => {
          const code = item.getAttribute('data-currency');
          if (CURRENCIES[code]) {
            currentCurrency = code;
            localStorage.setItem('ssf_currency', code);
            const selectedCur = CURRENCIES[code];
            currencyLabel.textContent = selectedCur.name;
            currencyFlagImg.src = selectedCur.flag;
            renderProducts();
            updateCartUI();
            showToast(`Currency updated to ${selectedCur.name}`);
          }
          currencyDropdown.classList.remove('show');
        });
      });
    }
  }

  // Render Product Catalog
  function renderProducts() {
    if (!productsGrid) return;

    let filtered = PRODUCTS_DATA.filter((p) => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery) ||
        p.tagline.toLowerCase().includes(searchQuery) ||
        p.categoryName.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    if (activeSort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
          <i class="fa-solid fa-seedling" style="font-size: 3rem; color: var(--primary-gold); margin-bottom: 16px;"></i>
          <h3 style="font-family: var(--font-serif); margin-bottom: 8px;">No matching wellness products found</h3>
          <p style="color: var(--text-muted);">Try adjusting your search terms or category filter.</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filtered
      .map((p) => {
        const discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
        const starsHtml = Array(5)
          .fill(0)
          .map((_, i) => `<i class="fa-solid fa-star${i < Math.floor(p.rating) ? '' : '-half-stroke'}"></i>`)
          .join('');

        return `
          <div class="product-card" data-id="${p.id}">
            <span class="product-badge-tag">${p.badge}</span>
            <span class="product-discount-tag">-${discountPercent}%</span>
            <button class="wishlist-btn ${wishlist.includes(p.id) ? 'active' : ''}" onclick="window.SSF.toggleWishlist('${p.id}', event)" title="Save to Favorites">
              <i class="fa-heart ${wishlist.includes(p.id) ? 'fa-solid' : 'fa-regular'}"></i>
            </button>
            <div class="product-img-wrapper" onclick="window.SSF.openQuickView('${p.id}')">
              <img src="${p.image}" alt="${p.name}" onerror="this.onerror=null; this.src='${p.fallbackImage}'">
              <button class="product-quick-view-btn" onclick="event.stopPropagation(); window.SSF.openQuickView('${p.id}')">
                <i class="fa-regular fa-eye"></i> Quick View
              </button>
            </div>
            <div class="product-card-body">
              <span class="product-category-label">${p.categoryName}</span>
              <h3 class="product-name" onclick="window.SSF.openQuickView('${p.id}')">${p.name}</h3>
              <div class="product-rating-row">
                <div class="stars-container">${starsHtml}</div>
                <span class="reviews-count">${p.rating} (${p.reviewsCount} reviews)</span>
              </div>
              <p class="product-tagline-text">${p.tagline}</p>
              <div class="product-price-row">
                <span class="current-price">${formatPrice(p.price)}</span>
                <span class="original-price">${formatPrice(p.originalPrice)}</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <span class="scarcity-pill"><i class="fa-solid fa-bolt"></i> Fast Selling • Only a few left</span>
              </div>
              <div class="card-action-row" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <button class="add-to-cart-btn" onclick="window.SSF.addToCart('${p.id}', 1)">
                  <i class="fa-solid fa-bag-shopping"></i> Bag
                </button>
                <button class="buy-now-btn" onclick="window.SSF.buyNow('${p.id}')">
                  <i class="fa-solid fa-bolt"></i> Buy Now
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join('');
  }

  // Cart Logic
  function addToCart(productId, qty = 1) {
    const product = PRODUCTS_DATA.find((p) => p.id === productId);
    if (!product) return;

    const existing = cart.find((item) => item.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        fallbackImage: product.fallbackImage,
        qty: qty
      });
    }

    saveCart();
    openCart();
    showToast(`Added "${product.name}" to bag!`);

    if (cartBadge) {
      cartBadge.classList.add('bump');
      setTimeout(() => cartBadge.classList.remove('bump'), 300);
    }
  }

  function updateQty(productId, delta) {
    const item = cart.find((it) => it.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter((it) => it.id !== productId);
    }
    saveCart();
  }

  function removeFromCart(productId) {
    cart = cart.filter((it) => it.id !== productId);
    saveCart();
    showToast('Item removed from bag');
  }

  function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartBadge) cartBadge.textContent = totalCount;

    const mobileBadge = document.getElementById('mobileCartBadge');
    if (mobileBadge) mobileBadge.textContent = totalCount;

    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
          <i class="fa-solid fa-basket-shopping" style="font-size: 2.8rem; color: var(--slate-300); margin-bottom: 12px;"></i>
          <p style="font-size: 1.05rem; font-weight: 500; margin-bottom: 8px;">Your shopping bag is empty</p>
          <button class="btn btn-outline btn-sm" onclick="window.SSF.closeCart()" style="margin-top: 10px;">Continue Shopping</button>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(0);
      if (cartTotalEl) cartTotalEl.textContent = formatPrice(0);
      if (freeShippingFill) freeShippingFill.style.width = '0%';
      if (freeShippingText) freeShippingText.textContent = 'Add items to unlock Free Shipping!';
      return;
    }

    cartItemsList.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item-row">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.onerror=null; this.src='${item.fallbackImage}'">
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
            <div class="cart-qty-stepper">
              <button class="qty-btn" onclick="window.SSF.updateQty('${item.id}', -1)">-</button>
              <span class="qty-display">${item.qty}</span>
              <button class="qty-btn" onclick="window.SSF.updateQty('${item.id}', 1)">+</button>
            </div>
          </div>
          <button class="cart-item-remove-btn" onclick="window.SSF.removeFromCart('${item.id}')" title="Remove item">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      `
      )
      .join('');

    // Totals calculation
    const subtotalINR = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
    const discountINR = (subtotalINR * appliedDiscountPercent) / 100;
    const shippingThresholdINR = 999;
    const isFreeShipping = subtotalINR >= shippingThresholdINR;
    const shippingINR = isFreeShipping ? 0 : 99;
    const totalINR = subtotalINR - discountINR + shippingINR;

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(subtotalINR);
    if (cartTotalEl) cartTotalEl.textContent = formatPrice(totalINR);

    if (appliedDiscountPercent > 0 && cartDiscountRow && cartDiscountAmountEl) {
      cartDiscountRow.style.display = 'flex';
      cartDiscountAmountEl.textContent = '-' + formatPrice(discountINR);
    } else if (cartDiscountRow) {
      cartDiscountRow.style.display = 'none';
    }

    if (cartShippingEl) {
      cartShippingEl.textContent = isFreeShipping ? 'FREE' : formatPrice(shippingINR);
    }

    // Free shipping meter
    if (freeShippingFill && freeShippingText) {
      const pct = Math.min(100, Math.round((subtotalINR / shippingThresholdINR) * 100));
      freeShippingFill.style.width = pct + '%';
      if (isFreeShipping) {
        freeShippingText.innerHTML = '<span style="color:#16a34a;font-weight:600;">🎉 Congratulations! You have qualified for FREE Shipping!</span>';
      } else {
        const remaining = shippingThresholdINR - subtotalINR;
        freeShippingText.textContent = `Add ${formatPrice(remaining)} more to enjoy FREE Shipping!`;
      }
    }
  }

  function applyPromoCode() {
    if (!promoInput) return;
    const code = promoInput.value.trim().toUpperCase();
    if (code === 'SPIRIT50') {
      appliedDiscountPercent = 50;
      updateCartUI();
      showToast('Coupon applied! 50% discount has been activated.', '🎉');
    } else {
      showToast('Invalid promo code. Try "SPIRIT50"', '⚠️');
    }
  }

  function openCart() {
    if (cartDrawer && cartDrawerOverlay) {
      cartDrawer.classList.add('active');
      cartDrawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
    if (cartDrawer && cartDrawerOverlay) {
      cartDrawer.classList.remove('active');
      cartDrawerOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Quick View Modal
  function openQuickView(productId) {
    const p = PRODUCTS_DATA.find((item) => item.id === productId);
    if (!p || !quickViewModal || !quickViewContent) return;

    const discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
    const benefitsList = p.benefits.map((b) => `<li><i class="fa-solid fa-check text-warning me-2"></i> ${b}</li>`).join('');

    quickViewContent.innerHTML = `
      <div class="quickview-grid">
        <div class="quickview-img-box">
          <img src="${p.image}" alt="${p.name}" onerror="this.onerror=null; this.src='${p.fallbackImage}'">
        </div>
        <div class="quickview-info">
          <span class="product-category-label">${p.categoryName} • ${p.badge}</span>
          <h3>${p.name}</h3>
          <div class="product-rating-row">
            <span class="stars-container"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></span>
            <span class="reviews-count">${p.rating} (${p.reviewsCount} customer reviews)</span>
          </div>
          <div class="product-price-row">
            <span class="current-price" style="font-size:1.6rem;">${formatPrice(p.price)}</span>
            <span class="original-price">${formatPrice(p.originalPrice)}</span>
            <span style="background:#e11d48;color:#fff;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:bold;">Save ${discountPercent}%</span>
          </div>
          <p style="color:var(--slate-700);margin-bottom:18px;line-height:1.6;">${p.description}</p>
          <div style="margin-bottom:18px;">
            <h4 style="font-size:0.95rem;margin-bottom:8px;color:var(--slate-900);">Key Benefits:</h4>
            <ul style="list-style:none;display:flex;flex-direction:column;gap:6px;font-size:0.9rem;color:var(--slate-700);">${benefitsList}</ul>
          </div>
          <div style="margin-bottom:18px;background:var(--bg-cream);padding:12px;border-radius:8px;">
            <p style="font-size:0.85rem;color:var(--slate-600);margin-bottom:4px;"><strong>Ingredients:</strong> ${p.ingredients}</p>
            <p style="font-size:0.85rem;color:var(--slate-600);"><strong>Directions:</strong> ${p.usage}</p>
          </div>
          <div style="display:flex;gap:12px;align-items:center;">
            <button class="btn btn-primary btn-block" onclick="window.SSF.addToCart('${p.id}', 1); window.SSF.closeModal('quickViewModal');">
              <i class="fa-solid fa-bag-shopping"></i> Add To Bag • ${formatPrice(p.price)}
            </button>
          </div>
        </div>
      </div>
    `;

    quickViewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Checkout Modal
  function openCheckout() {
    if (cart.length === 0) {
      showToast('Your bag is empty! Add items first.', '⚠️');
      return;
    }
    closeCart();
    if (checkoutModal) {
      checkoutModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  // Store orders locally and dispatch to WhatsApp
  let ordersList = JSON.parse(localStorage.getItem('ssf_orders_log')) || [];
  let leadsList = JSON.parse(localStorage.getItem('ssf_leads_log')) || [];

  function handleCheckoutSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('input[placeholder*="Jatin"]') ? form.querySelector('input[placeholder*="Jatin"]').value.trim() : 'Customer';
    const phone = form.querySelector('input[type="tel"]').value.trim();
    const address = form.querySelector('input[placeholder*="House"]').value.trim();
    const city = form.querySelector('input[placeholder*="New Delhi"]').value.trim();
    const pincode = form.querySelector('input[placeholder*="110027"]').value.trim();
    const paymentMethod = form.querySelector('select').value.toUpperCase();

    if (cart.length === 0) {
      showToast('Your bag is empty!', '⚠️');
      return;
    }

    const orderId = 'SSF-' + Math.floor(100000 + Math.random() * 900000);
    const subtotalINR = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
    const discountINR = (subtotalINR * appliedDiscountPercent) / 100;
    const isFreeShipping = subtotalINR >= 999;
    const totalINR = subtotalINR - discountINR + (isFreeShipping ? 0 : 99);

    const itemsSummary = cart.map(it => `• ${it.name} (Qty: ${it.qty}) - ₹${it.price * it.qty}`).join('\n');

    // Save order record
    const newOrder = {
      orderId,
      date: new Date().toLocaleString('en-IN'),
      name,
      phone,
      address: `${address}, ${city} - ${pincode}`,
      items: cart.map(it => ({ id: it.id, name: it.name, qty: it.qty, price: it.price })),
      total: totalINR,
      paymentMethod
    };

    ordersList.unshift(newOrder);
    localStorage.setItem('ssf_orders_log', JSON.stringify(ordersList));

    // Construct WhatsApp message
    const waText = `🌿 *NEW ORDER - SECOND SIGHT FOUNDATION*\n` +
      `----------------------------------------\n` +
      `🆔 *Order ID:* ${orderId}\n` +
      `👤 *Customer:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      `📍 *Address:* ${address}, ${city} - ${pincode}\n` +
      `💳 *Payment:* ${paymentMethod}\n\n` +
      `📦 *Items Ordered:*\n${itemsSummary}\n\n` +
      `💰 *Total Amount:* ₹${totalINR.toLocaleString('en-IN')}\n` +
      `----------------------------------------\n` +
      `Please confirm dispatch!`;

    const waUrl = `https://wa.me/919716517463?text=${encodeURIComponent(waText)}`;

    showToast('Processing order & opening WhatsApp...', '⏳');

    setTimeout(() => {
      closeModal('checkoutModal');
      cart = [];
      appliedDiscountPercent = 0;
      saveCart();

      // Open confirmation modal or WhatsApp
      window.open(waUrl, '_blank');
      showToast(`🎉 Order ${orderId} placed! Stored in Customer Log.`, '✓');
    }, 800);
  }

  // Contact Form Lead Logger
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fname = document.getElementById('firstName').value.trim();
      const lname = document.getElementById('lastName').value.trim();
      const email = document.getElementById('emailAddr').value.trim();
      const phone = document.getElementById('phoneNum').value.trim();
      const subject = document.getElementById('subjectSelect').value;
      const message = document.getElementById('messageText').value.trim();

      const lead = {
        date: new Date().toLocaleString('en-IN'),
        name: `${fname} ${lname}`,
        email,
        phone,
        subject,
        message
      };

      leadsList.unshift(lead);
      localStorage.setItem('ssf_leads_log', JSON.stringify(leadsList));

      const waText = `🌿 *NEW WEBSITE INQUIRY*\n` +
        `👤 *Name:* ${fname} ${lname}\n` +
        `📞 *Phone:* ${phone}\n` +
        `📧 *Email:* ${email}\n` +
        `❓ *Subject:* ${subject}\n` +
        `💬 *Message:* ${message}`;

      const waUrl = `https://wa.me/919716517463?text=${encodeURIComponent(waText)}`;

      showToast('Thank you! Inquiry saved. Opening WhatsApp...', '✓');
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 700);

      form.reset();
    });
  }

  // Admin Export to CSV / View Orders
  function openAdminLogs() {
    const modal = document.getElementById('adminLogsModal');
    const tableBody = document.getElementById('ordersTableBody');
    if (!modal || !tableBody) return;

    if (ordersList.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--theme-text-muted);">No orders placed yet. Place an order to see live data!</td></tr>`;
    } else {
      tableBody.innerHTML = ordersList.map(o => `
        <tr style="border-bottom:1px solid var(--theme-border);">
          <td style="padding:10px 14px;font-weight:600;color:var(--primary-gold);">${o.orderId}</td>
          <td style="padding:10px 14px;">${o.name}<br><small style="color:var(--theme-text-muted);">${o.phone}</small></td>
          <td style="padding:10px 14px;font-size:0.85rem;">${o.items.map(it => it.name + ' (x' + it.qty + ')').join(', ')}</td>
          <td style="padding:10px 14px;font-weight:700;">₹${o.total}</td>
          <td style="padding:10px 14px;font-size:0.8rem;color:var(--theme-text-muted);">${o.date}</td>
        </tr>
      `).join('');
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function exportOrdersToCSV() {
    if (ordersList.length === 0) {
      showToast('No orders to export yet!', '⚠️');
      return;
    }
    let csv = 'Order ID,Date,Customer Name,Phone,Address,Items,Total INR,Payment Method\n';
    ordersList.forEach(o => {
      const itemsStr = o.items.map(it => `${it.name} (x${it.qty})`).join('; ');
      csv += `"${o.orderId}","${o.date}","${o.name}","${o.phone}","${o.address}","${itemsStr}","${o.total}","${o.paymentMethod}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SSF_Customer_Orders_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    showToast('Exported customer orders to CSV!', '📥');
  }

  // Rotating Ticker
  function initTicker() {
    const phrases = [
      "Restoring Sight, Renewing Lives",
      "Second Sight, First Step to Hope",
      "Changing Lives, One Vision at a Time",
      "Authentic Ayurveda & Spiritual Harmony",
      "Complimentary Express Shipping on Orders ₹999+"
    ];
    let idx = 0;
    if (!tickerText) return;

    setInterval(() => {
      tickerText.style.opacity = '0';
      tickerText.style.transform = 'translateY(-6px)';
      setTimeout(() => {
        idx = (idx + 1) % phrases.length;
        tickerText.textContent = phrases[idx];
        tickerText.style.opacity = '1';
        tickerText.style.transform = 'translateY(0)';
      }, 400);
    }, 3800);
  }

  // Hero Slider
  function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;

    let current = 0;
    function showSlide(idx) {
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    }

    const nextBtn = document.getElementById('heroNext');
    const prevBtn = document.getElementById('heroPrev');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        current = (current + 1) % slides.length;
        showSlide(current);
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        current = (current - 1 + slides.length) % slides.length;
        showSlide(current);
      });
    }

    setInterval(() => {
      current = (current + 1) % slides.length;
      showSlide(current);
    }, 6000);
  }

  // Testimonials Carousel
  function initTestimonials() {
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;

    track.innerHTML = TESTIMONIALS_DATA.map(
      (t, i) => `
      <div class="testimonial-slide ${i === 0 ? 'active' : ''}" data-idx="${i}">
        <div class="testimonial-quote-icon"><i class="fa-solid fa-quote-left"></i></div>
        <p class="testimonial-text">"${t.text}"</p>
        <div class="testimonial-author-row">
          <img src="${t.image}" alt="${t.name}" class="author-avatar" onerror="this.onerror=null; this.src='assets/images/ankita.jpg'">
          <div class="author-info">
            <h4>${t.name}</h4>
            <p>${t.city} • <span style="color:#f59e0b;">★★★★★</span></p>
          </div>
        </div>
      </div>
    `
    ).join('');

    let currentT = 0;
    const totalT = TESTIMONIALS_DATA.length;
    function setT(idx) {
      document.querySelectorAll('.testimonial-slide').forEach((s, i) => {
        s.classList.toggle('active', i === idx);
      });
    }

    const tNext = document.getElementById('testiNext');
    const tPrev = document.getElementById('testiPrev');
    if (tNext) tNext.addEventListener('click', () => { currentT = (currentT + 1) % totalT; setT(currentT); });
    if (tPrev) tPrev.addEventListener('click', () => { currentT = (currentT - 1 + totalT) % totalT; setT(currentT); });
  }

  // FAQ Accordion
  function initFAQ() {
    const container = document.getElementById('faqContainer');
    if (!container) return;

    container.innerHTML = FAQ_DATA.map(
      (f, idx) => `
      <div class="faq-item ${idx === 0 ? 'open' : ''}">
        <button class="faq-question-btn">
          <span>${f.q}</span>
          <i class="fa-solid fa-chevron-down faq-icon"></i>
        </button>
        <div class="faq-answer">
          <p>${f.a}</p>
        </div>
      </div>
    `
    ).join('');

    container.querySelectorAll('.faq-question-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        container.querySelectorAll('.faq-item').forEach((it) => it.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  // About Tabs
  function initAboutTabs() {
    const tabBtns = document.querySelectorAll('.about-tab-btn');
    const tabPanes = document.querySelectorAll('.about-tab-pane');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        tabBtns.forEach((b) => b.classList.remove('active'));
        tabPanes.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');
        const pane = document.getElementById('tab-' + target);
        if (pane) pane.classList.add('active');
      });
    });
  }

  // Contact Form
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Your message has been received. Our team will contact you shortly.', '✓');
      form.reset();
    });
  }

  // Mobile Navigation
  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('mainNavLinks');
    if (toggleBtn && navLinks) {
      toggleBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
      navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => navLinks.classList.remove('active'));
      });
    }
  }

  // Category & Filter Listeners
  function initFilters() {
    if (categoryTabsContainer) {
      categoryTabsContainer.querySelectorAll('.cat-tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          categoryTabsContainer.querySelectorAll('.cat-tab-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          activeCategory = btn.getAttribute('data-category');
          renderProducts();
        });
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderProducts();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        activeSort = e.target.value;
        renderProducts();
      });
    }
  }

  // Back to top button
  function initBackToTop() {
    const btt = document.getElementById('backToTop');
    if (!btt) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btt.classList.add('visible');
      } else {
        btt.classList.remove('visible');
      }
    });
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function selectCategory(category) {
    activeCategory = category;
    if (categoryTabsContainer) {
      categoryTabsContainer.querySelectorAll('.cat-tab-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-category') === category);
      });
    }
    renderProducts();
    const productsSection = document.getElementById('products');
    if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth' });
  }


  // =========================================================================
  // THEME SWITCHER (DARK & LIGHT MODE WITH AUTO-DETECTION & PERSISTENCE)
  // =========================================================================
  let currentTheme = localStorage.getItem('ssf_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ssf_theme', theme);

    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      if (theme === 'dark') {
        themeBtn.innerHTML = '<i class="fa-solid fa-sun" style="color:#f59e0b;"></i>';
        themeBtn.setAttribute('title', 'Switch to Light Mode');
      } else {
        themeBtn.innerHTML = '<i class="fa-solid fa-moon" style="color:#0f172a;"></i>';
        themeBtn.setAttribute('title', 'Switch to Dark Mode');
      }
    }
  }

  function toggleTheme() {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    showToast(`Switched to ${nextTheme.toUpperCase()} mode!`, nextTheme === 'dark' ? '🌙' : '☀️');
  }

  // =========================================================================
  // WISHLIST SYSTEM
  // =========================================================================
  let wishlist = JSON.parse(localStorage.getItem('ssf_wishlist')) || [];

  function toggleWishlist(productId, e) {
    if (e) e.stopPropagation();
    const idx = wishlist.indexOf(productId);
    const p = PRODUCTS_DATA.find(it => it.id === productId);
    const name = p ? p.name : 'Item';

    if (idx > -1) {
      wishlist.splice(idx, 1);
      showToast(`Removed "${name}" from your Favorites`, '🤍');
    } else {
      wishlist.push(productId);
      showToast(`Saved "${name}" to your Favorites!`, '❤️');
    }
    localStorage.setItem('ssf_wishlist', JSON.stringify(wishlist));
    renderProducts();
  }

  // =========================================================================
  // FLASH SALE COUNTDOWN TIMER
  // =========================================================================
  function initSaleCountdown() {
    const hoursEl = document.getElementById('cdHours');
    const minsEl = document.getElementById('cdMins');
    const secsEl = document.getElementById('cdSecs');
    if (!hoursEl || !minsEl || !secsEl) return;

    let totalSeconds = 5 * 3600 + 48 * 60 + 35; // 5 hours 48 mins

    setInterval(() => {
      if (totalSeconds > 0) totalSeconds--;
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      hoursEl.textContent = String(h).padStart(2, '0');
      minsEl.textContent = String(m).padStart(2, '0');
      secsEl.textContent = String(s).padStart(2, '0');
    }, 1000);
  }

  // =========================================================================
  // LIVE RECENT SALES POPUP (SOCIAL PROOF)
  // =========================================================================
  const RECENT_SALES = [
    { buyer: "Rohan V. from Pune", item: "Digest Harmony Tea", img: "assets/products/digest-harmony.webp", time: "2 minutes ago" },
    { buyer: "Dr. Sunita M. from Delhi", item: "Brain Booster Tea", img: "assets/products/brain-booster.webp", time: "5 minutes ago" },
    { buyer: "Ananya K. from Bangalore", item: "Aura Spray (Set of 2)", img: "assets/products/aura-spray.webp", time: "9 minutes ago" },
    { buyer: "Vikram S. from Mumbai", item: "Alkaline Glass Water Bottle", img: "assets/products/alkaline-bottle.webp", time: "14 minutes ago" },
    { buyer: "Kavita D. from Jaipur", item: "SSF Facial Kit", img: "assets/products/facial-kit.webp", time: "18 minutes ago" },
    { buyer: "Suresh P. from Hyderabad", item: "Diabetes Tea Powder", img: "assets/products/diabetes-tea.webp", time: "22 minutes ago" }
  ];

  function initLiveSalesPopup() {
    const popup = document.getElementById('liveSalePopup');
    const buyerEl = document.getElementById('liveSaleBuyer');
    const itemEl = document.getElementById('liveSaleItem');
    const timeEl = document.getElementById('liveSaleTime');
    const imgEl = document.getElementById('liveSaleImg');
    if (!popup || !buyerEl || !itemEl) return;

    let saleIdx = 0;
    function triggerSale() {
      const data = RECENT_SALES[saleIdx];
      buyerEl.textContent = data.buyer;
      itemEl.textContent = data.item;
      timeEl.textContent = data.time + ' • Verified Order';
      imgEl.src = data.img;

      popup.classList.add('show');
      setTimeout(() => {
        popup.classList.remove('show');
      }, 5000);

      saleIdx = (saleIdx + 1) % RECENT_SALES.length;
    }

    // First trigger after 4 seconds, then repeat every 18 seconds
    setTimeout(() => {
      triggerSale();
      setInterval(triggerSale, 18000);
    }, 4000);
  }

  // =========================================================================
  // INSTANT BUY NOW & COUPON COPY
  // =========================================================================
  function buyNow(productId) {
    addToCart(productId, 1);
    openCheckout();
  }

  function copyCoupon(code) {
    navigator.clipboard.writeText(code).then(() => {
      showToast(`Coupon "${code}" copied to clipboard! Paste it at checkout for 50% OFF.`, '📋');
      const promoInput = document.getElementById('promoCodeInput');
      if (promoInput) promoInput.value = code;
    }).catch(() => {
      showToast(`Use coupon "${code}" at checkout for 50% OFF!`, '🎁');
    });
  }

  function filterByGoal(goal) {
    const goalMap = {
      digestion: 'digest-harmony-tea',
      heart: 'heart-herbal-tea',
      energy: 'vital-flow-herbal-tea',
      sugar: 'diabetes-tea-powder',
      joints: 'arthveda-herbal-tea',
      focus: 'brain-booster-tea',
      detox: 'liver-detox-tea',
      aura: 'aura-spray-set-2'
    };

    const targetId = goalMap[goal];
    if (targetId) {
      activeCategory = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      renderProducts();

      // Scroll to products and open quick view of the recommended product
      const pSection = document.getElementById('products');
      if (pSection) pSection.scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => {
        openQuickView(targetId);
        showToast('Found your perfect wellness remedy!', '✨');
      }, 600);
    }
  }

  // Initialize Application
  document.addEventListener('DOMContentLoaded', () => {
    initTicker();
    initCurrency();
    renderProducts();
    updateCartUI();
    initHeroSlider();
    initAboutTabs();
    initTestimonials();
    initFAQ();
    initContactForm();
    initMobileMenu();
    initFilters();
    initBackToTop();
    applyTheme(currentTheme);
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    initSaleCountdown();
    initLiveSalesPopup();

    const applyPromoBtn = document.getElementById('applyPromoBtn');
    if (applyPromoBtn) applyPromoBtn.addEventListener('click', applyPromoCode);

    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  });

  // Global namespace for inline DOM events
  window.SSF = {
    addToCart,
    updateQty,
    removeFromCart,
    openCart,
    closeCart,
    openQuickView,
    closeModal,
    openCheckout,
    selectCategory,
    toggleTheme,
    toggleWishlist,
    buyNow,
    copyCoupon,
    filterByGoal,
    openAdminLogs,
    exportOrdersToCSV
  };
})();
