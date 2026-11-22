const gallery = document.querySelector('#client-result');
const pairs = [...gallery.querySelectorAll('.comparison-photos')];
const controls = gallery.querySelector('.result-controls');
const position = controls.querySelector('[role="status"]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let active = 0;
let previewed = false;
let inView = false;
let timer;

function showPair(index) {
  pairs[active].hidden = true;
  active = (index + pairs.length) % pairs.length;
  pairs[active].hidden = false;
  position.textContent = `${active + 1} of ${pairs.length}`;
}

function updatePreview() {
  clearTimeout(timer);
  if (!previewed && inView && !document.hidden && !reducedMotion.matches &&
      !gallery.matches(':hover, :focus-within')) {
    timer = setTimeout(() => {
      previewed = true;
      showPair(active + 1);
    }, 4500);
  }
}

controls.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-step]');
  if (!button) return;
  previewed = true;
  showPair(active + Number(button.dataset.step));
  updatePreview();
});

gallery.addEventListener('mouseenter', updatePreview);
gallery.addEventListener('mouseleave', updatePreview);
gallery.addEventListener('focusin', updatePreview);
gallery.addEventListener('focusout', () => requestAnimationFrame(updatePreview));
document.addEventListener('visibilitychange', updatePreview);
reducedMotion.addEventListener('change', updatePreview);
new IntersectionObserver(([entry]) => {
  inView = entry.isIntersecting;
  updatePreview();
}, { threshold: 0.5 }).observe(gallery);

controls.hidden = false;
