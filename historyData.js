// ============================================
// EGSP Gaming Hub - Per-Account History Module
// ============================================

const TX_PREFIX = 'txHistory_';

function getTxKey(email) {
    return TX_PREFIX + (email || 'guest');
}

function saveTransaction(tx) {
    const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    const key = getTxKey(user ? user.email : null);
    let list = JSON.parse(localStorage.getItem(key) || '[]');
    tx.id = '#GD' + Date.now().toString().slice(-6);
    list.unshift(tx);
    if (list.length > 100) list = list.slice(0, 100);
    localStorage.setItem(key, JSON.stringify(list));
}

function getTransactionHistory(email) {
    return JSON.parse(localStorage.getItem(getTxKey(email)) || '[]');
}
