// Password gate shared by Assessment and Key Answer pages.
// NOTE: this runs in the browser, so it keeps casual viewers out but is not real security.
function initGate({ password, onUnlock }) {
  const gate = document.getElementById('gate');
  const app = document.getElementById('app');
  const input = gate.querySelector('input');
  const err = gate.querySelector('.err');
  function submit() {
    if (input.value === password) {
      gate.hidden = true; app.hidden = false; onUnlock();
    } else {
      err.textContent = 'Incorrect password. Please try again.';
      gate.classList.remove('shake'); void gate.offsetWidth; gate.classList.add('shake');
      input.select();
    }
  }
  gate.querySelector('button').addEventListener('click', submit);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  input.focus();
}
