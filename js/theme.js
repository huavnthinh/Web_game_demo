// ============================================
// EGSP Gaming Hub - Dark Mode dùng chung
// Nhúng file này vào MỌI trang. Lưu lựa chọn trong localStorage.
// ============================================
(function () {
    // 1. Áp dụng theme đã lưu NGAY khi script chạy (giảm hiện tượng nháy màu)
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    function isDark() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    function refreshButton(btn) {
        const dark = isDark();
        btn.textContent = dark ? '☀️' : '🌙';
        btn.title = dark ? 'Chuyển giao diện sáng' : 'Chuyển giao diện tối';
    }

    document.addEventListener('DOMContentLoaded', function () {
        // 2. Nhúng style cho nút (đi kèm để chạy trên mọi trang, không phụ thuộc CSS nào)
        const style = document.createElement('style');
        style.textContent = `
        .theme-toggle-btn{
            position:fixed; right:18px; bottom:18px;
            width:48px; height:48px; border-radius:50%;
            border:1px solid rgba(99,102,241,.45);
            background:#4f46e5; color:#fff; font-size:20px; line-height:1;
            cursor:pointer; z-index:4000;
            box-shadow:0 6px 18px rgba(79,70,229,.4);
            display:flex; align-items:center; justify-content:center;
            transition:transform .25s ease, box-shadow .25s ease;
        }
        .theme-toggle-btn:hover{
            transform:translateY(-3px) scale(1.06);
            box-shadow:0 10px 24px rgba(79,70,229,.55);
        }
        [data-theme="dark"] .theme-toggle-btn{ background:#6366f1; }
        `;
        document.head.appendChild(style);

        // 3. Tạo nút và gắn sự kiện
        const btn = document.createElement('button');
        btn.className = 'theme-toggle-btn';
        btn.setAttribute('aria-label', 'Chuyển chế độ sáng / tối');
        refreshButton(btn);

        btn.addEventListener('click', function () {
            if (isDark()) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
            refreshButton(btn);
        });

        document.body.appendChild(btn);
    });
})();
