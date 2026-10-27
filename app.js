const lenses = [
  {
    key: 'driver',
    heading: 'Who is on duty?',
    copy: 'A supervised feature includes a human driver as part of the safety arrangement. A rider-only trip puts the driving task on the automated system within its service area.',
    tesla: 'Driver watches and can take over',
    waymo: 'System drives without a human driver',
    foot: 'Source: <a class="cite" href="#source-1">[1]</a><a class="cite" href="#source-3">[3]</a><a class="cite" href="#source-4">[4]</a>',
    visual: [['◉', 'HUMAN', 'Supervising'], ['◎', 'SYSTEM', 'Driving']]
  },
  {
    key: 'place',
    heading: 'Where were the miles driven?',
    copy: 'A mile on a quiet highway and a mile on a crowded city street expose a vehicle to different hazards. A useful benchmark follows the places and roads actually driven.',
    tesla: 'Road mix in Tesla fleet data',
    waymo: 'Surface streets in service cities',
    foot: 'Sources: <a class="cite" href="#source-2">[2]</a><a class="cite" href="#source-4">[4]</a>',
    visual: [['⌁', 'ROAD MIX', 'Fleet miles'], ['▦', 'SERVICE AREA', 'City streets']]
  },
  {
    key: 'outcome',
    heading: 'What counts as a crash?',
    copy: 'Tesla’s 7× figure uses its major-and-minor collision definition. Waymo’s 82% figure concerns injury-causing crashes. Different thresholds can change the number before driving performance enters the picture.',
    tesla: 'Telemetry-defined collisions',
    waymo: 'Crashes with reported injury',
    foot: 'Sources: <a class="cite" href="#source-2">[2]</a><a class="cite" href="#source-4">[4]</a>',
    visual: [['◆', 'COLLISION', 'Event threshold'], ['✳', 'INJURY', 'Reported outcome']]
  },
  {
    key: 'baseline',
    heading: 'Compared with whom?',
    copy: 'Tesla compares FSD-engaged driving with manually driven Tesla vehicles. Waymo compares rider-only trips with a local human-driver benchmark. Neither percentage is a direct Tesla-versus-Waymo result.',
    tesla: 'Other Tesla driving modes',
    waymo: 'Local human-driver benchmark',
    foot: 'Sources: <a class="cite" href="#source-2">[2]</a><a class="cite" href="#source-4">[4]</a>',
    visual: [['T', 'TESLA', 'Manual driving'], ['H', 'HUMANS', 'Local benchmark']]
  }
];

const tabs = [...document.querySelectorAll('.lens-tab')];
const panel = document.getElementById('lens-panel');
let activeLens = 0;

function showLens(index, focus = false) {
  activeLens = (index + lenses.length) % lenses.length;
  const item = lenses[activeLens];
  tabs.forEach((tab, i) => {
    tab.classList.toggle('active', i === activeLens);
    tab.setAttribute('aria-selected', String(i === activeLens));
    tab.tabIndex = i === activeLens ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', tabs[activeLens].id);
  document.getElementById('lens-counter').textContent = `LENS 0${activeLens + 1} / 04`;
  document.getElementById('lens-heading').textContent = item.heading;
  document.getElementById('lens-copy').textContent = item.copy;
  document.getElementById('lens-tesla').textContent = item.tesla;
  document.getElementById('lens-waymo').textContent = item.waymo;
  document.getElementById('lens-foot').innerHTML = item.foot;
  document.getElementById('lens-progress-label').textContent = `${activeLens + 1} of 4`;
  document.getElementById('lens-next').innerHTML = activeLens === 3 ? 'Start again <span aria-hidden="true">↺</span>' : 'Next lens <span aria-hidden="true">→</span>';
  document.getElementById('lens-visual').innerHTML = item.visual.map((side, i) => `<div class="visual-side"><b>${side[0]}</b><span><small>${side[1]}</small><strong>${side[2]}</strong></span></div>${i === 0 ? '<span class="visual-divider">≠</span>' : ''}`).join('');
  if (focus) tabs[activeLens].focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => showLens(index));
  tab.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); showLens(index + 1, true); }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); showLens(index - 1, true); }
    if (event.key === 'Home') { event.preventDefault(); showLens(0, true); }
    if (event.key === 'End') { event.preventDefault(); showLens(lenses.length - 1, true); }
  });
});
document.getElementById('lens-next').addEventListener('click', () => showLens(activeLens + 1));
showLens(0);

const answers = [...document.querySelectorAll('[data-answer]')];
const feedback = document.getElementById('test-feedback');
answers.forEach(button => button.addEventListener('click', () => {
  const correct = button.dataset.answer === 'context';
  answers.forEach(option => {
    option.classList.remove('correct', 'incorrect');
    option.setAttribute('aria-pressed', String(option === button));
  });
  button.classList.add(correct ? 'correct' : 'incorrect');
  feedback.hidden = false;
  feedback.textContent = correct
    ? 'Exactly. These claims count different outcomes against different comparison groups. Ask who drove, where, what counted and which miles formed the baseline.'
    : 'Look at the yardsticks: Tesla reports collisions versus manually driven Teslas; Waymo reports injury crashes versus local human drivers. The two figures cannot rank the companies.';
}));

document.getElementById('copy-checklist').addEventListener('click', async () => {
  const checklist = `Five questions for an autonomous-driving safety claim:\n1. Who was responsible for driving?\n2. Where and when were the miles driven?\n3. Which crashes count?\n4. What is the comparison group?\n5. How much exposure is behind the rate?\nSource: The Road Read, Aryan Dandwekar.`;
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(checklist);
    status.textContent = 'Copied to clipboard.';
  } catch {
    status.textContent = 'Select the five questions above to copy them.';
  }
});

const progress = document.getElementById('read-progress');
let ticking = false;
function updateProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${maxScroll > 0 ? Math.min(100, window.scrollY / maxScroll * 100) : 0}%`;
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();
