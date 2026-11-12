const TAU = Math.PI * 2;
export const COLORS = ['#a78af4', '#f4869a', '#f9c977', '#81c9aa', '#79bfea', '#bd9ee9', '#f3a88d', '#e9bde4', '#a4d5c1', '#e4d17d', '#8cabe7', '#df91af'];
export function normalized(angle) { return ((angle % TAU) + TAU) % TAU; }
// Segment zero begins at 12 o'clock, proceeding clockwise.
export function landingRotation(index, count, current, turns = 6, offset = 0.5) {
  const target = normalized(-((index + offset) * TAU / count));
  return current + turns * TAU + normalized(target - normalized(current));
}
export function indexAtPointer(rotation, count) {
  return Math.floor(normalized(-rotation) / TAU * count) % count;
}
export function drawWheel(canvas, names, rotation = 0) {
  const ctx = canvas.getContext('2d'); const size = canvas.width; const c = size / 2; const radius = c - 12;
  ctx.clearRect(0, 0, size, size); ctx.save(); ctx.translate(c, c); ctx.rotate(rotation);
  const entries = names.length ? names : ['نام‌ها را اضافه کنید']; const angle = TAU / entries.length;
  entries.forEach((name, i) => {
    const start = -Math.PI / 2 + i * angle; const end = start + angle;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, radius, start, end); ctx.closePath(); ctx.fillStyle = names.length ? COLORS[i % COLORS.length] : '#39364e'; ctx.fill();
    ctx.strokeStyle = 'rgba(30, 27, 42, .32)'; ctx.lineWidth = 3; ctx.stroke();
    ctx.save(); ctx.rotate(start + angle / 2); ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillStyle = names.length ? '#252235' : '#c7c2d7'; ctx.font = `600 ${Math.max(20, Math.min(31, 260 / Math.max(entries.length, 1) + 18))}px sans-serif`;
    ctx.direction = 'inherit'; ctx.fillText(name, radius - 32, 0, radius * .57); ctx.restore();
  });
  ctx.restore();
}
