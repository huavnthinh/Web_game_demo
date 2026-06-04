// Registration validation and account creation logic

const regValidation = {
  fullName: (value) => {
    if (!value.trim()) return "Vui lòng nhập họ và tên";
    if (value.trim().length < 3) return "Họ tên phải ít nhất 3 ký tự";
    if (!/^[a-zA-ZÀ-ỿ\s]+$/.test(value)) return "Họ tên không được chứa số hoặc ký tự đặc biệt";
    return null;
  },
  email: (value) => {
    if (!value.trim()) return "Vui lòng nhập email";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email không hợp lệ (ví dụ: user@gmail.com)";
    
    // Check if email already exists
    const accounts = JSON.parse(localStorage.getItem('gameAccounts') || '[]');
    if (accounts.some(acc => acc.email === value)) {
      return "Email này đã được đăng ký";
    }
    return null;
  },
  username: (value) => {
    if (!value.trim()) return "Vui lòng nhập tên đăng nhập";
    if (value.trim().length < 3) return "Tên đăng nhập phải ít nhất 3 ký tự";
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới";
    
    // Check if username already exists
    const accounts = JSON.parse(localStorage.getItem('gameAccounts') || '[]');
    if (accounts.some(acc => acc.username === value)) {
      return "Tên đăng nhập này đã tồn tại";
    }
    return null;
  },
  phone: (value) => {
    if (!value.trim()) return "Vui lòng nhập số điện thoại";
    if (!/^0[0-9]{9,10}$/.test(value)) return "Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số";
    return null;
  },
  password: (value) => {
    if (!value) return "Vui lòng nhập mật khẩu";
    if (value.length < 8) return "Mật khẩu phải ít nhất 8 ký tự";
    if (!/[A-Z]/.test(value)) return "Mật khẩu phải chứa ít nhất 1 chữ hoa";
    if (!/[0-9]/.test(value)) return "Mật khẩu phải chứa ít nhất 1 chữ số";
    return null;
  },
  confirmPassword: (pwd, confirmPwd) => {
    if (!confirmPwd) return "Vui lòng xác nhận mật khẩu";
    if (pwd !== confirmPwd) return "Mật khẩu xác nhận không trùng khớp";
    return null;
  }
};

function showError(message) {
  const errorMsg = document.getElementById('regErrorMsg');
  errorMsg.textContent = message;
  errorMsg.style.display = 'block';
  return true;
}

function clearError() {
  const errorMsg = document.getElementById('regErrorMsg');
  errorMsg.style.display = 'none';
  errorMsg.textContent = '';
}

function handleRegister() {
  clearError();

  // Get form values
  const fullName = document.getElementById('regFullName').value;
  const email = document.getElementById('regEmail').value;
  const username = document.getElementById('regUsername').value;
  const phone = document.getElementById('regPhone').value;
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  const agreeTerms = document.getElementById('regAgree').checked;

  // Validate each field
  let error;

  error = regValidation.fullName(fullName);
  if (error) return showError(error);

  error = regValidation.email(email);
  if (error) return showError(error);

  error = regValidation.username(username);
  if (error) return showError(error);

  error = regValidation.phone(phone);
  if (error) return showError(error);

  error = regValidation.password(password);
  if (error) return showError(error);

  error = regValidation.confirmPassword(password, confirmPassword);
  if (error) return showError(error);

  if (!agreeTerms) {
    return showError("Vui lòng đồng ý với Điều khoản và Chính sách bảo mật");
  }

  // Create new account
  const newAccount = {
    email: email,
    username: username,
    password: password,
    displayName: fullName,
    phone: phone,
    level: 1,
    balance: 0,
    createdAt: new Date().toISOString()
  };

  // Save to localStorage
  let accounts = JSON.parse(localStorage.getItem('gameAccounts') || '[]');
  accounts.push(newAccount);
  localStorage.setItem('gameAccounts', JSON.stringify(accounts));

  // Show success and redirect
  const btn = document.getElementById('regBtn');
  btn.textContent = '✓ Tài khoản đã tạo';
  btn.style.background = '#2d5016';
  
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1500);
}

// Allow Enter key to submit form
document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.field-input');
  inputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleRegister();
      }
    });
  });
});
