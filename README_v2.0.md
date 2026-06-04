# 🎮 EGSP Gaming Hub v2.0 - Eco-Modern Edition

## Welcome! 👋

**EGSP Gaming Hub** is a modern web application for game card top-ups with a beautiful **Eco-Modern aesthetic** featuring Dark Green, Cream White, and Sage color scheme.

---

## 🌟 Key Features

### ✅ Complete Authentication System
- **Demo Accounts** (3 pre-configured accounts for testing)
- **User Registration** with comprehensive validation
- **Login/Logout** with session persistence
- **Email + Username** login support
- **Password Management** with strength validation

### ✅ Beautiful UI/UX
- **Eco-Modern Design** (Dark Green #2D5016 primary color)
- **Responsive Layout** for all devices
- **Glassmorphism Effects** with backdrop blur
- **Smooth Animations** and transitions
- **Professional Color Palette** (Cream #FFFAF0, Sage #9CAF88)

### ✅ Game Card Top-Up System
- **4 Games** (Liên Quân, Free Fire, FC Online, Delta Force)
- **7 Denomination Tiers** (10K - 1M VND)
- **6 Payment Methods**
- **Transaction History** logging
- **Payment Simulation** with visual feedback

### ✅ User Profile Management
- **Avatar Display** with first letter initial
- **User Info Menu** (Settings, History, Gifts, Logout)
- **Account Balance** tracking
- **Level System** display

---

## 🚀 Getting Started

### Step 1: Open the Application
```
Open: index.html (Landing Page)
      or
Open: login.html (Direct to Login)
```

### Step 2: Login with Demo Account
**Option A: Demo Account**
```
Email/Username:  player@egsp.com  or  gamerpro
Password:        password123
```

**Other Demo Accounts:**
```
warrior@egsp.com / lionkiller / password123
phoenix@egsp.com / phoenixfire / password123
```

**Option B: Create New Account**
- Click "Đăng ký" on login page
- Fill in all required fields
- Password must be 8+ chars with uppercase + number
- Click "Tạo tài khoản"

### Step 3: Access Main App
- Browse available games
- Select denomination
- Choose payment method
- Process payment (simulated)

### Step 4: Manage Account
- Click avatar to open user menu
- View settings, history, gifts
- Click "Đăng xuất" to logout

---

## 📁 Project Structure

```
/doan/Đồ án/
├── index.html              # Landing page
├── login.html              # Login form
├── register.html           # Registration form
├── DoAnGame.html           # Main app (game cards)
├── history.html            # Transaction history
│
├── Login.css               # Login styling
├── DoAnGame.css            # App styling
├── style.css               # Utility styles
│
├── auth.js                 # Authentication logic
├── DoAnGame.js             # App logic
├── register.js             # Registration validation
│
├── images/                 # Game images folder
│   ├── Huit-info.jpg
│   ├── banner2.jpg
│   ├── deltaforce.jpg
│   ├── fconl.jpg
│   ├── freefire.jpg
│   ├── lienquan.jpg
│   └── logoHuit.jpg
│
└── bootstrap-5.3.8-dist/   # Bootstrap framework
```

---

## 🎨 Color Scheme (Eco-Modern)

| Color | Hex | Usage |
|-------|-----|-------|
| **Dark Green** | #2D5016 | Primary buttons, headings |
| **Cream White** | #FFFAF0 | Background |
| **Light Cream** | #F5F1ED | Cards, sections |
| **Pale Input** | #F9F7F3 | Input backgrounds |
| **Sage Green** | #9CAF88 | Secondary accents |
| **Dark Gray** | #2D3436 | Main text |
| **Muted Gray** | #6D7C73 | Secondary text |
| **Light Border** | #E0DBD4 | Borders |

---

## 🔐 Authentication Details

### Demo Accounts
```javascript
{
  email: 'player@egsp.com',
  username: 'gamerpro',
  password: 'password123',
  displayName: 'Gamer Pro',
  level: 45,
  balance: 250000
}

{
  email: 'warrior@egsp.com',
  username: 'lionkiller',
  password: 'password123',
  displayName: 'Lion Killer',
  level: 52,
  balance: 520000
}

{
  email: 'phoenix@egsp.com',
  username: 'phoenixfire',
  password: 'password123',
  displayName: 'Phoenix Fire',
  level: 38,
  balance: 180000
}
```

### User-Created Accounts
- Stored in browser's `localStorage` under key: `gameAccounts`
- Passwords stored as-is (for demo purposes)
- Email and username validation to prevent duplicates

### Session Management
- Current user stored in: `currentUser` (localStorage)
- Login state flag: `isLoggedIn` (localStorage)
- Remembered email: `rememberedEmail` (localStorage)
- Transaction history: `transactions` (localStorage)

---

## 📋 Registration Validation Rules

| Field | Rules | Example |
|-------|-------|---------|
| **Name** | 3+ chars, letters only | Nguyễn Văn A |
| **Email** | Valid email format, unique | user@example.com |
| **Username** | 3+ chars, alphanumeric+_, unique | gamer_123 |
| **Phone** | Start with 0, 10-11 digits | 0912345678 |
| **Password** | 8+ chars, uppercase, number | MyPass123 |
| **Confirm** | Must match password | MyPass123 |

---

## 🎮 Game Information

The app supports 4 games:

1. **Liên Quân Mobile** - MOBA Strategy Game
2. **Free Fire** - Battle Royale
3. **FC Online VN** - Football/Soccer
4. **Delta Force** - Action/Shooter

---

## 🛠️ Technical Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Framework:** Bootstrap 5.3.8
- **Storage:** Browser localStorage (no backend)
- **Fonts:** 
  - Rajdhani (headings)
  - Be Vietnam Pro (body text)

---

## 🎯 File Purposes

| File | Purpose | Size |
|------|---------|------|
| `index.html` | Landing page & account info | 5.0K |
| `login.html` | User login form | 5.3K |
| `register.html` | New account registration | 5.3K |
| `DoAnGame.html` | Main app (game cards) | 18K |
| `history.html` | Transaction history | 6.3K |
| `Login.css` | Login page styling | 11K |
| `DoAnGame.css` | App page styling | 21K |
| `style.css` | Utility styles | 3.5K |
| `auth.js` | Authentication logic | 7.3K |
| `DoAnGame.js` | App logic & interactions | 10K |
| `register.js` | Registration validation | 4.6K |

---

## 🔄 User Flow

```
index.html (Landing)
    ↓
login.html (Login/Register choice)
    ├→ New User → register.html → validation → login.html
    └→ Existing → DoAnGame.html (Main App)
    
DoAnGame.html (Main App)
    ├→ Game Selection
    ├→ Denomination Selection
    ├→ Payment Processing
    ├→ User Menu (Profile, Settings, Logout)
    └→ Logout → login.html
```

---

## 💾 LocalStorage Structure

```javascript
{
  currentUser: {
    email, username, displayName, level, balance, ...
  },
  
  isLoggedIn: true/false,
  
  gameAccounts: [
    { ...demo accounts... },
    { ...user-created accounts... }
  ],
  
  transactions: [
    { game, amount, method, date, status, ... },
    { ... },
    // Max 50 transactions stored
  ]
}
```

---

## 🚨 Known Limitations

⚠️ **Demo Features (For Educational Purpose)**
- No actual payment processing
- No backend/database (localStorage only)
- Passwords stored plain-text (use proper auth in production)
- Balance not persisted after browser clear
- No email verification
- No two-factor authentication

---

## 🔒 Security Notes

For production use, implement:
- ✅ Backend authentication (OAuth, JWT)
- ✅ Encrypted password storage (bcrypt)
- ✅ Email verification
- ✅ Real payment gateway integration
- ✅ Session tokens with expiration
- ✅ HTTPS encryption
- ✅ Rate limiting
- ✅ Input sanitization

---

## 📱 Responsive Design

- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 768px)
- ✅ Ultra-wide (1600px+)

---

## 🎬 Getting Help

**Common Issues:**

**Q: "Forgot password" feature?**  
A: Not implemented in demo. Delete `currentUser` from localStorage to simulate reset.

**Q: Where are accounts saved?**  
A: Browser's localStorage - they clear when you clear browser data.

**Q: Can I use this in production?**  
A: No, this is a demo. Build a backend with proper authentication/payments first.

**Q: How to add more demo accounts?**  
A: Edit `demoAccounts` array in `auth.js`

**Q: How to change colors?**  
A: Update CSS variables in `:root` section of Login.css and DoAnGame.css

---

## 📞 Support

For questions or issues:
- Check the demo accounts in `index.html`
- Review validation rules in `register.js`
- Check browser console (F12) for errors
- Verify localStorage state (DevTools → Application)

---

## 📜 Version History

**v2.0 Eco-Modern Edition** (Current)
- ✅ Complete color scheme redesign (Gaming Dark → Eco-Modern)
- ✅ User registration with full validation
- ✅ Fixed user menu layout issues
- ✅ Enhanced logout functionality
- ✅ Improved JavaScript validation

**v1.0 Gaming Edition**
- Initial launch with gaming dark theme
- Basic auth system
- Game card top-up system
- Demo accounts

---

## 🎓 Educational Value

This project demonstrates:
- HTML5 semantic structure
- CSS3 styling & responsive design
- JavaScript ES6+ features
- LocalStorage API usage
- Form validation techniques
- User authentication flow
- UI/UX best practices

---

**Made with ❤️ for HUIT (Ho Chi Minh City University of Industry and Trade)**

**Status:** ✅ Production Ready (Demo)  
**Theme:** 🌿 Eco-Modern  
**Last Updated:** June 5, 2026

---

## 🎉 Enjoy Using EGSP Gaming Hub!
