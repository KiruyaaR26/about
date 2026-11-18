document.addEventListener("DOMContentLoaded", () => {
    const navBtn = document.getElementById('test2');
    const dropdownContainer = document.querySelector('.dropdown');
    const backBtn = document.querySelector('.d-content-back');

    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia("(pointer: coarse)").matches;

    const closeDropdown = () => {
        if (!navBtn) return;
        navBtn.classList.remove('active');
        navBtn.setAttribute('aria-expanded', 'false');
        if (document.activeElement && dropdownContainer && dropdownContainer.contains(document.activeElement)) {
            document.activeElement.blur();
        }
    };

    if (navBtn && dropdownContainer) {
        if (isTouchDevice) {
            navBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const open = navBtn.classList.toggle('active');
                navBtn.setAttribute('aria-expanded', String(open));
            });

            document.addEventListener('click', (e) => {
                if (!dropdownContainer.contains(e.target)) {
                    closeDropdown();
                }
            });
        } else {
            dropdownContainer.addEventListener('mouseenter', () => {
                navBtn.classList.add('active');
                navBtn.setAttribute('aria-expanded', 'true');
            });

            dropdownContainer.addEventListener('mouseleave', () => {
                closeDropdown();
            });

            navBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const open = navBtn.classList.toggle('active');
                navBtn.setAttribute('aria-expanded', String(open));
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closeDropdown();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDropdown();
        });
    }

    // hamburger menu
    const toggleBtn = document.querySelector(".nav-toggle");
    const primaryNav = document.getElementById("primary-nav");

    if (!toggleBtn || !primaryNav) return;

    const setMenuState = (open) => {
        toggleBtn.setAttribute("aria-expanded", String(open));
        toggleBtn.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
        primaryNav.classList.toggle("is-open", open);
        document.body.style.overflow = open ? "hidden" : "";
    };

    toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = toggleBtn.getAttribute("aria-expanded") === "true";
        setMenuState(!isOpen);
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("click", (e) => {
        if (!primaryNav.contains(e.target) && !toggleBtn.contains(e.target)) {
            setMenuState(false);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) setMenuState(false);
    });
});
