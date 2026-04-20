/* ── Inject grid cross symbols ── */
(function buildGrid() {
  const size = 60;
  const cols = Math.ceil(window.innerWidth / size) + 1;
  const rows = Math.ceil(window.innerHeight / size) + 1;
  const frag = document.createDocumentFragment();
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const el = document.createElement('div');
      el.className = 'grid-cross';
      el.textContent = '+';
      el.style.left = (c * size) + 'px';
      el.style.top = (r * size) + 'px';
      frag.appendChild(el);
    }
  }
  document.body.appendChild(frag);
})();

/* ── Cursor glow tracking ── */
const cursorGlow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

/* ── Theme toggle ── */
const themeBtn = document.getElementById('themeToggle');
themeBtn && themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
}

/* ── Reveal on scroll ── */
const reveals = document.querySelectorAll('.reveal-up');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
reveals.forEach(el => revealObs.observe(el));

/* ── Active nav highlight & scroll style ── */
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  navbar.style.borderBottomColor = window.scrollY > 40 ? 'rgba(255,255,255,0.1)' : '';
});

/* ── Number counters (triggered when stats row enters viewport) ── */
function countUp(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const isFloat = String(target).includes('.');
  const duration = 1400;
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = ease * target;
    el.textContent = isFloat ? val.toFixed(1) + suffix : Math.floor(val) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsEl = document.querySelector('.hero-stats');
if (statsEl) {
  let counted = false;
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      statsEl.querySelectorAll('.hstat-n').forEach(countUp);
    }
  }, { threshold: 0.5 }).observe(statsEl);
}

/* ── 3D mouse tilt on cards ── */
function addTilt(selector, intensity = 8) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `
        perspective(900px)
        rotateY(${x * intensity}deg)
        rotateX(${-y * intensity}deg)
        translateY(-6px) scale(1.01)
      `;
      card.style.transition = 'transform .1s ease, box-shadow .1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .6s cubic-bezier(.23,1,.32,1), box-shadow .4s ease';
    });
  });
}
addTilt('.proj-card', 6);
addTilt('.contact-card', 8);
addTilt('.cert-card', 5);
addTilt('.cert-img-card', 6);

/* ── 3D white about cards reset on hover ── */
document.querySelectorAll('.card-3d').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-10px) scale(1.02)`;
    card.style.transition = 'transform .1s ease';
    card.style.boxShadow = `
      ${-x * 20}px ${-y * 20}px 40px rgba(0,0,0,0.2),
      0 20px 60px rgba(0,0,0,0.25)
    `;
  });
  card.addEventListener('mouseleave', () => {
    // Restore original tilt class style
    if (card.classList.contains('card-tilt-left'))
      card.style.transform = 'perspective(1000px) rotateY(6deg) rotateX(-2deg)';
    else if (card.classList.contains('card-tilt-center'))
      card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(-3deg) translateY(-12px)';
    else
      card.style.transform = 'perspective(1000px) rotateY(-6deg) rotateX(-2deg)';
    card.style.transition = 'transform .6s cubic-bezier(.23,1,.32,1), box-shadow .4s';
    card.style.boxShadow = '';
  });
});

/* ── Service card 3D tilt ── */
document.querySelectorAll('.service-card-3d').forEach(card => {
  const parent = card.closest('.service-item');
  parent && parent.addEventListener('mouseenter', () => {
    card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) scale(1.06)';
    card.style.transition = 'transform .4s cubic-bezier(.23,1,.32,1)';
  });
  parent && parent.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateY(-8deg) rotateX(4deg)';
    card.style.transition = 'transform .6s cubic-bezier(.23,1,.32,1)';
  });
});

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── Certificate Lightbox ── */
const lightbox = document.getElementById('certLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

if (lightbox && lightboxImg && lightboxClose) {
  document.querySelectorAll('.cert-img-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.cert-img-actual');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close when clicking the close button
  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Close when clicking empty space outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}
