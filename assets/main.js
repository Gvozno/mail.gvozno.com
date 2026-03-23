    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    }