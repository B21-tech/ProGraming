 document.addEventListener("DOMContentLoaded", function () {
        // Course interaction functionality
        const courseButtons = document.querySelectorAll(".cta, .btn");

        courseButtons.forEach((button) => {
          button.addEventListener("click", function (e) {
            e.preventDefault();
            const card = this.closest(".card, .course-hero");
            let courseName = "";

            if (card.classList.contains("course-hero")) {
              courseName = card.querySelector(".hero-title").textContent;
            } else {
              courseName = card.querySelector(".title").textContent;
            }

            // Show loading state
            const originalText = this.textContent;
            this.textContent = "Loading...";
            this.disabled = true;

            // Simulate course loading
            setTimeout(() => {
              alert(`Starting ${courseName} course!`);
              this.textContent = originalText;
              this.disabled = false;

              // Update streak if it's a new day
              updateStreak();
            }, 1000);
          });
        });

        // Streak management
        function updateStreak() {
          const today = new Date().toDateString();
          const lastVisit = localStorage.getItem("lastVisit");

          if (lastVisit !== today) {
            let currentStreak = parseInt(
              localStorage.getItem("currentStreak") || "5"
            );
            currentStreak++;

            localStorage.setItem("currentStreak", currentStreak);
            localStorage.setItem("lastVisit", today);

            // Update streak display
            document.getElementById("streak-count").textContent = currentStreak;
            document.getElementById("streak-display").textContent =
              currentStreak;

            // Add celebration for new streaks
            if (currentStreak % 5 === 0) {
              showStreakCelebration(currentStreak);
            }
          }
        }

        // Streak celebration
        function showStreakCelebration(streak) {
          const celebration = document.createElement("div");
          celebration.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0,0,0,0.3);
          z-index: 1000;
          text-align: center;
        `;
          celebration.innerHTML = `
          <h3>🎉 Amazing! 🎉</h3>
          <p>You've reached a ${streak}-day streak!</p>
          <button onclick="this.parentElement.remove()" class="btn btn-primary">Continue</button>
        `;
          document.body.appendChild(celebration);
        }

        // Progress bar animation
        function animateProgressBars() {
          const progressBars = document.querySelectorAll(".fill");
          progressBars.forEach((bar) => {
            const width = bar.style.width;
            bar.style.width = "0%";
            setTimeout(() => {
              bar.style.transition = "width 1s ease-in-out";
              bar.style.width = width;
            }, 100);
          });
        }

        // Initialize progress bar animation

        /* Navigation active state
        const navLinks = document.querySelectorAll(".nav a");
        navLinks.forEach((link) => {
          link.addEventListener("click", function (e) {
            e.preventDefault();
            navLinks.forEach((l) => l.classList.remove("active"));
            this.classList.add("active");
          });
        });*/

    // Force navigation for any link that points to career.html
        document.querySelectorAll('a[href$="career.html"]').forEach(a => {
         a.addEventListener('click', function (e) {
      // If some other script tried to prevent it, override:
      e.preventDefault();
      window.location.href = this.getAttribute('href');
    });
  });
        // Profile dropdown simulation
        const profile = document.querySelector(".profile");
        profile.addEventListener("click", function () {
          alert("Profile options would appear here");
        });

        // Course card hover effects
        const cards = document.querySelectorAll(".card");
        cards.forEach((card) => {
          card.addEventListener("mouseenter", function () {
            this.style.transform = "translateY(-5px)";
            this.style.transition = "transform 0.2s ease";
          });

          card.addEventListener("mouseleave", function () {
            this.style.transform = "translateY(0)";
          });
        });

        // Dot menu functionality
        const dotMenu = document.querySelector(".dot-menu");
        const dropdownContent = document.querySelector(".dropdown-content");

        if (dotMenu) {
          dotMenu.addEventListener("click", function (e) {
            e.stopPropagation();
            dropdownContent.classList.toggle("show");
          });

          // Close dropdown when clicking elsewhere
          document.addEventListener("click", function () {
            dropdownContent.classList.remove("show");
          });
        }

        // Vertical dots menu functionality
        const verticalDots = document.querySelector(".vertical-dots");
        const verticalDropdownContent = document.querySelector(
          ".vertical-dropdown-content"
        );

        if (verticalDots) {
          verticalDots.addEventListener("click", function (e) {
            e.stopPropagation();
            verticalDropdownContent.classList.toggle("show");
          });

          // Close dropdown when clicking elsewhere
          document.addEventListener("click", function () {
            verticalDropdownContent.classList.remove("show");
          });
        }

        // Initialize with current streak
        const currentStreak = localStorage.getItem("currentStreak") || "5";
        document.getElementById("streak-count").textContent = currentStreak;
        document.getElementById("streak-display").textContent = currentStreak;
      });

  // Elements (the dropdown, buttons, dialog)
  const avatarBtn = document.getElementById('avatarBtn');
  const menu  = document.getElementById('userMenu');
  const menuRoot  = document.querySelector('.profile-menu');
  const themeSwitch = document.getElementById('themeSwitch');
  const deleteBtn = document.getElementById('deleteCourseBtn');
  const deleteDialog = document.getElementById('deleteDialog');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

  // --- Dropdown open/close ---
 function isOpen()     { return menu.classList.contains('open'); }
  function openMenu()   { menu.classList.add('open');  avatarBtn.setAttribute('aria-expanded','true'); }
  function closeMenu()  { menu.classList.remove('open'); avatarBtn.setAttribute('aria-expanded','false'); }
  
  avatarBtn.addEventListener('click', (e)=> {
    e.stopPropagation();
    if (isOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

   // Close when clicking ANY menu item (including label/inputs)
   menu.addEventListener('click', (e) => {
    const isAction = e.target.closest('.menu-item');
    if (isAction) {
      // If the action is a checkbox (theme), we still close after the toggle
      // Remove the next line if you want the menu to remain open after toggling theme.
      closeMenu();
    }
  });

  // Close on outside click (capture phase = super reliable)
  document.addEventListener('click', (e) => {
    // If click happened outside the entire profile-menu region, close it
    if (isOpen() && !e.target.closest('.profile-menu')) {
      closeMenu();
    }
  }, true); // capture=true ensures we see the click even if other handlers stop it

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closeMenu();
  });

  // Optional: close on scroll or resize (prevents weird stuck states)
  window.addEventListener('scroll',  () => isOpen() && closeMenu(), { passive: true });
  window.addEventListener('resize',  () => isOpen() && closeMenu());


  // --- Theme toggle ---
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeSwitch.checked = savedTheme === 'dark';
  themeSwitch.addEventListener('change', ()=>{
    const next = themeSwitch.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // Show dialog
  deleteBtn.addEventListener('click', () => {
    deleteDialog.showModal();
  });

  // Cancel button explicitly closes dialog
  cancelDeleteBtn.addEventListener('click', (e) => {
    e.preventDefault();          // prevent form submit
    deleteDialog.close();        // close it manually
  });

  // Handle confirm
  deleteDialog.addEventListener('close', () => {
    if (deleteDialog.returnValue === 'confirm') {
      alert('Course deleted (demo). Replace with your actual delete logic.');
    }
  })
  deleteBtn.addEventListener('click', ()=>{
    deleteDialog.showModal();
    closeMenu();
  });
  deleteDialog.addEventListener('close', ()=>{
    if(deleteDialog.returnValue === 'confirm'){

      // Bontle you will add the course here for real deletion logic
      alert('Course deleted (demo). Hook this to your course ID/action.');
    }
  });

  
  





