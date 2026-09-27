const THEME_ICONS = {
  light: 'L',
  dark: 'D',
  system: 'S'
};

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initStickyHeader();
  initMobileMenu();
  initActiveNavLink();
  initFilterBar();
  initLightbox();
  initDynamicYear();
  initScrollReveal();
  initScrollProgressBar();
});

function resolveActualTheme(preference){
  if(preference === 'system'){
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return preference === 'light' ? 'light' : 'dark';
}

function applyThemePreference(preference){
  const actualTheme = resolveActualTheme(preference);
  document.documentElement.setAttribute('data-theme', actualTheme);
  document.documentElement.setAttribute('data-theme-preference', preference);
  localStorage.setItem('site-theme-preference', preference);
  localStorage.setItem('site-theme', actualTheme);
  document.querySelectorAll('.theme-btn-icon').forEach(el => { el.textContent = THEME_ICONS[preference] || THEME_ICONS[actualTheme]; });
  document.querySelectorAll('.theme-dropdown-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-theme-value') === preference);
  });
}

function closeThemeDropdowns(){
  document.querySelectorAll('.theme-dropdown.open').forEach(drop => {
    drop.classList.remove('open');
    const btn = drop.closest('.theme-selector')?.querySelector('.theme-toggle-btn');
    if(btn) btn.setAttribute('aria-expanded','false');
  });
}

function initThemeToggle(){
  const saved = localStorage.getItem('site-theme-preference') || localStorage.getItem('site-theme') || 'dark';
  applyThemePreference(saved);
  if(window.matchMedia){
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
      const pref = localStorage.getItem('site-theme-preference') || 'dark';
      if(pref === 'system') applyThemePreference('system');
    });
  }
  document.querySelectorAll('.theme-selector').forEach(selector => {
    const btn = selector.querySelector('.theme-toggle-btn');
    const dropdown = selector.querySelector('.theme-dropdown');
    if(!btn || !dropdown) return;
    btn.addEventListener('click', event => {
      event.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      closeThemeDropdowns();
      if(!isOpen){
        dropdown.classList.add('open');
        btn.setAttribute('aria-expanded','true');
      }
    });
    dropdown.querySelectorAll('.theme-dropdown-item').forEach(item => {
      item.addEventListener('click', event => {
        event.stopPropagation();
        applyThemePreference(item.getAttribute('data-theme-value'));
        closeThemeDropdowns();
      });
    });
  });
  document.addEventListener('click', closeThemeDropdowns);
  document.addEventListener('keydown', event => {
    if(event.key === 'Escape'){
      closeThemeDropdowns();
      const drawer = document.getElementById('mobile-nav-drawer');
      if(drawer?.classList.contains('active')) closeMobileMenu();
    }
  });
}

function initStickyHeader(){
  const header = document.getElementById('site-header');
  if(!header) return;
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}

function closeMobileMenu(){
  const btn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  if(!btn || !drawer) return;
  btn.setAttribute('aria-expanded','false');
  drawer.setAttribute('aria-hidden','true');
  drawer.classList.remove('active');
  document.body.classList.remove('menu-open');
}

function initMobileMenu(){
  const btn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  if(!btn || !drawer) return;
  const toggle = () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    if(open) closeMobileMenu();
    else{
      btn.setAttribute('aria-expanded','true');
      drawer.setAttribute('aria-hidden','false');
      drawer.classList.add('active');
      document.body.classList.add('menu-open');
    }
  };
  btn.addEventListener('click', toggle);
  drawer.querySelectorAll('a,.mobile-close-btn').forEach(el => {
    el.addEventListener('click', closeMobileMenu);
  });
}

function initActiveNavLink(){
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.desktop-nav .nav-link,.mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if(href === current || (current === '' && href === 'index.html')) link.classList.add('active');
  });
}

function initFilterBar(){
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.archive-card[data-category]');
  if(!buttons.length || !cards.length) return;
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(item => item.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });
}

function initLightbox(){
  const modal = document.getElementById('lightbox-modal');
  if(!modal) return;
  const title = document.getElementById('lightbox-title');
  const caption = document.getElementById('lightbox-caption');
  const close = document.getElementById('lightbox-close');
  const open = trigger => {
    if(title) title.textContent = trigger.dataset.title || 'Project';
    if(caption) caption.textContent = trigger.dataset.desc || 'Project details';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('menu-open');
  };
  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('menu-open');
  };
  modal.querySelector('.lightbox-panel')?.addEventListener('click', event => event.stopPropagation());
  document.querySelectorAll('[data-lightbox]').forEach(trigger => trigger.addEventListener('click', () => open(trigger)));
  close?.addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if(event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if(event.key === 'Escape' && modal.classList.contains('active')) closeModal(); });
}

window.handleContactSubmit = function(form){
  const success = document.getElementById('contact-success-box');
  if(form && success){
    form.style.display = 'none';
    success.style.display = 'block';
  }
};

window.resetContactForm = function(){
  const form = document.getElementById('contact-form');
  const success = document.getElementById('contact-success-box');
  if(form && success){
    form.reset();
    form.style.display = '';
    success.style.display = 'none';
  }
};

function initDynamicYear(){
  const year = new Date().getFullYear().toString();
  document.querySelectorAll('.current-year').forEach(el => el.textContent = year);
}

function initScrollReveal(){
  if(!('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll('[data-reveal],.numbered-services article,.principle-grid article,.quote-card,.overview-grid article,.service-row');
  targets.forEach((el,index) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (index % 4) * 0.05 + 's';
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.08,rootMargin:'0px 0px -45px 0px'});
  targets.forEach(el => observer.observe(el));
}

function initScrollProgressBar(){
  const bar = document.getElementById('scroll-progress-bar');
  if(!bar) return;
  let ticking = false;
  const update = () => {
    const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = Math.max(0, Math.min(100, progress)) + '%';
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if(!ticking){
      window.requestAnimationFrame(update);
      ticking = true;
    }
  },{passive:true});
  window.addEventListener('resize', update,{passive:true});
  update();
}
