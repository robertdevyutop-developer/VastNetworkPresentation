// Top-right menu (three-line button). Loaded on EVERY page.
(function () {
  const items = [
    ['index.html', 'Vast Network: Key Concept'],
    ['energizer.html', 'Energizer'],
    ['assessment.html', 'Assessment'],
    ['key.html', 'Key Answer']
  ];
  const here = location.pathname.split('/').pop() || 'index.html';
  const nav = document.createElement('nav');
  nav.id = 'menu';
  nav.innerHTML =
    '<button id="menuBtn" aria-label="Menu" aria-expanded="false"><i></i><i></i><i></i></button>' +
    '<div id="menuPanel">' +
    items.map(([h, t]) => `<a href="${h}"${h === here ? ' class="cur"' : ''}>${t}</a>`).join('') +
    '</div>';
  document.body.append(nav);

  const btn = nav.querySelector('#menuBtn');
  const set = open => { nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); };

  // clicks inside the menu must not move the presentation
  nav.addEventListener('click', e => e.stopPropagation());
  nav.addEventListener('contextmenu', e => e.stopPropagation());
  btn.addEventListener('click', () => set(!nav.classList.contains('open')));

  // a click outside only closes the menu (capture phase, so slides don't advance)
  document.addEventListener('click', e => {
    if (nav.classList.contains('open') && !nav.contains(e.target)) { set(false); e.stopPropagation(); }
  }, true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
})();
