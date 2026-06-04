// ============================================
// EGSP Gaming Hub - Main Game Page Logic
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeUserSession();
    setupEventListeners();
    setupCardInputFormatting();
});

function initializeUserSession() {
    const currentUser = getCurrentUser();
    const loginBtn = document.getElementById('loginBtn');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userLevel = document.getElementById('userLevel');
    const step1LoggedIn = document.getElementById('step1LoggedIn');
    const step1NotLoggedIn = document.getElementById('step1NotLoggedIn');

    if (currentUser && isUserLoggedIn()) {
        // Header: hide login button, show avatar
        if (loginBtn) loginBtn.style.display = 'none';
        if (userAvatar) {
            userAvatar.style.display = 'flex';
            userAvatar.textContent = currentUser.displayName.charAt(0).toUpperCase();
        }
        if (userName) userName.textContent = currentUser.displayName;
        if (userLevel) userLevel.textContent = `Lv. ${currentUser.level}`;

        // Step 1: show logged-in user info
        if (step1LoggedIn) {
            step1LoggedIn.style.display = 'block';
            const avatar = document.getElementById('step1Avatar');
            const name = document.getElementById('step1Name');
            const level = document.getElementById('step1Level');
            if (avatar) avatar.textContent = currentUser.displayName.charAt(0).toUpperCase();
            if (name) name.textContent = currentUser.displayName;
            if (level) level.textContent = `Lv. ${currentUser.level}`;
        }
        if (step1NotLoggedIn) step1NotLoggedIn.style.display = 'none';
    } else {
        // Header: hide avatar, show login button
        if (userAvatar) userAvatar.style.display = 'none';
        const userMenu = document.getElementById('userMenu');
        if (userMenu) userMenu.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'inline-block';

        // Step 1: show login prompt
        if (step1LoggedIn) step1LoggedIn.style.display = 'none';
        if (step1NotLoggedIn) step1NotLoggedIn.style.display = 'block';
    }
}

function setupEventListeners() {
    // Game selection
    document.querySelectorAll('.game-item').forEach(item => {
        item.addEventListener('click', function() { handleGameSelection(this); });
    });

    // Amount selection
    document.querySelectorAll('.amount-card').forEach(card => {
        card.addEventListener('click', function() { handleAmountSelection(this); });
    });

    // User avatar toggle menu
    const userAvatar = document.getElementById('userAvatar');
    const userMenu = document.getElementById('userMenu');
    if (userAvatar && userMenu) {
        userAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = userMenu.style.display === 'block';
            userMenu.style.display = isOpen ? 'none' : 'block';
            userMenu.style.opacity = isOpen ? '0' : '1';
            userMenu.style.visibility = isOpen ? 'hidden' : 'visible';

            // Position the menu below avatar
            if (!isOpen) {
                const rect = userAvatar.getBoundingClientRect();
                userMenu.style.top = (rect.bottom + 8) + 'px';
                userMenu.style.right = (window.innerWidth - rect.right) + 'px';
            }
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (userMenu && userAvatar && !userMenu.contains(e.target) && !userAvatar.contains(e.target)) {
            userMenu.style.display = 'none';
            userMenu.style.opacity = '0';
            userMenu.style.visibility = 'hidden';
        }
    });

    // Payment button
    const payBtn = document.querySelector('.btn-pay');
    if (payBtn) {
        payBtn.addEventListener('click', handlePayment);
    }

    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function handleGameSelection(element) {
    document.querySelectorAll('.game-item').forEach(e => e.classList.remove('active'));
    element.classList.add('active');

    const gameName = element.querySelector('span').textContent;
    const gameImg = element.querySelector('.game-icon img')?.src;

    const selName = document.getElementById('selGameName');
    const oGame = document.getElementById('oGame');
    if (selName) selName.textContent = gameName;
    if (oGame) oGame.textContent = gameName;

    const selBanner = document.querySelector('.sel-banner');
    if (selBanner && gameImg) {
        selBanner.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url("${gameImg}")`;
    }
}

function handleAmountSelection(element) {
    if (!getCurrentUser() || !isUserLoggedIn()) {
        showNotification('Vui lòng đăng nhập trước để chọn mệnh giá', 'warning');
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        return;
    }

    document.querySelectorAll('.amount-card').forEach(e => e.classList.remove('selected'));
    element.classList.add('selected');

    const vnd = element.querySelector('.amount-vnd').textContent;
    const gem = element.querySelector('.amount-gem').textContent;

    const oAmount = document.getElementById('oAmount');
    const oGem = document.getElementById('oGem');
    const oTotal = document.getElementById('oTotal');
    if (oAmount) oAmount.textContent = vnd;
    if (oGem) oGem.textContent = gem;
    if (oTotal) oTotal.textContent = vnd + ' VND';

    const orderEmpty = document.getElementById('orderEmpty');
    const orderDetail = document.getElementById('orderDetail');
    if (orderEmpty) orderEmpty.style.display = 'none';
    if (orderDetail) orderDetail.style.display = 'block';
}

function handlePayment() {
    const currentUser = getCurrentUser();

    if (!currentUser || !isUserLoggedIn()) {
        showNotification('Vui lòng đăng nhập để thực hiện thanh toán', 'warning');
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        return;
    }

    const selectedAmount = document.querySelector('.amount-card.selected');
    if (!selectedAmount) {
        showNotification('Vui lòng chọn mệnh giá nạp', 'warning');
        return;
    }

    const selectedPayItem = document.querySelector('input[name="payment"]:checked')?.closest('.pay-item');
    const payType = selectedPayItem?.dataset.payType || 'simulate';
    const payName = selectedPayItem?.dataset.payName || 'Ví điện tử';
    const vnd = document.getElementById('oAmount').textContent;
    const game = document.getElementById('oGame').textContent;

    if (payType === 'qr') {
        openQRModal(vnd, game, payName, currentUser);
    } else if (payType === 'card') {
        openCardModal(vnd, payName);
    } else {
        // Simulate direct payment (Garena Sò etc.)
        simulatePayment(vnd, game, payName, currentUser);
    }
}

/* ===== QR Payment ===== */
function openQRModal(vnd, game, payName, currentUser) {
    document.getElementById('qrPaySection').style.display = 'block';
    document.getElementById('cardPaySection').style.display = 'none';
    document.getElementById('qrModalSubtitle').textContent = `Thanh toán qua ${payName}`;
    document.getElementById('qrAmount').textContent = vnd;
    document.getElementById('qrContent').textContent = `NAP ${game.toUpperCase().replace(/ /g,'_')} ${currentUser.username || currentUser.email}`;
    document.getElementById('paymentModal').classList.add('open');
}

function confirmQRPayment() {
    closePaymentModal();
    const currentUser = getCurrentUser();
    const vnd = document.getElementById('oAmount').textContent;
    const game = document.getElementById('oGame').textContent;
    const payName = document.querySelector('input[name="payment"]:checked')?.closest('.pay-item')?.dataset.payName || 'QR';

    logTransaction({
        date: new Date().toLocaleString('vi-VN'),
        game, amount: vnd, payment: payName,
        status: 'Thành công', user: currentUser?.displayName
    });

    showNotification(`Nạp ${vnd} cho ${game} thành công!`, 'success');
    resetOrderForm();
}

/* ===== Card Payment ===== */
function openCardModal(vnd, payName) {
    document.getElementById('qrPaySection').style.display = 'none';
    document.getElementById('cardPaySection').style.display = 'block';
    document.getElementById('cardModalTitle').textContent = payName === 'Thẻ tín dụng' ? 'Nhập thông tin thẻ tín dụng' : 'Nhập thông tin thẻ ATM';
    document.getElementById('cardAmount').textContent = vnd;

    // Clear form
    ['cardNumber','cardName','cardExpiry','cardCVV'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
        const err = document.getElementById(id + 'Error');
        if (err) err.classList.remove('show');
    });

    document.getElementById('paymentModal').classList.add('open');
}

function submitCardPayment() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardName = document.getElementById('cardName').value.trim();
    const cardExpiry = document.getElementById('cardExpiry').value.trim();
    const cardCVV = document.getElementById('cardCVV').value.trim();
    let valid = true;

    // Validate card number
    if (!/^\d{16}$/.test(cardNumber)) {
        showFieldError('cardNumber', 'cardNumberError', true);
        valid = false;
    } else {
        showFieldError('cardNumber', 'cardNumberError', false);
    }

    // Validate name
    if (cardName.length < 3) {
        showFieldError('cardName', 'cardNameError', true);
        valid = false;
    } else {
        showFieldError('cardName', 'cardNameError', false);
    }

    // Validate expiry MM/YY
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
        showFieldError('cardExpiry', 'cardExpiryError', true);
        valid = false;
    } else {
        showFieldError('cardExpiry', 'cardExpiryError', false);
    }

    // Validate CVV
    if (!/^\d{3,4}$/.test(cardCVV)) {
        showFieldError('cardCVV', 'cardCVVError', true);
        valid = false;
    } else {
        showFieldError('cardCVV', 'cardCVVError', false);
    }

    if (!valid) return;

    const btn = document.getElementById('cardSubmitBtn');
    btn.textContent = '⏳ Đang xử lý...';
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = 'Thanh toán ngay';
        btn.disabled = false;
        closePaymentModal();

        const currentUser = getCurrentUser();
        const vnd = document.getElementById('cardAmount').textContent;
        const game = document.getElementById('oGame').textContent;
        const payName = document.querySelector('input[name="payment"]:checked')?.closest('.pay-item')?.dataset.payName || 'Thẻ';

        logTransaction({
            date: new Date().toLocaleString('vi-VN'),
            game, amount: vnd, payment: payName,
            status: 'Thành công', user: currentUser?.displayName
        });

        showNotification(`Nạp ${vnd} cho ${game} thành công!`, 'success');
        resetOrderForm();
    }, 2000);
}

function showFieldError(inputId, errorId, show) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.toggle('error', show);
    if (error) error.classList.toggle('show', show);
}

/* ===== Simulate payment (Garena Sò) ===== */
function simulatePayment(vnd, game, payName, currentUser) {
    const payBtn = document.querySelector('.btn-pay');
    const originalText = payBtn.textContent;
    payBtn.textContent = '⏳ Đang xử lý...';
    payBtn.disabled = true;

    setTimeout(() => {
        payBtn.textContent = '✓ Thành công!';
        payBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';

        logTransaction({
            date: new Date().toLocaleString('vi-VN'),
            game, amount: vnd, payment: payName,
            status: 'Thành công', user: currentUser.displayName
        });

        showNotification(`Nạp ${vnd} cho ${game} thành công!`, 'success');

        setTimeout(() => {
            payBtn.textContent = originalText;
            payBtn.style.background = '';
            payBtn.disabled = false;
            resetOrderForm();
        }, 2000);
    }, 2000);
}

/* ===== Modal ===== */
function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('open');
}

// Close modal when clicking outside the box
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closePaymentModal();
        });
    }
});

/* ===== Card input auto-formatting ===== */
function setupCardInputFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function() {
            let v = this.value.replace(/\D/g, '').substring(0, 16);
            this.value = v.replace(/(.{4})/g, '$1 ').trim();
        });
    }

    const cardExpiry = document.getElementById('cardExpiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function() {
            let v = this.value.replace(/\D/g, '').substring(0, 4);
            if (v.length >= 3) v = v.substring(0, 2) + '/' + v.substring(2);
            this.value = v;
        });
    }

    const cardName = document.getElementById('cardName');
    if (cardName) {
        cardName.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    }
}

/* ===== Helpers ===== */
function resetOrderForm() {
    document.querySelectorAll('.amount-card').forEach(e => e.classList.remove('selected'));
    const orderEmpty = document.getElementById('orderEmpty');
    const orderDetail = document.getElementById('orderDetail');
    if (orderEmpty) orderEmpty.style.display = 'block';
    if (orderDetail) orderDetail.style.display = 'none';
}

function showNotification(message, type = 'info') {
    const colors = { success: '#22c55e', warning: '#f59e0b', error: '#ef4444', info: '#4f46e5' };
    const notif = document.createElement('div');
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 72px;
        right: 20px;
        max-width: 320px;
        padding: 14px 18px;
        background: ${colors[type] || colors.info};
        color: white;
        border-radius: 10px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
        line-height: 1.4;
    `;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notif.remove(), 300);
    }, 3500);
}

function logTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.unshift(transaction);
    if (transactions.length > 50) transactions = transactions.slice(0, 50);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(360px); opacity: 0; }
        to   { transform: translateX(0);     opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0);     opacity: 1; }
        to   { transform: translateX(360px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Enhanced logout with confirmation
function logout() {
    if (!confirm('Bạn có chắc chắn muốn đăng xuất?')) return;

    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    showNotification('Đã đăng xuất thành công', 'success');
    setTimeout(() => { window.location.href = 'login.html'; }, 1000);
}
