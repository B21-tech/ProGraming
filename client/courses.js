//Active nav + theme persistence
  // highlight current nav item
    (function setActive(){
      const path = (location.pathname.split('/').pop() || 'courses.html').toLowerCase();
      document.querySelectorAll('.nav a').forEach(a => {
        const href = (a.getAttribute('href')||'').toLowerCase();
        if (href === path) a.classList.add('active');
      });
    })();
    // keep user’s theme choice
    (function themePersist(){
      const saved = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', saved);
    })();
