function goTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    // Desktop nav
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    const navLink = document.getElementById('nav-' + page);
    if (navLink) navLink.classList.add('active');
    // Mobile nav
    document.querySelectorAll('.mobile-nav a').forEach(a => a.classList.remove('active'));
    const mNavLink = document.getElementById('mnav-' + page);
    if (mNavLink) mNavLink.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleMenu() {
    const nav = document.getElementById('mobile-nav');
    const btn = document.getElementById('hamburger');
    nav.classList.toggle('open');
    btn.classList.toggle('open');
  }

  function closeMenu() {
    document.getElementById('mobile-nav').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  }

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    const nav = document.getElementById('mobile-nav');
    const btn = document.getElementById('hamburger');
    if (!nav.contains(e.target) && !btn.contains(e.target)) {
      nav.classList.remove('open');
      btn.classList.remove('open');
    }
  });

  function submitForm() {
    const name = document.getElementById('f-name').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    const program = document.getElementById('f-program').value;

    if (!name || !phone || !program) {
      alert('Please fill in your name, phone number, and select a program.');
      return;
    }

    document.getElementById('enrollment-form').style.display = 'none';
    document.getElementById('form-success').style.display = 'block';

    const msg = encodeURIComponent(
      `Hi! I'd like to enroll at UMF Academy.\n\nName: ${name}\nPhone: ${phone}\nProgram: ${program}\nBatch: ${document.getElementById('f-batch').value || 'Not specified'}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/919908455835?text=${msg}`, '_blank');
    }, 800);
  }
  // SERVICE CARDS — PARALLAX (tilt + scroll reveal + depth)
(function() {
  // 1️⃣ SCROLL REVEAL
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (entry.target.dataset.index || 0) * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.service-card').forEach((card, i) => {
    card.dataset.index = i;
    revealObserver.observe(card);
  });

  // 2️⃣ MOUSE TILT + DEPTH PARALLAX
  document.querySelectorAll('.service-card').forEach(card => {
    const icon = card.querySelector('.service-icon');
    const num  = card.querySelector('.service-num');

    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);

      const tiltX = dy * -6;
      const tiltY = dx *  6;
      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;

      if (icon) icon.style.transform = `translate(${dx * -8}px, ${dy * -8}px) scale(1.08)`;
      if (num)  num.style.transform  = `translate(${dx * 5}px, ${dy * 5}px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
      if (icon) icon.style.transform = 'translate(0,0) scale(1)';
      if (num)  num.style.transform  = 'translate(0,0)';
    });
  });

  // 3️⃣ SCROLL PARALLAX
  const parallaxCards = document.querySelectorAll('.service-card');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxCards.forEach((card, i) => {
      const rect   = card.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView && !card.matches(':hover')) {
        const speed  = (i % 2 === 0) ? 0.025 : 0.018;
        const offset = (rect.top - window.innerHeight / 2) * speed;
        card.style.transform = `perspective(900px) translateY(${offset}px)`;
      }
    });
  }, { passive: true });
})();

// ═══ INSTAGRAM CAROUSEL ═══
(function() {
  const track  = document.getElementById('instaTrack');
  const dotsEl = document.getElementById('instaDots');
  if (!track) return;

  const cards = track.querySelectorAll('.insta-card');
  let visibleCount = window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;
  let current  = 0;
  const total  = cards.length;
  const maxIndex = () => total - visibleCount;

  function buildDots() {
    dotsEl.innerHTML = '';
    for (let i = 0; i <= maxIndex(); i++) {
      const dot = document.createElement('button');
      dot.className = 'insta-dot' + (i === 0 ? ' active' : '');
      dot.onclick = () => goToSlide(i);
      dotsEl.appendChild(dot);
    }
  }

  function goToSlide(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const cardWidth = cards[0].offsetWidth + 16;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    dotsEl.querySelectorAll('.insta-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  window.instaSlide = function(dir) { goToSlide(current + dir); };

  buildDots();

  // Auto-play every 4 seconds
  setInterval(() => {
    goToSlide(current >= maxIndex() ? 0 : current + 1);
  }, 4000);

  // Recalculate on resize
  window.addEventListener('resize', () => {
    visibleCount = window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;
    buildDots();
    goToSlide(0);
  });
})();