/* ============================================
   PREMIUM PORTFOLIO — INTERACTIVITY & ANIMATIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Scroll Progress Bar ---
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
  }

  // --- Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Combined scroll handler
  function onScroll() {
    updateScrollProgress();
    updateNavbar();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initialize

  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // --- Intersection Observer: Fade-in Animations ---
  const fadeElements = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  fadeElements.forEach(el => fadeObserver.observe(el));

  // --- Animated Counters ---
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const authoritySection = document.getElementById('authority');
  if (authoritySection) {
    counterObserver.observe(authoritySection);
  }

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(easeOut * target);

        counter.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // --- Hero Card Bar Animations ---
  const heroSection = document.getElementById('hero');
  const barFills = document.querySelectorAll('.card-bar-fill');

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          barFills.forEach(fill => fill.classList.add('animated'));
        }, 800);
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  if (heroSection) {
    heroObserver.observe(heroSection);
  }

  // --- Testimonial Carousel ---
  const testimonialTrack = document.getElementById('testimonialTrack');
  const testimonialNav = document.getElementById('testimonialNav');
  let currentTestimonial = 0;
  const totalTestimonials = 3;

  function goToTestimonial(index) {
    currentTestimonial = index;
    testimonialTrack.style.transform = `translateX(-${index * 100}%)`;

    // Update dots
    testimonialNav.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  testimonialNav.addEventListener('click', (e) => {
    const dot = e.target.closest('.testimonial-dot');
    if (dot) {
      goToTestimonial(parseInt(dot.getAttribute('data-index')));
    }
  });

  // Auto-rotate testimonials
  setInterval(() => {
    goToTestimonial((currentTestimonial + 1) % totalTestimonials);
  }, 6000);

  // --- AI Workflow Diagram Animation ---
  const aiWorkflow = document.getElementById('aiWorkflow');
  let workflowInterval = null;

  const workflowObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startWorkflowAnimation();
        workflowObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  if (aiWorkflow) {
    workflowObserver.observe(aiWorkflow);
  }

  function startWorkflowAnimation() {
    const nodes = aiWorkflow.querySelectorAll('.workflow-node');
    let currentNode = 0;

    function activateNode() {
      nodes.forEach(node => node.classList.remove('active'));

      // Activate current and all previous nodes
      for (let i = 0; i <= currentNode; i++) {
        nodes[i].classList.add('active');
      }

      currentNode = (currentNode + 1) % nodes.length;

      // Reset after full cycle
      if (currentNode === 0) {
        setTimeout(() => {
          nodes.forEach(node => node.classList.remove('active'));
        }, 1500);
      }
    }

    // Initial activation sequence
    activateNode();
    workflowInterval = setInterval(activateNode, 800);

    // Loop the entire animation
    setTimeout(() => {
      clearInterval(workflowInterval);
      // Keep all nodes active
      nodes.forEach(node => node.classList.add('active'));

      // Restart after pause
      setTimeout(() => {
        nodes.forEach(node => node.classList.remove('active'));
        currentNode = 0;
        workflowInterval = setInterval(activateNode, 800);
      }, 3000);
    }, nodes.length * 800 + 500);
  }

  // --- Cursor Glow Effect (Desktop Only) ---
  const cursorGlow = document.getElementById('cursorGlow');

  if (window.matchMedia('(min-width: 769px)').matches && cursorGlow) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorGlow.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('active');
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }

    animateGlow();
  }

  // --- Magnetic Button Effect ---
  const magneticBtns = document.querySelectorAll('.magnetic-btn');

  if (window.matchMedia('(min-width: 769px)').matches) {
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- AI Services Accordion ---
  const aisAccordion = document.getElementById('aiServicesAccordion');
  if (aisAccordion) {
    aisAccordion.addEventListener('click', (e) => {
      const header = e.target.closest('.ais-header');
      if (!header) return;

      const card = header.closest('.ais-card');
      const isOpen = card.classList.contains('open');

      // Close all cards
      aisAccordion.querySelectorAll('.ais-card').forEach(c => {
        c.classList.remove('open');
        c.querySelector('.ais-header').setAttribute('aria-expanded', 'false');
      });

      // Open clicked card if it wasn't already open
      if (!isOpen) {
        card.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  }
});
