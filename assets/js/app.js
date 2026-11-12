import { selectWinner, randomInt } from './selection.js';
import { parseBulk } from './participants.js';
import { drawWheel, landingRotation } from './wheel.js';
import { loadHistory, saveHistory } from './history.js';

const $ = id => document.getElementById(id);
const defaultNames = ['آراد', 'نگار', 'پارسا', 'سارا', 'امیر', 'رها', 'محمد', 'مریم', 'علی', 'زهرا', 'رضا', 'نرگس'];
const STORAGE = 'luckydraw-participants-v1';
function loadNames() { try { const saved = localStorage.getItem(STORAGE); if (saved !== null) { const parsed = JSON.parse(saved); if (Array.isArray(parsed) && parsed.every(x => typeof x === 'string' && x.length)) return parsed; } } catch {} return [...defaultNames]; }
let names = loadNames(), history = loadHistory(), rotation = 0, spinning = false, muted = false, audio;
function persist() { try { localStorage.setItem(STORAGE, JSON.stringify(names)); } catch {} }
function sound(type) { if (muted) return; try { audio ||= new (window.AudioContext || window.webkitAudioContext)(); const oscillator = audio.createOscillator(), gain = audio.createGain(); oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(type === 'win' ? 660 : 440, audio.currentTime); if (type === 'win') oscillator.frequency.exponentialRampToValueAtTime(990, audio.currentTime + .25); gain.gain.setValueAtTime(.07, audio.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .35); oscillator.connect(gain).connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + .35); } catch {} }
function render() {
  $('count').textContent = names.length.toLocaleString('fa-IR'); $('footer-count').textContent = `${names.length.toLocaleString('fa-IR')} شرکت‌کننده`;
  $('participant-list').replaceChildren(); $('empty-list').hidden = names.length > 0;
  names.forEach((name, index) => {
    const li = document.createElement('li'); li.className = 'participant';
    const dot = document.createElement('span'); dot.className = 'participant-dot'; dot.style.background = ['#b297f2','#f590a3','#efc476','#83c6aa','#80bcea','#c4a0e8','#f3a58b','#e5b3dc','#a7d1bd','#e2cb7b','#92ace0','#df94b0'][index % 12];
    const label = document.createElement('span'); label.className = 'participant-name'; label.dir = 'auto'; label.textContent = name; label.title = name;
    
    const edit = document.createElement('button'); edit.className = 'row-action'; edit.type = 'button'; edit.textContent = '✎'; edit.setAttribute('aria-label', `ویرایش شرکت‌کننده ${index + 1}`); edit.disabled = spinning;
    edit.onclick = () => { const input = document.createElement('input'); input.className = 'edit-input'; input.value = name; input.setAttribute('aria-label', 'ویرایش نام شرکت‌کننده'); label.replaceWith(input); input.focus(); input.setSelectionRange(input.value.length, input.value.length); let finished = false; const finish = (save) => { if (finished) return; finished = true; if (save && input.value.length) { names[index] = input.value; persist(); } render(); }; input.onkeydown = e => { if (e.key === 'Enter') finish(true); if (e.key === 'Escape') finish(false); }; input.onblur = () => finish(true); };
    const remove = document.createElement('button'); remove.className = 'row-action remove'; remove.type = 'button'; remove.textContent = '×'; remove.setAttribute('aria-label', `حذف شرکت‌کننده ${index + 1}`); remove.disabled = spinning; remove.onclick = () => { names.splice(index, 1); persist(); render(); };
    li.append(dot, label, edit, remove); $('participant-list').append(li);
  });
  drawWheel($('wheel'), names, rotation); $('spin').disabled = spinning; $('name-input').disabled = spinning; $('add-form').querySelector('button').disabled = spinning; $('bulk-add').disabled = spinning; $('bulk-input').disabled = spinning; $('clear').disabled = spinning; $('reset').disabled = spinning;
  renderHistory();
}
function renderHistory() { $('history-list').replaceChildren(); $('history-empty').hidden = history.length > 0; history.forEach((name, i) => { const row = document.createElement('div'); row.className = 'history-row'; const medal = document.createElement('span'); medal.className = 'history-medal'; medal.textContent = '✦'; const details = document.createElement('div'); const title = document.createElement('strong'); title.dir = 'auto'; title.textContent = name; const sub = document.createElement('small'); sub.textContent = i === 0 ? 'آخرین برنده' : `قرعه‌کشی ${history.length - i}`; details.append(title, sub); row.append(medal, details); $('history-list').append(row); }); }
$('add-form').onsubmit = e => { e.preventDefault(); const input = $('name-input'); if (!input.value.length) return; names.push(input.value); input.value = ''; persist(); render(); };
$('bulk-toggle').onclick = () => { $('bulk-panel').hidden = !$('bulk-panel').hidden; $('bulk-toggle').setAttribute('aria-expanded', String(!$('bulk-panel').hidden)); };
$('bulk-add').onclick = () => { names.push(...parseBulk($('bulk-input').value)); $('bulk-input').value = ''; persist(); render(); };
$('clear').onclick = () => { names = []; persist(); render(); };
$('reset').onclick = () => { rotation = 0; $('message').textContent = ''; drawWheel($('wheel'), names, rotation); };
$('sound-toggle').onclick = () => { muted = !muted; $('sound-toggle').textContent = muted ? '♪̸' : '♫'; $('sound-toggle').setAttribute('aria-label', muted ? 'روشن کردن صدا' : 'قطع صدا'); $('sound-toggle').title = muted ? 'روشن کردن صدا' : 'قطع صدا'; };
$('spin').onclick = () => {
  if (spinning) return;
  if (!names.length) { $('message').textContent = 'برای چرخاندن گردونه، حداقل یک شرکت‌کننده اضافه کنید.'; return; }
  const winner = selectWinner(names);
  if (winner === null) { $('message').textContent = 'امکان انجام قرعه‌کشی وجود ندارد. لطفاً فهرست نام‌ها را بررسی کنید.'; return; }
  $('message').textContent = ''; spinning = true; render(); sound('spin');
  const start = rotation, end = landingRotation(winner, names.length, rotation, 6 + randomInt(3), .25 + randomInt(5000) / 10000); const duration = 4000 + randomInt(4001); let startTime;
  function animate(time) { if (startTime === undefined) startTime = time; const progress = Math.min((time - startTime) / duration, 1); const ease = 1 - Math.pow(1 - progress, 4); rotation = start + (end - start) * ease; drawWheel($('wheel'), names, rotation); if (progress < 1) requestAnimationFrame(animate); else { rotation = end; spinning = false; const name = names[winner]; history.unshift(name); history = history.slice(0, 10); saveHistory(history); render(); $('winner-name').textContent = name; $('winner-modal').hidden = false; $('close-modal').focus(); sound('win'); confetti(); } }
  requestAnimationFrame(animate);
};
function closeModal() { $('winner-modal').hidden = true; $('spin').focus(); }
$('close-modal').onclick = closeModal; $('celebrate-close').onclick = closeModal; $('winner-modal').onclick = e => { if (e.target === $('winner-modal')) closeModal(); }; document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('winner-modal').hidden) closeModal(); });
function confetti() { const canvas = $('confetti'), ctx = canvas.getContext('2d'); canvas.width = innerWidth; canvas.height = innerHeight; const pieces = Array.from({length: 100}, () => ({x: Math.random()*canvas.width, y: -Math.random()*canvas.height, speed: 2+Math.random()*4, size: 4+Math.random()*7, color: ['#c1a0ff','#f49cac','#ffcf80','#91d7bc'][randomInt(4)], angle: Math.random()*6})); let frames = 0; function frame() { if ($('winner-modal').hidden || frames++ > 240) { ctx.clearRect(0,0,canvas.width,canvas.height); return; } ctx.clearRect(0,0,canvas.width,canvas.height); pieces.forEach(p => { p.y += p.speed; p.x += Math.sin(p.y/40); p.angle += .04; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.angle); ctx.fillStyle=p.color; ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.55); ctx.restore(); }); requestAnimationFrame(frame); } requestAnimationFrame(frame); }
render();
