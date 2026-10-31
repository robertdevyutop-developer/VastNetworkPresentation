const slides = [...document.querySelectorAll('.slide')];
const stage = document.getElementById('stage');
const bar = document.getElementById('bar');
const count = document.getElementById('count');
let cur = 0;

// stagger each element's entrance
slides.forEach(s => s.querySelectorAll('.a').forEach((el, i) => el.style.setProperty('--i', i)));

// OSI layer stacks (layer 7 on top, layer 1 at the bottom)
const NAMES = ['Application', 'Presentation', 'Session', 'Transport', 'Network', 'Data Link', 'Physical'];
document.querySelectorAll('.stack').forEach(st => {
  const all = st.dataset.hl === 'all';
  const hl = st.dataset.hl.split(',').map(Number);
  NAMES.forEach((name, i) => {
    const n = 7 - i, d = document.createElement('div');
    d.className = 'layer' + (all || hl.includes(n) ? ' on' : '');
    d.style.cssText = `--h:${185 + i * 22.5};--k:${i}`;
    d.innerHTML = `<b>${n}</b><span>${name}</span>`;
    st.append(d);
  });
  if (st.dataset.packet) { const p = document.createElement('i'); p.className = 'pk2'; st.append(p); }
});

// layer number pills (1 to 7) on each layer slide
document.querySelectorAll('.pills').forEach(p => {
  for (let i = 1; i <= 7; i++) {
    const e = document.createElement('i');
    e.textContent = i;
    e.style.setProperty('--h', 185 + (7 - i) * 22.5);
    if (i === +p.dataset.n) e.className = 'on';
    p.append(e);
  }
});

function show(n) {
  if (n < 0 || n >= slides.length || n === cur) return;
  stage.className = n > cur ? 'fwd' : 'back';
  const old = slides[cur];
  old.classList.remove('active');
  old.classList.add('leaving');
  setTimeout(() => old.classList.remove('leaving'), 650);
  slides[n].classList.add('active');
  cur = n;
  bar.style.width = ((cur + 1) / slides.length * 100) + '%';
  count.textContent = `${cur + 1} / ${slides.length}`;
  history.replaceState(null, '', '#' + (cur + 1));
}
const next = () => show(cur + 1), prev = () => show(cur - 1);

document.addEventListener('click', e => { if (e.button === 0) next(); });
document.addEventListener('contextmenu', e => { e.preventDefault(); prev(); });
document.addEventListener('keydown', e => {
  if ([' ', 'ArrowRight', 'ArrowDown', 'PageDown', 'Enter'].includes(e.key)) { e.preventDefault(); next(); }
  else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prev(); }
  else if (e.key === 'A') show(0);
  else if (e.key === 'D') show(slides.length - 1);
  else if (e.key === 'f' || e.key === 'F') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
});
let tx = null;  // swipe support
document.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
document.addEventListener('touchend', e => {
  if (tx === null) return;
  const dx = e.changedTouches[0].clientX - tx; tx = null;
  if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
});

// start on #n if given
const start = parseInt(location.hash.slice(1), 10);
bar.style.width = (1 / slides.length * 100) + '%';
count.textContent = `1 / ${slides.length}`;
if (start > 1 && start <= slides.length) show(start - 1);
