document.addEventListener("DOMContentLoaded", function () {
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
  // const dotMenu = document.querySelector(".dot-menu");
  // const dropdownContent = document.querySelector(".dropdown-content");

  // if (dotMenu) {
  //   dotMenu.addEventListener("click", function (e) {
  //     e.stopPropagation();
  //     dropdownContent.classList.toggle("show");
  //   });

  //   // Close dropdown when clicking elsewhere
  //   document.addEventListener("click", function () {
  //     dropdownContent.classList.remove("show");
  //   });
  // }

  // Vertical dots menu functionality
  // const verticalDots = document.querySelector(".vertical-dots");
  // const verticalDropdownContent = document.querySelector(
  //   ".vertical-dropdown-content"
  // );

  // if (verticalDots) {
  //   verticalDots.addEventListener("click", function (e) {
  //     e.stopPropagation();
  //     verticalDropdownContent.classList.toggle("show");
  //   });

  //   // Close dropdown when clicking elsewhere
  //   document.addEventListener("click", function () {
  //     verticalDropdownContent.classList.remove("show");
  //   });
  // }

  // Elements (the dropdown, buttons, dialog)
  const avatarBtn = document.getElementById('avatarBtn');
  const menu = document.getElementById('userMenu');
  const menuRoot = document.querySelector('.profile-menu');
  const themeSwitch = document.getElementById('themeSwitch');
  const deleteBtn = document.getElementById('deleteCourseBtn');
  const deleteDialog = document.getElementById('deleteDialog');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

  // --- Dropdown open/close ---
  function isOpen() { return menu.classList.contains('open'); }
  function openMenu() { menu.classList.add('open'); avatarBtn.setAttribute('aria-expanded', 'true'); }
  function closeMenu() { menu.classList.remove('open'); avatarBtn.setAttribute('aria-expanded', 'false'); }

  avatarBtn.addEventListener('click', (e) => {
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
  window.addEventListener('scroll', () => isOpen() && closeMenu(), { passive: true });
  window.addEventListener('resize', () => isOpen() && closeMenu());


  // --- Theme toggle ---
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeSwitch.checked = savedTheme === 'dark';
  themeSwitch.addEventListener('change', () => {
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
  deleteBtn.addEventListener('click', () => {
    deleteDialog.showModal();
    closeMenu();
  });
  deleteDialog.addEventListener('close', () => {
    if (deleteDialog.returnValue === 'confirm') {

      // Bontle you will add the course here for real deletion logic
      alert('Course deleted (demo). Hook this to your course ID/action.');
    }
  });

});





