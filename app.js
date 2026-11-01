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
// ----- keyboard shortcuts -----
const NEXT_KEYS = [' ', 'ArrowRight', 'ArrowDown', 'PageDown', 'Enter'];
const PREV_KEYS = ['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'];
// number keys jump straight to a topic:  key -> [slide number, label]
const JUMPS = {
  '1': [3, 'Computer Networking'],
  '2': [4, 'Network Categories'],
  '3': [10, 'Network Architecture'],
  '4': [15, 'The OSI Model'],
  '5': [16, 'The Seven Layers'],
  '6': [24, 'Summary of the OSI Layers'] 
};

// small pop-up that names the topic you jumped to
const toast = document.createElement('div');
toast.id = 'toast';
document.body.append(toast);
let toastTimer;
function say(text) {
  toast.textContent = text;
  toast.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('on'), 1400);
}

// shortcut help (press H or ?)
const help = document.createElement('div');
help.id = 'help';
help.innerHTML = '<div class="card"><h3>Keyboard shortcuts</h3><ul class="bul">' +
  '<li><kbd>Space</kbd> <kbd>\u2192</kbd> <kbd>\u2193</kbd> <kbd>Enter</kbd> or click: next</li>' +
  '<li><kbd>\u2190</kbd> <kbd>\u2191</kbd> <kbd>Backspace</kbd> or right-click: back</li>' +
  Object.entries(JUMPS).map(([k, [, t]]) => `<li><kbd>${k}</kbd> ${t}</li>`).join('') +
  '<li><kbd>A</kbd> / <kbd>Home</kbd> first slide &nbsp; <kbd>D</kbd> / <kbd>End</kbd> last slide</li>' +
  '<li><kbd>F</kbd> fullscreen &nbsp; <kbd>H</kbd> this help</li></ul></div>';
document.body.append(help);
const toggleHelp = open => help.classList.toggle('on', open);
help.addEventListener('click', e => { e.stopPropagation(); toggleHelp(false); });
help.addEventListener('contextmenu', e => { e.stopPropagation(); e.preventDefault(); toggleHelp(false); });

document.addEventListener('keydown', e => {
  if (e.target.closest && e.target.closest('#menu')) return;   // keys used inside the menu
  if (e.ctrlKey || e.metaKey || e.altKey) return;              // leave browser shortcuts alone
  const k = e.key;
  if (k === 'Escape') return toggleHelp(false);
  if (help.classList.contains('on') && !['h', 'H', '?'].includes(k)) toggleHelp(false);

  if (NEXT_KEYS.includes(k)) { e.preventDefault(); next(); }
  else if (PREV_KEYS.includes(k)) { e.preventDefault(); prev(); }
  else if (JUMPS[k]) { const [n, label] = JUMPS[k]; show(n - 1); say(`${k}: ${label}`); }
  else if (k === 'a' || k === 'A' || k === 'Home') { show(0); say('First slide'); }
  else if (k === 'd' || k === 'D' || k === 'End') { show(slides.length - 1); say('Last slide'); }
  else if (k === 'f' || k === 'F') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  else if (k === 'h' || k === 'H' || k === '?') toggleHelp();
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
