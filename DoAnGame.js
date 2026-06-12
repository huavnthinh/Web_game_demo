// ============================================
// EGSP Gaming Hub - Main Game Page Logic
// ============================================

const GAME_DATA = {
    'Liên Quân Mobile': { currency: 'Xu',        img: 'images/lienquan.jpg'  },
    'Free Fire':        { currency: 'Kim Cương',  img: 'images/freefire.jpg'  },
    'FC Online VN':     { currency: 'NX Cash',    img: 'images/fconl.jpg'     },
    'Delta Force':      { currency: 'Gold',        img: 'images/deltaforce.jpg'}
};
const AMOUNT_QTY = ['20', '40', '102', '204', '408', '1.020', '2.090'];

// ============================================
// GÓI NẠP THÁNG (Monthly Pass) - mỗi game có ưu đãi khác biệt
// basic = Gói Cơ Bản (125.000đ) · vip = Gói Cao Cấp/VIP (250.000đ)
// ============================================
const PACK_DAYS = 30; // Thời hạn mỗi gói (ngày)

const MONTHLY_PACKAGES = {
    'Liên Quân Mobile': {
        basic: { name: 'Sổ sứ mệnh (Chiến Binh Mùa Đông)', price: '100.000 đ', reward: '260 Xu + 15 Xu mỗi ngày + Skin bậc s+ tự chọn',
            perks: ['+5% Xu cho mỗi lần nạp lẻ', 'Khung avatar Đồng độc quyền'] },
        vip:   { name: 'Sổ sứ mệnh (Chiến Binh Mùa Đông) cao cấp', price: '250.000 đ', reward: '600 Xu + 40 Xu mỗi ngày',
            perks: ['1 Tướng + 1 Trang phục ngẫu nhiên / Tuần', '+12% Xu cho mỗi lần nạp lẻ', 'Khung Vàng VIP & hỗ trợ ưu tiên 24/7','Đặt quyền mua skin SS cực chất'] }
    },
    'Free Fire': {
        basic: { name: 'Thông Hành Sinh Tồn', price: '125.000 đ', reward: '280 Kim Cương + 18 KC mỗi ngày',
            perks: ['+5% Kim Cương mỗi lần nạp lẻ', 'Túi vật phẩm Bạc hàng tuần'] },
        vip:   { name: 'Thông Hành Tinh Anh', price: '250.000 đ', reward: '650 Kim Cương + 45 KC mỗi ngày',
            perks: ['Bộ skin súng độc quyền + thú cưng', '+12% Kim Cương mỗi lần nạp lẻ', 'Vòng quay VIP miễn phí mỗi tuần'] }
    },
    'FC Online VN': {
        basic: { name: 'Hợp Đồng Tân Binh', price: '125.000 đ', reward: '270 NX Cash + 16 NX mỗi ngày',
            perks: ['+5% NX Cash mỗi lần nạp lẻ', '1 gói thẻ cầu thủ ngẫu nhiên'] },
        vip:   { name: 'Hợp Đồng Ngôi Sao', price: '250.000 đ', reward: '640 NX Cash + 42 NX mỗi ngày',
            perks: ['1 thẻ cầu thủ ICON đảm bảo / tháng', '+12% NX Cash mỗi lần nạp lẻ', 'Nhân đôi EXP vào cuối tuần'] }
    },
    'Delta Force': {
        basic: { name: 'Quân Nhu Tân Binh', price: '125.000 đ', reward: '260 Gold + 15 Gold mỗi ngày',
            perks: ['+5% Gold mỗi lần nạp lẻ', 'Skin súng cơ bản độc quyền'] },
        vip:   { name: 'Quân Nhu Đặc Nhiệm', price: '250.000 đ', reward: '620 Gold + 40 Gold mỗi ngày',
            perks: ['Bộ giáp + skin súng Huyền Thoại', '+12% Gold mỗi lần nạp lẻ', 'Thẻ tăng tốc Battle Pass'] }
    }
};

// Gói tháng đang được chọn để thanh toán (null nếu đang chọn mệnh giá thường)
let selectedPackage = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeUserSession();
    setupEventListeners();
    setupCardInputFormatting();
    setupGameSearch();
    handleHashGameSelection();
    initSelBanner();
});

// ============================================
// TÌM KIẾM & LỌC GAME theo tên + nhà phát hành
// ============================================
const GAME_PUBLISHER = {
    'Liên Quân Mobile': 'Garena',
    'Free Fire': 'Garena',
    'FC Online VN': 'EA Sports',
    'Delta Force': 'TiMi Studio'
};

function setupGameSearch() {
    const search = document.getElementById('gameSearch');
    const chips = document.querySelectorAll('.gchip');
    const items = document.querySelectorAll('.game-item');
    const noResult = document.getElementById('gameNoResult');
    if (!items.length) return;

    let activePub = '';

    function applyGameFilter() {
        const q = (search?.value || '').trim().toLowerCase();
        let visible = 0;
        items.forEach(item => {
            const name = item.querySelector('span')?.textContent || '';
            const pub = GAME_PUBLISHER[name] || '';
            const matchName = !q || name.toLowerCase().includes(q);
            const matchPub = !activePub || pub === activePub;
            const show = matchName && matchPub;
            item.style.display = show ? '' : 'none';
            if (show) visible++;
        });
        if (noResult) noResult.style.display = visible ? 'none' : 'block';
    }

    if (search) search.addEventListener('input', applyGameFilter);
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activePub = chip.dataset.pub || '';
            applyGameFilter();
        });
    });
}

function initSelBanner() {
    const firstGame = document.querySelector('.game-item.active');
    if (firstGame) handleGameSelection(firstGame);
}

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

        // Hide "Đăng nhập" in hamburger dropdown, show "Đăng xuất"
        const ddLoginItem = document.getElementById('ddLoginItem');
        const ddLogoutItem = document.getElementById('ddLogoutItem');
        if (ddLoginItem) ddLoginItem.style.display = 'none';
        if (ddLogoutItem) ddLogoutItem.style.display = 'block';

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

        // Show "Đăng nhập" in dropdown, hide "Đăng xuất"
        const ddLoginItem = document.getElementById('ddLoginItem');
        const ddLogoutItem = document.getElementById('ddLogoutItem');
        if (ddLoginItem) ddLoginItem.style.display = 'block';
        if (ddLogoutItem) ddLogoutItem.style.display = 'none';

        // Step 1: show login prompt
        if (step1LoggedIn) step1LoggedIn.style.display = 'none';
        if (step1NotLoggedIn) step1NotLoggedIn.style.display = 'block';
    }
}

function setupEventListeners() {
    // Game selection (click + keyboard)
    document.querySelectorAll('.game-item').forEach(item => {
        item.addEventListener('click', function() { handleGameSelection(this); });
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleGameSelection(this); }
        });
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

            if (!isOpen) {
                const rect = userAvatar.getBoundingClientRect();
                userMenu.style.top = (rect.bottom + 8) + 'px';
                userMenu.style.right = (window.innerWidth - rect.right) + 'px';
            }
        });
    }

    // Close user menu when clicking outside
    document.addEventListener('click', (e) => {
        if (userMenu && userAvatar && !userMenu.contains(e.target) && !userAvatar.contains(e.target)) {
            userMenu.style.display = 'none';
            userMenu.style.opacity = '0';
            userMenu.style.visibility = 'hidden';
        }
    });

    // Hamburger toggle
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLeft = document.querySelector('.nav-left');
    if (hamburgerBtn && navLeft) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLeft.classList.toggle('menu-open');
        });
        document.addEventListener('click', (e) => {
            if (!navLeft.contains(e.target)) navLeft.classList.remove('menu-open');
        });
    }

    // Dropdown game item clicks → scroll to & select game
    const ddGameMap = {
        'Liên Quân Mobile': 0,
        'Free Fire': 1,
        'FC Online VN': 2,
        'Delta Force': 3
    };
    document.querySelectorAll('#navDropdown .dd-item').forEach(item => {
        const text = item.textContent.trim();
        if (ddGameMap.hasOwnProperty(text)) {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const gameItems = document.querySelectorAll('.game-item');
                const target = gameItems[ddGameMap[text]];
                if (target) {
                    handleGameSelection(target);
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                navLeft && navLeft.classList.remove('menu-open');
            });
        }
    });

    // "Chọn nhanh game khác" cards → select corresponding game & scroll up.
    // Cards without a data-game (e.g. hướng dẫn) keep their normal link navigation.
    document.querySelectorAll('.other-card').forEach(card => {
        const link = card.querySelector('a');
        const gameName = card.dataset.game;
        if (!link || !gameName) return;
        link.addEventListener('click', (e) => {
            const gameItems = document.querySelectorAll('.game-item');
            gameItems.forEach(gi => {
                if (gi.querySelector('span')?.textContent === gameName) {
                    e.preventDefault();
                    handleGameSelection(gi);
                    gi.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });
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

function handleHashGameSelection() {
    const hashMap = { freefire: 'Free Fire', fconline: 'FC Online VN', deltaforce: 'Delta Force', lienquan: 'Liên Quân Mobile' };
    const hash = window.location.hash.slice(1).toLowerCase();
    const gameName = hashMap[hash];
    if (!gameName) return;
    const gameItems = document.querySelectorAll('.game-item');
    gameItems.forEach(gi => {
        if (gi.querySelector('span')?.textContent === gameName) handleGameSelection(gi);
    });
}

function handleGameSelection(element) {
    document.querySelectorAll('.game-item').forEach(e => e.classList.remove('active'));
    element.classList.add('active');

    const gameName = element.querySelector('span').textContent;
    const gameImg = element.querySelector('.game-icon img')?.src;
    const gameData = GAME_DATA[gameName] || { currency: 'Xu', img: gameImg };

    // 1. ĐỊNH NGHĨA ẢNH BANNER ĐẸP CHO TỪNG GAME
    // Bạn có thể thêm bớt các game khác ở đây tùy ý nhé
    const bannerMapping = {
        'Liên Quân Mobile': 'images/BNLienquan.jpg',
        'Free Fire': 'images/BNFreefire.jpg',
        'Delta Force': 'images/BNDeltaforce.jpg',
        'FC Online VN': 'images/BNFconl.jpg'
    };

    // Lấy ảnh banner tương ứng từ danh sách trên, nếu game nào không có thì dùng tạm gameImg làm dự phòng
    const selectedBannerImg = bannerMapping[gameName] || gameImg;

    // Update sel-banner name, icon, and currency tag
    const selName = document.getElementById('selGameName');
    if (selName) selName.textContent = gameName;

    const selCurrency = document.getElementById('selCurrency');
    if (selCurrency) selCurrency.textContent = gameData.currency;

    const selIconImg = document.getElementById('selGameImg') || document.querySelector('.sel-icon img');
    if (selIconImg && gameImg) selIconImg.src = gameImg;

    // 2. CẬP NHẬT ẢNH NỀN BANNER THEO ẢNH ĐẸP ĐÃ CHỌN
    const selBanner = document.querySelector('.sel-banner');
    if (selBanner && selectedBannerImg) {
        selBanner.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url("${selectedBannerImg}")`;
    }

    // Update order panel game name
    const oGame = document.getElementById('oGame');
    if (oGame) oGame.textContent = gameName;

    // Update amount currency labels
    document.querySelectorAll('.amount-gem').forEach((el, i) => {
        el.textContent = (AMOUNT_QTY[i] || '') + ' ' + gameData.currency;
    });

    // Refresh oGem if an amount is already selected
    const selectedCard = document.querySelector('.amount-card.selected');
    if (selectedCard) {
        const oGem = document.getElementById('oGem');
        if (oGem) oGem.textContent = selectedCard.querySelector('.amount-gem')?.textContent || '';
    }

    // Đổi game thì reset lựa chọn gói tháng & render lại 2 gói của game mới
    selectedPackage = null;
    renderMonthlyPackages(gameName);
}

/* ===== GÓI NẠP THÁNG ===== */
// Số ngày còn lại của một gói dựa trên thời điểm hết hạn (ms)
function daysLeft(expiryMs) {
    const diff = expiryMs - Date.now();
    return diff <= 0 ? 0 : Math.ceil(diff / 86400000);
}

// Tìm gói tháng đang còn hiệu lực của game (đọc từ lịch sử đã lưu theo tài khoản)
function getActivePackage(gameName) {
    const user = getCurrentUser();
    if (!user || typeof getTransactionHistory !== 'function') return null;
    const list = getTransactionHistory(user.email) || [];
    const found = list.find(tx => tx.type === 'package' && tx.game === gameName &&
        tx.status === 'Thành công' && tx.expiry && tx.expiry > Date.now());
    return found || null;
}

// Render 2 thẻ gói (Cơ Bản + VIP) cho game đang chọn
function renderMonthlyPackages(gameName) {
    const grid = document.getElementById('monthPackGrid');
    if (!grid) return;
    const packs = MONTHLY_PACKAGES[gameName];
    if (!packs) { grid.innerHTML = ''; return; }

    const active = getActivePackage(gameName);

    function cardHtml(tier, p) {
        const isVip = tier === 'vip';
        const owned = active && active.tier === tier;
        const ownedBadge = owned
            ? `<div class="mpack-owned">✓ Đang sở hữu · còn ${daysLeft(active.expiry)} ngày</div>`
            : '';
        const perks = p.perks.map(x => `<li>${x}</li>`).join('');
        return `
        <div class="col-12 col-md-6">
            <div class="mpack-card ${isVip ? 'vip' : 'basic'} ${owned ? 'owned' : ''}"
                 data-tier="${tier}" tabindex="0" role="button" aria-label="Chọn ${p.name}">
                <div class="mpack-badge">${isVip ? 'VIP / Cao Cấp' : 'Cơ Bản'}</div>
                <div class="mpack-name">${p.name}</div>
                <div class="mpack-price">${p.price}<span>/tháng</span></div>
                <div class="mpack-reward">${p.reward}</div>
                <ul class="mpack-perks">${perks}</ul>
                ${ownedBadge}
            </div>
        </div>`;
    }

    grid.innerHTML = cardHtml('basic', packs.basic) + cardHtml('vip', packs.vip);

    grid.querySelectorAll('.mpack-card').forEach(card => {
        card.addEventListener('click', () => handlePackageSelection(card, gameName));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePackageSelection(card, gameName); }
        });
    });
}

function handlePackageSelection(card, gameName) {
    if (!getCurrentUser() || !isUserLoggedIn()) {
        showNotification('Vui lòng đăng nhập trước để mua Gói Nạp Tháng', 'warning');
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        return;
    }

    const tier = card.dataset.tier;
    const pack = MONTHLY_PACKAGES[gameName]?.[tier];
    if (!pack) return;

    // Bỏ chọn mệnh giá thường và các gói khác, đánh dấu gói này
    document.querySelectorAll('.amount-card').forEach(e => e.classList.remove('selected'));
    document.querySelectorAll('.mpack-card').forEach(e => e.classList.remove('selected'));
    card.classList.add('selected');

    const tierLabel = tier === 'vip' ? 'Gói VIP' : 'Gói Cơ Bản';
    selectedPackage = { tier, tierLabel, name: pack.name, price: pack.price, reward: pack.reward };

    // Đổ thông tin vào panel đơn hàng
    const oAmount = document.getElementById('oAmount');
    const oGem = document.getElementById('oGem');
    const oTotal = document.getElementById('oTotal');
    if (oAmount) oAmount.textContent = pack.price;
    if (oGem) oGem.textContent = `${tierLabel} · ${pack.reward}`;
    if (oTotal) oTotal.textContent = pack.price + ' VND';

    const orderEmpty = document.getElementById('orderEmpty');
    const orderDetail = document.getElementById('orderDetail');
    if (orderEmpty) orderEmpty.style.display = 'none';
    if (orderDetail) orderDetail.style.display = 'block';

    showNotification(`Đã chọn ${pack.name} (${tierLabel})`, 'info');
}

// Gắn thông tin gói tháng vào giao dịch trước khi lưu (nếu đang chọn gói)
function applyPackageFields(tx) {
    if (!selectedPackage) return tx;
    tx.type = 'package';
    tx.tier = selectedPackage.tier;
    tx.note = `${selectedPackage.tierLabel} (${PACK_DAYS} ngày)`;
    tx.gem = `${selectedPackage.tierLabel} · ${selectedPackage.reward}`;
    tx.expiry = Date.now() + PACK_DAYS * 86400000;
    return tx;
}
function handleAmountSelection(element) {
    if (!getCurrentUser() || !isUserLoggedIn()) {
        showNotification('Vui lòng đăng nhập trước để chọn mệnh giá', 'warning');
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        return;
    }

    // Chọn mệnh giá thường → huỷ chọn gói tháng (nếu có)
    selectedPackage = null;
    document.querySelectorAll('.mpack-card').forEach(e => e.classList.remove('selected'));

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
    if (!selectedAmount && !selectedPackage) {
        showNotification('Vui lòng chọn mệnh giá nạp hoặc Gói Nạp Tháng', 'warning');
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
    const gem = document.getElementById('oGem')?.textContent || '';
    const payName = document.querySelector('input[name="payment"]:checked')?.closest('.pay-item')?.dataset.payName || 'QR';

    logTransaction(applyPackageFields({
        date: new Date().toLocaleString('vi-VN'),
        game, amount: vnd, gem, payment: payName,
        status: 'Thành công', user: currentUser?.displayName
    }));

    showNotification(packPaidMsg(vnd, game), 'success');
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
        const gem = document.getElementById('oGem')?.textContent || '';
        const payName = document.querySelector('input[name="payment"]:checked')?.closest('.pay-item')?.dataset.payName || 'Thẻ';

        logTransaction(applyPackageFields({
            date: new Date().toLocaleString('vi-VN'),
            game, amount: vnd, gem, payment: payName,
            status: 'Thành công', user: currentUser?.displayName
        }));

        showNotification(packPaidMsg(vnd, game), 'success');
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

        const gem = document.getElementById('oGem')?.textContent || '';
        logTransaction(applyPackageFields({
            date: new Date().toLocaleString('vi-VN'),
            game, amount: vnd, gem, payment: payName,
            status: 'Thành công', user: currentUser.displayName
        }));

        showNotification(packPaidMsg(vnd, game), 'success');

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
// Thông báo phù hợp cho gói tháng hoặc nạp lẻ
function packPaidMsg(vnd, game) {
    if (selectedPackage) {
        return `Kích hoạt ${selectedPackage.tierLabel} cho ${game} thành công! Hiệu lực ${PACK_DAYS} ngày.`;
    }
    return `Nạp ${vnd} cho ${game} thành công!`;
}

function resetOrderForm() {
    document.querySelectorAll('.amount-card').forEach(e => e.classList.remove('selected'));
    document.querySelectorAll('.mpack-card').forEach(e => e.classList.remove('selected'));
    selectedPackage = null;
    const orderEmpty = document.getElementById('orderEmpty');
    const orderDetail = document.getElementById('orderDetail');
    if (orderEmpty) orderEmpty.style.display = 'block';
    if (orderDetail) orderDetail.style.display = 'none';

    // Làm mới nhãn "Đang sở hữu" cho game đang chọn (sau khi mua gói)
    const activeGame = document.querySelector('.game-item.active span')?.textContent;
    if (activeGame) renderMonthlyPackages(activeGame);
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
    if (typeof saveTransaction === 'function') {
        saveTransaction(transaction);
    } else {
        // Fallback: shared storage
        let list = JSON.parse(localStorage.getItem('transactions') || '[]');
        list.unshift(transaction);
        if (list.length > 50) list = list.slice(0, 50);
        localStorage.setItem('transactions', JSON.stringify(list));
    }
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

// logout() được định nghĩa tập trung trong auth.js (đã có confirm + showNotification).
