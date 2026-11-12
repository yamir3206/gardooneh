const KEY = 'luckydraw-history-v1';
export function loadHistory() { try { const data = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(data) ? data.filter(x => typeof x === 'string').slice(0, 10) : []; } catch { return []; } }
export function saveHistory(history) { try { localStorage.setItem(KEY, JSON.stringify(history.slice(0, 10))); } catch { /* Storage is optional. */ } }
