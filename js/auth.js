
function initializeDemoAccounts() {
    const existingAccounts = localStorage.getItem('gameAccounts');
    if (!existingAccounts) {
        const demoAccounts = [
            {
                email: 'player@egsp.com',
                username: 'gamerpro',
                password: 'password123',
                displayName: 'Gamer Pro',
                level: 45,
                balance: 250000
            },
            {
                email: 'warrior@egsp.com',
                username: 'lionkiller',
                password: 'password123',
                displayName: 'Lion Killer',
                level: 52,
                balance: 520000
            },
            {
                email: 'phoenix@egsp.com',
                username: 'phoenixfire',
                password: 'password123',
                displayName: 'Phoenix Fire',
                level: 38,
                balance: 180000
            }
        ];
        localStorage.setItem('gameAccounts', JSON.stringify(demoAccounts));
    }
}

// Dữ liệu tài khoản mẫu (Demo)
const demoAccounts = [
    {
        email: 'player@egsp.com',
        username: 'gamerpro',
        password: 'password123',
        displayName: 'Gamer Pro',
        level: 45,
        balance: 250000
    },
    {
        email: 'warrior@egsp.com',
        username: 'lionkiller',
        password: 'password123',
        displayName: 'Lion Killer',
        level: 52,
        balance: 520000
    },
    {
        email: 'phoenix@egsp.com',
        username: 'phoenixfire',
        password: 'password123',
        displayName: 'Phoenix Fire',
        level: 38,
        balance: 180000
    }
];

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize demo accounts
    initializeDemoAccounts();
    
    const loginBtn = document.getElementById('loginBtn');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const pwToggle = document.querySelector('.pw-toggle');

    // Password visibility toggle
    if (pwToggle) {
        pwToggle.addEventListener('click', function() {
            const eyeOpen = this.querySelector('.eye-open');
            const eyeClosed = this.querySelector('.eye-closed');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeOpen.style.display = 'none';
                eyeClosed.style.display = 'block';
            } else {
                passwordInput.type = 'password';
                eyeOpen.style.display = 'block';
                eyeClosed.style.display = 'none';
            }
        });
    }

    // Login button click
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }

    // Enter key to login
    if (emailInput && passwordInput) {
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }

    // Load remembered email if exists
    loadRememberedEmail();
});

function handleLogin() {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const rememberCheckbox = document.getElementById('rememberMe');
    const errorMsg = document.getElementById('errorMsg');
    const loginBtn = document.getElementById('loginBtn');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validation
    if (!email || !password) {
        showError('Vui lòng nhập email/tên đăng nhập và mật khẩu', errorMsg);
        return;
    }

    // Initialize demo accounts if needed
    initializeDemoAccounts();
    
    // Get all accounts (demo + user-created)
    const allAccounts = JSON.parse(localStorage.getItem('gameAccounts') || '[]');

    // Find account
    const account = allAccounts.find(acc => 
        (acc.email === email || acc.username === email) && acc.password === password
    );

    if (!account) {
        showError('Email/Tên đăng nhập hoặc mật khẩu không chính xác', errorMsg);
        passwordInput.value = '';
        return;
    }

    // Save user session
    saveUserSession(account);

    // Remember email if checked
    if (rememberCheckbox.checked) {
        localStorage.setItem('rememberedEmail', email);
    } else {
        localStorage.removeItem('rememberedEmail');
    }

    // Show success animation
    loginBtn.textContent = '✓ ĐĂNG NHẬP THÀNH CÔNG';
    loginBtn.style.background = 'linear-gradient(135deg, #2d5016 0%, #1f3611 100%)';
    loginBtn.disabled = true;

    // Redirect after 1.5 seconds
    setTimeout(() => {
        window.location.href = 'DoAnGame.html';
    }, 1500);
}

function saveUserSession(account) {
    const userData = {
        email: account.email,
        username: account.username,
        displayName: account.displayName,
        level: account.level,
        balance: account.balance,
        loginTime: new Date().toISOString(),
        sessionId: generateSessionId()
    };

    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
}

function loadRememberedEmail() {
    const emailInput = document.getElementById('loginEmail');
    const rememberCheckbox = document.getElementById('rememberMe');
    const rememberedEmail = localStorage.getItem('rememberedEmail');

    if (rememberedEmail && emailInput) {
        emailInput.value = rememberedEmail;
        rememberCheckbox.checked = true;
    }
}

function showError(message, errorElement) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 4000);
    }
}

function generateSessionId() {
    return 'EGSP_' + Math.random().toString(36).substr(2, 9).toUpperCase() + Date.now();
}


function quickLogin(provider) {
    if (provider === 'google') {
        const account = demoAccounts[0]; // Dùng tài khoản đầu tiên
        document.getElementById('loginEmail').value = account.email;
        document.getElementById('loginPassword').value = account.password;
    } else if (provider === 'facebook') {
        const account = demoAccounts[1]; // Dùng tài khoản thứ hai
        document.getElementById('loginEmail').value = account.email;
        document.getElementById('loginPassword').value = account.password;
    }
    
    setTimeout(() => handleLogin(), 300);
}

// Logout dùng chung cho TẤT CẢ các trang.
// Có xác nhận; dùng thông báo đẹp nếu trang có showNotification().
function logout() {
    if (!confirm('Bạn có chắc chắn muốn đăng xuất?')) return;

    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('sessionId');

    if (typeof showNotification === 'function') {
        showNotification('Đã đăng xuất thành công', 'success');
        setTimeout(() => { window.location.href = 'login.html'; }, 1000);
    } else {
        window.location.href = 'login.html';
    }
}

function doLogout() { logout(); }


function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}
