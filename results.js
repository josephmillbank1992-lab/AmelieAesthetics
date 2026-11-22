const gallery = document.querySelector('#client-result');
const pairs = [...gallery.querySelectorAll('.comparison-photos')];
const controls = gallery.querySelector('.result-controls');
const rotation = controls.querySelector('[data-rotation]');
const status = gallery.querySelector('[role="status"]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let active = 0;
let playing = !reducedMotion.matches;
let inView = false;
let timer;

function showPair(index, announce = false) {
  pairs[active].hidden = true;
  active = (index + pairs.length) % pairs.length;
  pairs[active].hidden = false;
  if (announce) status.textContent = `Comparison ${active + 1} of ${pairs.length}`;
}

function updateRotation() {
  clearInterval(timer);
  rotation.textContent = playing ? 'Pause' : 'Play';
  if (playing && inView && !document.hidden &&
      !gallery.matches(':hover, :focus-within')) {
    timer = setInterval(() => showPair(active + 1), 8000);
  }
}

controls.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button === rotation) {
    playing = !playing;
  } else {
    playing = false;
    showPair(active + Number(button.dataset.step), true);
  }
  updateRotation();
});

gallery.addEventListener('mouseenter', updateRotation);
gallery.addEventListener('mouseleave', updateRotation);
gallery.addEventListener('focusin', updateRotation);
gallery.addEventListener('focusout', () => requestAnimationFrame(updateRotation));
document.addEventListener('visibilitychange', updateRotation);
reducedMotion.addEventListener('change', (event) => {
  if (event.matches) playing = false;
  updateRotation();
});
new IntersectionObserver(([entry]) => {
  inView = entry.isIntersecting;
  updateRotation();
}, { threshold: 0.5 }).observe(gallery);

controls.hidden = false;
updateRotation();
