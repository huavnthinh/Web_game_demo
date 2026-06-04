# 🎮 EGSP Gaming Hub - Hướng Dẫn Sử Dụng

## ✨ Các Tính Năng Mới

### 1. **Hệ Thống Đăng Nhập Hiện Đại**
- Giao diện Dark Mode với phong cách Gaming
- Hiệu ứng Glassmorphism hiện đại
- Hỗ trợ đăng nhập bằng Email hoặc Username
- Quick login bằng Google/Facebook (Demo)

### 2. **Tài Khoản Demo**
Bạn có thể sử dụng các tài khoản này để test:

| Email | Username | Password | Level | Balance |
|-------|----------|----------|-------|---------|
| player@egsp.com | gamerpro | password123 | 45 | 250,000₫ |
| warrior@egsp.com | lionkiller | password123 | 52 | 520,000₫ |
| phoenix@egsp.com | phoenixfire | password123 | 38 | 180,000₫ |

### 3. **Giao Diện Gaming Hiện Đại**
- ✅ Dark Theme với gradient nền sâu
- ✅ Hiệu ứng Glow và Neon theo phong cách gaming Western + Vietnam
- ✅ Bootstrap 5.3 được tối ưu
- ✅ Responsive trên tất cả thiết bị
- ✅ Hiệu ứng Hover mượt mà
- ✅ Transition và Animation plausible

### 4. **Tính Năng Người Dùng**
- 👤 Avatar người dùng hiển thị khi đăng nhập
- 💾 Ghi nhớ đăng nhập
- 🔐 Quản lý phiên bản người dùng
- 🚪 Đăng xuất dễ dàng
- 📊 Lịch sử giao dịch (localStorage)

### 5. **Hệ Thống Thanh Toán**
- Chọn mệnh giá nạp thẻ
- Chọn phương thức thanh toán
- Xác nhận thanh toán với loading animation
- Lưu lịch sử giao dịch

---

## 🚀 Cách Sử Dụng

### Bước 1: Truy cập trang đăng nhập
```
Mở login.html
```

### Bước 2: Đăng nhập
Sử dụng một trong các tài khoản demo:
- **Email**: `player@egsp.com` / **Password**: `password123`
- Hoặc **Username**: `gamerpro` / **Password**: `password123`

Hoặc click Quick Login:
- 🔐 **Google**: Tự động điền tài khoản đầu tiên
- 📱 **Facebook**: Tự động điền tài khoản thứ hai

### Bước 3: Sử dụng trang nạp thẻ
1. Chọn trò chơi
2. Chọn mệnh giá
3. Chọn phương thức thanh toán
4. Nhấn "Thanh toán ngay"

### Bước 4: Xem thông tin tài khoản
Click vào **Avatar** ở góc phải header để xem menu:
- ⚙️ Cài đặt
- 💰 Lịch sử nạp thẻ
- 🎁 Quà tặng
- 🚪 Đăng xuất

---

## 🎨 Chi Tiết Thiết Kế

### Màu Sắc Gaming
- **Nền**: Gradient xanh đen sâu (#0a0e1a → #1a0f2e)
- **Accent Chính**: Đỏ EGSP (#c8102e) + Gradient
- **Accent Phụ**: Cyan (#00d9ff)
- **Text**: Off-white (#e8eaed)

### Hiệu Ứng
- Glow tối (Red + Cyan) quanh góc màn hình
- Neon border trên các card
- Smooth transitions (0.3s)
- Hover effects với transform
- Shadow box sâu

### Font
- **Heading**: Rajdhani (Gaming style)
- **Body**: Be Vietnam Pro (Tiếng Việt tối ưu)

---

## 📁 Cấu Trúc File

```
Đồ án/
├── DoAnGame.html          (Trang nạp thẻ)
├── DoAnGame.css          (Styles chính)
├── DoAnGame.js           (Logic game page)
├── login.html            (Trang đăng nhập)
├── Login.css             (Styles đăng nhập)
├── auth.js               (Hệ thống xác thực)
├── register.html         (Trang đăng ký - chưa hoàn thành)
├── history.html          (Lịch sử - chưa hoàn thành)
└── images/
    └── (Các ảnh game)
```

---

## 🔧 Tính Năng Kỹ Thuật

### LocalStorage
- `currentUser`: Thông tin người dùng đăng nhập
- `isLoggedIn`: Trạng thái đăng nhập
- `rememberedEmail`: Email ghi nhớ
- `transactions`: Lịch sử giao dịch

### JavaScript
- `auth.js`: Quản lý đăng nhập
- `DoAnGame.js`: Quản lý giao diện và sự kiện

---

## ✅ Checklist Cải Tiến

- [x] Bootstrap 5.3 được tối ưu
- [x] Background gaming hiện đại (Dark + Glow)
- [x] Hệ thống đăng nhập với dữ liệu
- [x] Giao diện mượt mà (Transitions + Animations)
- [x] Phong cách Gaming (Western + Vietnam)
- [x] User Profile Menu
- [x] Payment System
- [x] Transaction History (LocalStorage)
- [x] Responsive Design
- [x] Error Handling

---

## 📝 Ghi Chú

- Dữ liệu được lưu trong **localStorage** (Browser)
- Không có backend - tất cả xử lý ở frontend
- Password demo không bảo mật (chỉ để test)
- Thanh toán là mô phỏng (không thật)
- Lịch sử giao dịch được lưu trong 50 bản ghi gần nhất

---

## 🎯 Các Cải Tiến Tiếp Theo (Tùy Chọn)

1. Thêm trang **Đăng Ký** (register.html)
2. Thêm trang **Lịch Sử Giao Dịch** (history.html)
3. Kết nối **Backend API** để lưu dữ liệu
4. Thêm **Xác thực 2 lớp** (2FA)
5. Thêm **Tính năng Chat** hỗ trợ
6. Responsive **Mobile App** version

---

**Phiên bản**: 1.0.0  
**Ngày cập nhật**: June 2026  
**Tác giả**: EGSP Gaming Hub Team
