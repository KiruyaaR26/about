(function () {
  "use strict";

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx_ipxtg9sxpAup2hmxzBN2NROT-j2GAzsbRuZWJ6Sb6pB-eExhYTeyo8AiYgTm1e7ZYw/exec";

  const CONTACT_ID_TEXT = {
    "chip": "Saluran Aman Terbuka",
    "title1": "Mulai",
    "title2": "percakapan",
    "lead": "Punya pertanyaan seputar penerapan Radova Linux untuk repositori institusi, arsip digital, atau manajemen perpustakaan? Hubungi kami.",
    "c1.title": "Email Langsung",
    "c2.title": "Matrix",
    "c3.title": "Pengembangan",
    "c4.title": "Lokasi",
    "c4.desc": "Tangerang Selatan, Banten",
    "tab.info": "Informasi",
    "tab.bugs": "Lapor Bug",
    "tab.collab": "Kolaborasi",
    "form.name": "Nama Lengkap",
    "form.name.ph": "Budi Santoso",
    "form.email": "Alamat Email",
    "form.email.ph": "budi@institusi.ac.id",
    "form.subject": "Subjek",
    "opt.info.default": "Pilih topik pertanyaan...",
    "opt.info.1": "Pertanyaan Umum",
    "opt.info.2": "Memora / Manajemen Perpustakaan",
    "opt.info.3": "Evrocks / Manajemen Arsip",
    "opt.info.4": "Coretez / Manajemen Aset Digital (DAM)",
    "opt.info.5": "Linkers / Repositori",
    "opt.bug.default": "Pilih kategori bug...",
    "opt.bug.1": "Masalah Instalasi / Booting",
    "opt.bug.2": "Error Plugin Coretez",
    "opt.bug.3": "Performa / Penggunaan Memori Tinggi",
    "opt.bug.4": "Keamanan Sistem / Kerentanan",
    "opt.collab.default": "Pilih jenis kolaborasi...",
    "opt.collab.1": "Kemitraan Riset Akademik",
    "opt.collab.2": "Kontribusi Open Source (Forgejo)",
    "opt.collab.3": "Implementasi / Deployment Institusi",
    "opt.collab.4": "Sponsor / Pendanaan",
    "form.message": "Pesan",
    "form.message.ph": "Bagaimana kami dapat membantu membangun memori institusi Anda?",
    "form.loading": "[ MENGIRIM DATA... ]",
    "form.submit": "Kirim Pesan",
    "res.ok.badge": "200 // TERKIRIM",
    "res.ok.title": "Transmisi Berhasil!",
    "res.ok.desc": "Permintaan Anda telah diterima dengan aman oleh tim Radova Linux. Kami akan segera merespons.",
    "res.ok.btn": "Kirim Pesan Lain",
    "res.err.badge": "ERR // GAGAL",
    "res.err.title": "Transmisi Gagal",
    "res.err.btn": "Coba Lagi"
  };

  const CONTACT_EN_CACHE = {
    text: new Map(),
    placeholders: new Map()
  };

  function getCurrentLang() {
    const htmlLang = document.documentElement.lang;
    if (htmlLang === "id" || htmlLang === "en") return htmlLang;
    try {
      const saved = localStorage.getItem("radova-lang");
      if (saved === "id" || saved === "en") return saved;
    } catch (_) {}
    return "en";
  }

  function translateContactPage(lang) {
    const isId = lang === "id";

    document.querySelectorAll("[data-contact-i18n]").forEach((el) => {
      const key = el.getAttribute("data-contact-i18n");
      if (!CONTACT_EN_CACHE.text.has(el)) {
        CONTACT_EN_CACHE.text.set(el, el.textContent);
      }
      el.textContent = isId && CONTACT_ID_TEXT[key] ? CONTACT_ID_TEXT[key] : CONTACT_EN_CACHE.text.get(el);
    });

    document.querySelectorAll("[data-contact-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-contact-placeholder");
      if (!CONTACT_EN_CACHE.placeholders.has(el)) {
        CONTACT_EN_CACHE.placeholders.set(el, el.getAttribute("placeholder") || "");
      }
      el.setAttribute(
        "placeholder",
        isId && CONTACT_ID_TEXT[key] ? CONTACT_ID_TEXT[key] : CONTACT_EN_CACHE.placeholders.get(el)
      );
    });
  }

  function switchTab(category, btnElement) {
    const categoryInput = document.getElementById("category");
    if (categoryInput) categoryInput.value = category;

    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    });

    if (btnElement) {
      btnElement.classList.add("active");
      btnElement.setAttribute("aria-selected", "true");
    }

    document.querySelectorAll(".tab-content").forEach((selectEl) => {
      selectEl.classList.remove("active");
      selectEl.disabled = true;
      selectEl.required = false;
    });

    const targetMap = {
      "Information": "subject-info",
      "Report Bugs": "subject-bug",
      "Collaboration": "subject-collab"
    };

    const targetId = targetMap[category] || "subject-info";
    const activeDropdown = document.getElementById(targetId);
    const subjectLabel = document.getElementById("subject-label");

    if (activeDropdown) {
      activeDropdown.classList.add("active");
      activeDropdown.disabled = false;
      activeDropdown.required = true;
    }

    if (subjectLabel) {
      subjectLabel.setAttribute("for", targetId);
    }
  }

  async function sendData(event) {
    event.preventDefault();

    const indicator = document.getElementById("loading-indicator");
    const submitBtn = document.getElementById("submit-btn");
    const responseBox = document.getElementById("contact-response");
    const isId = getCurrentLang() === "id";

    if (indicator) indicator.classList.add("is-visible");
    if (submitBtn) submitBtn.disabled = true;

    const formData = new URLSearchParams();
    formData.append("name", document.getElementById("name").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("category", document.getElementById("category").value);

    const activeSubject = document.querySelector(".tab-content.active");
    formData.append("subject", activeSubject ? activeSubject.value : "");
    formData.append("message", document.getElementById("message").value);

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData
      });

      if (responseBox) {
        responseBox.innerHTML = `
          <div class="transmission-state is-success">
            <span class="transmission-badge">${isId ? CONTACT_ID_TEXT["res.ok.badge"] : "200 // DELIVERED"}</span>
            <h3>${isId ? CONTACT_ID_TEXT["res.ok.title"] : "Transmission Successful!"}</h3>
            <p>${isId ? CONTACT_ID_TEXT["res.ok.desc"] : "Your request has been securely delivered to the Radova Linux team. We will respond shortly."}</p>
            <button type="button" onclick="window.location.reload()" class="btn btn-outline">
              ${isId ? CONTACT_ID_TEXT["res.ok.btn"] : "Send Another Message"}
            </button>
          </div>
        `;
      }
    } catch (error) {
      if (indicator) indicator.classList.remove("is-visible");
      if (submitBtn) submitBtn.disabled = false;

      if (responseBox) {
        responseBox.innerHTML = `
          <div class="transmission-state is-error">
            <span class="transmission-badge">${isId ? CONTACT_ID_TEXT["res.err.badge"] : "ERR // FAILED"}</span>
            <h3>${isId ? CONTACT_ID_TEXT["res.err.title"] : "Transmission Failed"}</h3>
            <p>${error && error.message ? error.message : String(error)}</p>
            <button type="button" onclick="window.location.reload()" class="btn btn-outline">
              ${isId ? CONTACT_ID_TEXT["res.err.btn"] : "Try Again"}
            </button>
          </div>
        `;
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Bind tab buttons cleanly without inline onclick
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const category = btn.getAttribute("data-category");
        switchTab(category, btn);
      });
    });

    // Bind form submission
    const form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", sendData);
    }

    // Initial translation sync & watch <html lang="..."> changes from site.js
    translateContactPage(getCurrentLang());

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === "lang") {
          translateContactPage(getCurrentLang());
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  });
})();