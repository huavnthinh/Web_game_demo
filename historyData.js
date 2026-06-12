// ============================================
// EGSP Gaming Hub - Lịch Sử Giao Dịch Theo Tài Khoản
// ============================================

const STORAGE_PREFIX = 'txHistory_';
const MAX_HISTORY_ITEMS = 100;

/**
 * Tạo key lưu trữ cho localStorage dựa trên email người dùng.
 * @param {string|null} email 
 * @returns {string}
 */
function getStorageKey(email) {
    const userIdentifier = email || 'guest';
    return `${STORAGE_PREFIX}${userIdentifier}`;
}

/**
 * Lưu một giao dịch mới vào lịch sử của người dùng hiện tại.
 * @param {Object} transaction 
 */
function saveTransaction(transaction) {
    // 1. Xác định người dùng hiện tại
    const currentUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    const userEmail = currentUser ? currentUser.email : null;
    const storageKey = getStorageKey(userEmail);

    // 2. Lấy danh sách lịch sử cũ từ localStorage
    const historyData = localStorage.getItem(storageKey);
    let transactionList = historyData ? JSON.parse(historyData) : [];

    // 3. Tạo mã ID ngẫu nhiên cho giao dịch (Ví dụ: #GD458291)
    const uniqueId = Date.now().toString().slice(-6);
    transaction.id = `#GD${uniqueId}`;

    // 4. Thêm giao dịch mới vào đầu danh sách
    transactionList.unshift(transaction);

    // 5. Giới hạn số lượng lưu trữ tối đa (100 mục) để tránh tràn bộ nhớ
    if (transactionList.length > MAX_HISTORY_ITEMS) {
        transactionList = transactionList.slice(0, MAX_HISTORY_ITEMS);
    }

    // 6. Cập nhật lại vào localStorage
    localStorage.setItem(storageKey, JSON.stringify(transactionList));
}

/**
 * Lấy danh sách lịch sử giao dịch dựa theo email.
 * @param {string} email 
 * @returns {Array} Lịch sử giao dịch
 */
function getTransactionHistory(email) {
    const storageKey = getStorageKey(email);
    const historyData = localStorage.getItem(storageKey);
    
    return historyData ? JSON.parse(historyData) : [];
}