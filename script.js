/**
 * STUDIO 03 — Contemporary Creative Agency JavaScript Engine
 * Handles theme toggles, mobile drawer, interactive portfolio filters,
 * project modals, live global studio clocks, inquiry forms, and scroll reveal.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStudioTheme();
  initMobileDrawer();
  initActiveNavigation();
  initGlobalStudioClocks();
  initProjectLightbox();
  initPortfolioFilters();
  initInquiryForm();
  initScrollProgressBar();
  initScrollReveal();
  initDynamicYear();
});

/* ==========================================================================
   1. STUDIO THEME ENGINE (DARK, LIGHT, SYSTEM DEFAULT)
   ========================================================================== */
const THEME_ICONS = {
  light: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  dark: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
  system: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`
};

function resolveActualTheme(pref) {
  if (pref === 'system') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return pref === 'light' ? 'light' : 'dark';
}

function applyTheme(preference) {
  const actual = resolveActualTheme(preference);
  document.documentElement.setAttribute('data-theme', actual);
  document.documentElement.setAttribute('data-theme-preference', preference);
  localStorage.setItem('studio03-theme-pref', preference);

  const btnIcon = document.querySelector('.theme-btn-icon');
  if (btnIcon) {
    btnIcon.innerHTML = THEME_ICONS[preference] || THEME_ICONS.dark;
  }

  const items = document.querySelectorAll('.theme-dropdown-item');
  items.forEach(item => {
    if (item.getAttribute('data-theme-value') === preference) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function initStudioTheme() {
  const savedPref = localStorage.getItem('studio03-theme-pref') || 'dark';
  applyTheme(savedPref);

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
      const current = localStorage.getItem('studio03-theme-pref') || 'dark';
      if (current === 'system') {
        applyTheme('system');
      }
    });
  }

  const toggleBtn = document.querySelector('.theme-toggle-btn');
  const dropdown = document.querySelector('.theme-dropdown');

  if (toggleBtn && dropdown) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      dropdown.classList.toggle('open', !isOpen);
      toggleBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    const items = dropdown.querySelectorAll('.theme-dropdown-item');
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const chosen = item.getAttribute('data-theme-value');
        applyTheme(chosen);
        dropdown.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.theme-selector')) {
        dropdown.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdown.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* ==========================================================================
   2. MOBILE FULLSCREEN NAVIGATION DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  if (!menuBtn || !drawer) return;

  const toggle = () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!isExpanded));
    drawer.classList.toggle('active', !isExpanded);
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  };

  menuBtn.addEventListener('click', toggle);

  const links = drawer.querySelectorAll('a');
  links.forEach(l => {
    l.addEventListener('click', () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   3. MULTI-PAGE ACTIVE NAVIGATION HIGHLIGHT
   ========================================================================== */
function initActiveNavigation() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-nav-links .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html') || (currentPath === 'index.html' && (href === 'index.html' || href === '/'))) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   4. LIVE STUDIO CLOCKS (BERLIN, NEW YORK, TOKYO)
   ========================================================================== */
function initGlobalStudioClocks() {
  const updateTimes = () => {
    const clockElements = document.querySelectorAll('[data-studio-city]');
    if (!clockElements.length) return;

    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

    clockElements.forEach(el => {
      const city = el.getAttribute('data-studio-city');
      let tz = 'UTC';
      if (city === 'berlin') tz = 'Europe/Berlin';
      if (city === 'nyc') tz = 'America/New_York';
      if (city === 'tokyo') tz = 'Asia/Tokyo';

      try {
        const timeStr = new Intl.DateTimeFormat('en-GB', { ...options, timeZone: tz }).format(new Date());
        el.textContent = `${timeStr} (${city.toUpperCase()})`;
      } catch {
        el.textContent = city.toUpperCase();
      }
    });
  };

  updateTimes();
  setInterval(updateTimes, 1000);
}

/* ==========================================================================
   5. PROJECT LIGHTBOX / CASE MODAL
   ========================================================================== */
function initProjectLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalTitle = document.getElementById('lightbox-title');
  const modalDesc = document.getElementById('lightbox-desc');
  const modalMeta = document.getElementById('lightbox-meta');
  const modalImage = document.getElementById('lightbox-image');
  const closeBtn = document.getElementById('lightbox-close');

  if (!modal) return;

  const triggers = document.querySelectorAll('[data-project-trigger]');

  const openModal = (title, desc, meta, img) => {
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalMeta) modalMeta.textContent = meta;
    if (modalImage && img) modalImage.src = img;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  triggers.forEach(t => {
    t.addEventListener('click', () => {
      const title = t.getAttribute('data-title') || 'Featured Exhibition';
      const desc = t.getAttribute('data-desc') || 'Full comprehensive project case study and design documentation.';
      const meta = t.getAttribute('data-meta') || 'STUDIO 03 ARCHIVE';
      const img = t.getAttribute('data-img') || '';
      openModal(title, desc, meta, img);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* ==========================================================================
   6. PORTFOLIO CATEGORY FILTERS (SHOWCASE PAGE)
   ========================================================================== */
function initPortfolioFilters() {
  const buttons = document.querySelectorAll('.portfolio-filter-btn');
  const cards = document.querySelectorAll('.portfolio-card[data-category]');

  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. INQUIRY FORM & CHIP TOGGLES (CONTACT PAGE)
   ========================================================================== */
function initInquiryForm() {
  const chips = document.querySelectorAll('.scope-chip-btn');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
    });
  });

  const form = document.getElementById('studio-inquiry-form');
  const successBox = document.getElementById('inquiry-success-box');

  if (form && successBox) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.style.display = 'none';
      successBox.style.display = 'block';
    });
  }
}

window.resetInquiryForm = function() {
  const form = document.getElementById('studio-inquiry-form');
  const successBox = document.getElementById('inquiry-success-box');
  if (form && successBox) {
    form.reset();
    form.style.display = 'block';
    successBox.style.display = 'none';
  }
};

/* ==========================================================================
   8. SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgressBar() {
  const bar = document.querySelector('.scroll-progress-bar');
  if (!bar) return;

  let ticking = false;

  const update = () => {
    const top = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = height > 0 ? (top / height) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}

/* ==========================================================================
   9. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  if (typeof IntersectionObserver === 'undefined') return;

  const targets = document.querySelectorAll(
    '.section-header-editorial, .hero-statement-wrap, .hero-split-grid, .project-stream-item, .capability-row-item, .process-step-card, .portfolio-card, .editorial-quote-frame, .office-card, .leadership-card'
  );

  targets.forEach(el => {
    el.classList.add('reveal');
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ==========================================================================
   10. DYNAMIC COPYRIGHT YEAR
   ========================================================================== */
function initDynamicYear() {
  const yearEls = document.querySelectorAll('.current-year');
  const yearStr = new Date().getFullYear().toString();
  yearEls.forEach(el => {
    el.textContent = yearStr;
  });
}
