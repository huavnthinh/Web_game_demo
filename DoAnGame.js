// ============================================
// EGSP Gaming Hub - Main Game Page Logic
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeUserSession();
    setupEventListeners();
});

function initializeUserSession() {
    const currentUser = getCurrentUser();
    const loginBtn = document.getElementById('loginBtn');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userLevel = document.getElementById('userLevel');

    if (currentUser && isUserLoggedIn()) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = 'none';
        if (userAvatar) {
            userAvatar.style.display = 'flex';
            userAvatar.textContent = currentUser.displayName.charAt(0).toUpperCase();
        }
        if (userName) userName.textContent = currentUser.displayName;
        if (userLevel) userLevel.textContent = `Lv. ${currentUser.level}`;
    } else {
        // User not logged in
        if (userAvatar) userAvatar.style.display = 'none';
        const userMenu = document.getElementById('userMenu');
        if (userMenu) userMenu.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'inline-block';
    }
}

function setupEventListeners() {
    // Game selection
    const gameItems = document.querySelectorAll('.game-item');
    gameItems.forEach(item => {
        item.addEventListener('click', function() {
            handleGameSelection(this);
        });
    });

    // Amount selection
    const amountCards = document.querySelectorAll('.amount-card');
    amountCards.forEach(card => {
        card.addEventListener('click', function() {
            handleAmountSelection(this);
        });
    });

    // Login button in form
    const loginFormBtn = document.querySelector('.input-row .btn-red');
    if (loginFormBtn) {
        loginFormBtn.addEventListener('click', handleFormLogin);
    }

    // Payment button
    const payBtn = document.querySelector('.btn-pay');
    if (payBtn) {
        payBtn.addEventListener('click', handlePayment);
    }
}

function handleGameSelection(element) {
    // Remove active from all
    document.querySelectorAll('.game-item').forEach(e => e.classList.remove('active'));
    
    // Add active to selected
    element.classList.add('active');

    // Update selected game info
    const gameName = element.querySelector('span').textContent;
    const gameImg = element.querySelector('.game-icon img')?.src;

    document.getElementById('selGameName').textContent = gameName;
    document.getElementById('oGame').textContent = gameName;

    // Update banner image
    const selBanner = document.querySelector('.sel-banner');
    if (selBanner && gameImg) {
        selBanner.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("${gameImg}")`;
    }
}

function handleAmountSelection(element) {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập trước', 'warning');
        return;
    }

    // Remove selected from all
    document.querySelectorAll('.amount-card').forEach(e => e.classList.remove('selected'));
    
    // Add selected to clicked
    element.classList.add('selected');

    // Get amount values
    const vnd = element.querySelector('.amount-vnd').textContent;
    const gem = element.querySelector('.amount-gem').textContent;

    // Update order info
    document.getElementById('oAmount').textContent = vnd;
    document.getElementById('oGem').textContent = gem;
    document.getElementById('oTotal').textContent = vnd + ' VND';

    // Show order detail
    const orderEmpty = document.getElementById('orderEmpty');
    const orderDetail = document.getElementById('orderDetail');
    
    if (orderEmpty) orderEmpty.style.display = 'none';
    if (orderDetail) orderDetail.style.display = 'block';
}

function handleFormLogin() {
    const currentUser = getCurrentUser();
    
    if (currentUser && isUserLoggedIn()) {
        showNotification(`Đã đăng nhập thành công với tài khoản: ${currentUser.displayName}`, 'success');
    } else {
        showNotification('Vui lòng đăng nhập qua trang login.html', 'warning');
    }
}

function handlePayment() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để thực hiện thanh toán', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    const selectedAmount = document.querySelector('.amount-card.selected');
    if (!selectedAmount) {
        showNotification('Vui lòng chọn mệnh giá nạp', 'warning');
        return;
    }

    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    const paymentMethod = selectedPayment?.parentElement?.textContent?.trim() || 'ShopeePay';

    const vnd = document.getElementById('oAmount').textContent;
    const game = document.getElementById('oGame').textContent;

    // Show processing
    const payBtn = document.querySelector('.btn-pay');
    const originalText = payBtn.textContent;
    payBtn.textContent = '⏳ Đang xử lý...';
    payBtn.disabled = true;

    // Simulate payment processing
    setTimeout(() => {
        payBtn.textContent = '✓ Thanh toán thành công!';
        payBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

        // Log transaction
        logTransaction({
            date: new Date().toLocaleString('vi-VN'),
            game: game,
            amount: vnd,
            payment: paymentMethod,
            status: 'Thành công',
            user: currentUser.displayName
        });

        showNotification(`Nạp ${vnd} cho ${game} thành công! Phương thức: ${paymentMethod}`, 'success');

        // Reset form
        setTimeout(() => {
            payBtn.textContent = originalText;
            payBtn.style.background = '';
            payBtn.disabled = false;
            document.querySelectorAll('.amount-card').forEach(e => e.classList.remove('selected'));
            document.getElementById('orderEmpty').style.display = 'block';
            document.getElementById('orderDetail').style.display = 'none';
        }, 2000);
    }, 2000);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

function logTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.unshift(transaction);
    
    // Keep only last 50 transactions
    if (transactions.length > 50) {
        transactions = transactions.slice(0, 50);
    }
    
    localStorage.setItem('transactions', JSON.stringify(transactions));
    console.log('Transaction logged:', transaction);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .hamburger span {
        background: #e8eaed !important;
        transition: all 0.3s ease;
    }

    .input-row input {
        background: rgba(20, 25, 34, 0.5);
        color: #e8eaed;
        border: 1px solid var(--border-dark);
    }

    .input-row input::placeholder {
        color: #6b7280;
    }

    .input-row input:focus {
        outline: none;
        border-color: #c8102e;
        box-shadow: 0 0 12px rgba(200, 16, 46, 0.2);
    }

    .btn-red {
        transition: all 0.3s ease;
    }

    .btn-red:hover {
        box-shadow: 0 4px 12px rgba(200, 16, 46, 0.3);
    }
`;
document.head.appendChild(style);
