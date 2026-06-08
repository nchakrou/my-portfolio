/* ── Typing animation ── */
const lines = [
  'Full-Stack Developer | Backend Systems',
  'Real-time apps with clear architecture',
  'Go / Next.js / WebSocket',
  'APIs, dashboards, products',
];
let li = 0, ci = 0, del = false;
const tel = document.getElementById('ttext');
function type() {
  const current = lines[li];
  if (!del && ci <= current.length) {
    tel.textContent = current.slice(0, ci++);
    setTimeout(type, 58);
  } else if (!del) {
    setTimeout(() => { del = true; type(); }, 2400);
  } else if (del && ci >= 0) {
    tel.textContent = current.slice(0, ci--);
    setTimeout(type, 24);
  } else {
    del = false; ci = 0; li = (li + 1) % lines.length;
    setTimeout(type, 360);
  }
}
type();

/* ── Scroll reveal ── */
const io = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), i * 80);
      io.unobserve(e.target);
    }
  });
}, { threshold: .06 });
document.querySelectorAll('.rev').forEach(el => io.observe(el));

/* ── Progress bar ── */
const prog = document.getElementById('prog');
function updateProg() {
  const scrolled = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  prog.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
}
window.addEventListener('scroll', updateProg, { passive: true });

/* ── Nav scroll state ── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Canvas particle network ── */
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize, { passive: true });

const NUM = Math.min(60, Math.floor(window.innerWidth / 22));

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - .5) * .38;
    this.vy = (Math.random() - .5) * .38;
    this.r  = Math.random() * 1.6 + .4;
    this.a  = Math.random() * .55 + .1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,0,0,${this.a})`;
    ctx.fill();
  }
}

for (let i = 0; i < NUM; i++) particles.push(new Particle());

const MAX_DIST = 130;

function drawFrame() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < MAX_DIST) {
        const a = (1 - d / MAX_DIST) * .18;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255,0,0,${a})`;
        ctx.lineWidth = .6;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawFrame);
}
drawFrame();

/* ── 3D tilt on pic & profile panel ── */
function addTilt(el, strength) {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - .5;
    const y = (e.clientY - r.top)  / r.height - .5;
    el.style.transform = `perspective(700px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) scale(1.03)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
    el.style.transition = 'transform .55s cubic-bezier(.25,.46,.45,.94)';
    setTimeout(() => el.style.transition = '', 550);
  });
  el.addEventListener('mouseenter', () => {
    el.style.transition = 'transform .15s ease';
  });
}
const picWrap = document.querySelector('.pic-wrap');
const profPanel = document.querySelector('.profile-panel');
if (picWrap)   addTilt(picWrap, 12);
if (profPanel) addTilt(profPanel, 7);

/* ── Magnetic buttons ── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * .22;
    const y = (e.clientY - r.top  - r.height / 2) * .22;
    btn.style.transform = `translate(${x}px, ${y}px) translateY(-3px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform .4s cubic-bezier(.25,.46,.45,.94), box-shadow .3s, background .3s, border-color .3s';
    setTimeout(() => btn.style.transition = '', 400);
  });
  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'transform .12s ease, box-shadow .3s, background .3s, border-color .3s';
  });
});

/* ── Parallax on hero-right ── */
const hRight = document.querySelector('.h-right');
window.addEventListener('scroll', () => {
  if (!hRight) return;
  const y = window.scrollY * .18;
  hRight.style.transform = `translateY(-${y}px)`;
}, { passive: true });

/* ── Glow ripple on c-card click ── */
document.querySelectorAll('.c-card').forEach(card => {
  card.addEventListener('click', e => {
    const ripple = document.createElement('span');
    const r = card.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute;
      left:${e.clientX - r.left}px;
      top:${e.clientY - r.top}px;
      width:4px; height:4px;
      background:rgba(255,0,0,.5);
      border-radius:50%;
      transform:translate(-50%,-50%) scale(0);
      animation:ripple .6s ease forwards;
      pointer-events:none;
    `;
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

/* ── Footer year ── */
const fyear = document.querySelector('.f-r');
if (fyear) fyear.textContent = `Morocco / Full-Stack Developer · ${new Date().getFullYear()}`;
