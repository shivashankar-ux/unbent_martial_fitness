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