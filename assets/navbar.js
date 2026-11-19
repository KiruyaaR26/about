document.addEventListener("DOMContentLoaded", () => {
    const navBtn = document.getElementById('about-menu-btn');
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

// language switcher (EN <-> ID)
document.addEventListener("DOMContentLoaded", () => {
    const langBtn = document.getElementById("lang-toggle");
    if (!langBtn) return;

    const LANG_KEY = "radova-lang";
    const ID_TEXT = {
        "skip": "Langsung ke konten",
        "nav.packages": "Paket",
        "nav.wiki": "Wiki",
        "nav.learning": "Belajar",
        "nav.events": "Acara",
        "nav.latest": "Terbaru",
        "nav.about": "Tentang",
        "nav.history": "Sejarah",
        "nav.contact": "Kontak",
        "nav.back": "Kembali",
        "about.eyebrow": "Tentang Radova",
        "about.title1": "Di mana ada shell,",
        "about.title2": "di situ ada jalan",
        "history.eyebrow": "Sejarah",
        "history.title1": "Dari satu ide",
        "history.title2": "menjadi satu sistem.",
        "history.sub": "Bagaimana Radova Linux tumbuh dari proyek pribadi di tahun 2019 menjadi satu sistem di tahun 2026.",
        "contact.eyebrow": "Hubungi Kami",
        "footer.col1": "Tentang Radova",
        "footer.col2": "Sumber Daya",
        "footer.col3": "Pilar Utama",
        "footer.col4": "Bantuan & Spesifikasi",
        "footer.download": "Unduh ISO",
        "footer.specs": "Kebutuhan Sistem",
        "footer.security": "Info Keamanan",
        "footer.copy": "© 2026 yuros.org · Dirilis di bawah Lisensi MIT",
        "footer.top": "Ke atas ↑"
    };

    const nodes = document.querySelectorAll("[data-i18n], [data-i18n-prefix]");
    const enList = Array.from(nodes, (node) =>
        node.hasAttribute("data-i18n")
            ? node.textContent
            : (node.firstChild ? node.firstChild.nodeValue : "")
    );

    const applyLang = (lang) => {
        nodes.forEach((el, i) => {
            if (el.hasAttribute("data-i18n")) {
                const key = el.getAttribute("data-i18n");
                el.textContent = lang === "id" && ID_TEXT[key] != null ? ID_TEXT[key] : enList[i];
            } else if (el.firstChild) {
                const pkey = el.getAttribute("data-i18n-prefix");
                el.firstChild.nodeValue = lang === "id" && ID_TEXT[pkey] != null ? ID_TEXT[pkey] + " " : enList[i];
            }
        });
        document.documentElement.lang = lang;
        langBtn.textContent = lang.toUpperCase();
        langBtn.setAttribute("aria-label", lang === "id" ? "Switch language to English" : "Switch language to Indonesian");
    };

    let currentLang = "en";
    try {
        const saved = localStorage.getItem(LANG_KEY);
        if (saved === "id" || saved === "en") currentLang = saved;
    } catch (_) {}

    if (currentLang !== "en") applyLang(currentLang);

    langBtn.addEventListener("click", () => {
        currentLang = currentLang === "en" ? "id" : "en";
        applyLang(currentLang);
        try {
            localStorage.setItem(LANG_KEY, currentLang);
        } catch (_) {}
    });
});


// HTMX Dark Mode Controller (Radova darkmode.pdf palette)
(function () {
  "use strict";
  var THEME_KEY = "radova-theme";
  var SUN_SVG = '<svg width="16" height="16" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="128" cy="128" r="56"/><line x1="128" y1="36" x2="128" y2="16"/><line x1="128" y1="240" x2="128" y2="220"/><line x1="36" y1="128" x2="16" y2="128"/><line x1="240" y1="128" x2="220" y2="128"/><line x1="63" y1="63" x2="49" y2="49"/><line x1="207" y1="207" x2="193" y2="193"/><line x1="193" y1="63" x2="207" y2="49"/><line x1="49" y1="207" x2="63" y2="193"/></svg>';
  var MOON_SVG = '<svg width="16" height="16" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M216.7 152.6A91.9 91.9 0 0 1 103.4 39.3a92 92 0 1 0 113.3 113.3Z"/></svg>';

  function getAssetsBase() {
    var script = document.querySelector('script[src*="htmx.min.js"]');
    return script ? new URL(".", script.src).href : new URL("assets/", window.location.href).href;
  }

  function applyTheme(theme) {
    var isDark = theme === "dark";
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    try { localStorage.setItem(THEME_KEY, isDark ? "dark" : "light"); } catch (_) {}
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      var nextFile = isDark ? "theme-light.html" : "theme-dark.html";
      btn.setAttribute("data-set-theme", isDark ? "dark" : "light");
      btn.setAttribute("aria-pressed", String(isDark));
      btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      btn.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
      btn.setAttribute("hx-get", new URL(nextFile, getAssetsBase()).href);
      btn.innerHTML = isDark ? SUN_SVG : MOON_SVG;
      if (window.htmx) window.htmx.process(btn);
    }
  }

  function getSavedTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") return saved;
    } catch (_) {}
    return "light";
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(getSavedTheme());
  });

  document.addEventListener("htmx:afterSwap", function (evt) {
    var target = evt.detail && evt.detail.target;
    var elt = evt.detail && evt.detail.elt;
    if ((target && target.id === "theme-toggle") || (elt && elt.id === "theme-toggle")) {
      var freshBtn = document.getElementById("theme-toggle");
      applyTheme(freshBtn && freshBtn.getAttribute("data-set-theme") === "dark" ? "dark" : "light");
    } else {
      document.documentElement.setAttribute("data-theme", getSavedTheme());
    }
  });

  function fallbackToggle(evt) {
    var elt = evt.detail && evt.detail.elt;
    if (elt && elt.id === "theme-toggle") {
      applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    }
  }
  document.addEventListener("htmx:sendError", fallbackToggle);
  document.addEventListener("htmx:responseError", fallbackToggle);
})();
