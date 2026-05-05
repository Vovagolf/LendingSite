(() => {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const langToggle = document.querySelector("[data-lang-toggle]");
  const year = document.querySelector("[data-year]");
  const privacyLink = document.querySelector('a[href="#privacy"]');
  const privacyDialog = document.querySelector("#privacy");
  const form = document.querySelector("[data-contact-form]");

  if (year) year.textContent = String(new Date().getFullYear());

  // Theme palettes (cycle), persist user choice
  const themeKey = "portfolioTheme";
  const themes = [
    { id: "midnight", label: "Midnight" },
    { id: "ocean", label: "Ocean" },
    { id: "aurora", label: "Aurora" },
    { id: "violet", label: "Violet" },
    { id: "sunset", label: "Sunset" },
    { id: "graphite", label: "Graphite" },
    { id: "orange", label: "Orange" },
    { id: "light", label: "Light" },
  ];

  const themeNameEl = document.querySelector("[data-theme-name]");
  const getTheme = () => document.documentElement.getAttribute("data-theme") || "midnight";

  const applyTheme = (id) => {
    const next = themes.some((t) => t.id === id) ? id : "midnight";
    document.documentElement.setAttribute("data-theme", next);
    const label = themes.find((t) => t.id === next)?.label || next;
    if (themeNameEl) themeNameEl.textContent = label;
  };

  try {
    const saved = localStorage.getItem(themeKey);
    if (saved) applyTheme(saved);
    else applyTheme(getTheme());
  } catch {
    applyTheme(getTheme());
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = getTheme();
      const idx = themes.findIndex((t) => t.id === current);
      const next = themes[(idx + 1 + themes.length) % themes.length].id;
      applyTheme(next);
      try {
        localStorage.setItem(themeKey, next);
      } catch {
        // ignore storage errors
      }
    });
  }

  // Language: uk/en, persist user choice
  const langKey = "portfolioLang";
  const getLang = () => document.documentElement.getAttribute("data-lang") || "uk";

  const applyLang = (lang) => {
    const next = lang === "en" ? "en" : "uk";
    document.documentElement.setAttribute("data-lang", next);
    document.documentElement.setAttribute("lang", next);

    // Title/meta
    const titleEl = document.querySelector("[data-i18n-title]");
    const metaDesc = document.querySelector('meta[name="description"][data-i18n-meta="description"]');
    const titles = {
      uk: "Портфоліо — Бабійчук Володимир Миколайович",
      en: "Portfolio — Volodymyr Babiychuk",
    };
    const desc = {
      uk: "Портфоліо Бабійчук Володимир Миколайович — Backend Developer. Навички, проєкти, освіта та контакти.",
      en: "Portfolio of Volodymyr Babiychuk — Backend Developer. Skills, projects, education, and contacts.",
    };
    if (titleEl) titleEl.textContent = titles[next];
    document.title = titles[next];
    if (metaDesc) metaDesc.setAttribute("content", desc[next]);

    // Text nodes
    for (const el of document.querySelectorAll("[data-en]")) {
      if (!("uk" in el.dataset)) el.dataset.uk = el.textContent ?? "";
      el.textContent = next === "en" ? el.dataset.en : el.dataset.uk;
    }
    for (const el of document.querySelectorAll("[data-en-html]")) {
      if (!("ukHtml" in el.dataset)) el.dataset.ukHtml = el.innerHTML ?? "";
      el.innerHTML = next === "en" ? el.dataset.enHtml : el.dataset.ukHtml;
    }

    // Attributes
    for (const el of document.querySelectorAll("[data-en-aria-label]")) {
      if (!("ukAriaLabel" in el.dataset)) el.dataset.ukAriaLabel = el.getAttribute("aria-label") || "";
      el.setAttribute("aria-label", next === "en" ? el.dataset.enAriaLabel : el.dataset.ukAriaLabel);
    }
    for (const el of document.querySelectorAll("[data-en-placeholder]")) {
      if (!("ukPlaceholder" in el.dataset)) el.dataset.ukPlaceholder = el.getAttribute("placeholder") || "";
      el.setAttribute("placeholder", next === "en" ? el.dataset.enPlaceholder : el.dataset.ukPlaceholder);
    }

    // Toggle pill
    const pill = langToggle?.querySelector(".lang-pill");
    if (pill) pill.textContent = next === "en" ? "EN" : "UA";

    // Keep mobile menu label in sync (fallback)
    if (navToggle) {
      const open = header?.getAttribute("data-menu-open") === "true";
      if (open) navToggle.setAttribute("aria-label", next === "en" ? "Close menu" : "Закрити меню");
      else navToggle.setAttribute("aria-label", next === "en" ? "Open menu" : "Відкрити меню");
    }
  };

  try {
    const savedLang = localStorage.getItem(langKey);
    if (savedLang) applyLang(savedLang);
  } catch {
    // ignore storage errors
  }

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      const next = getLang() === "en" ? "uk" : "en";
      applyLang(next);
      try {
        localStorage.setItem(langKey, next);
      } catch {
        // ignore storage errors
      }
    });
  }

  // Mobile nav
  const setMenuOpen = (open) => {
    if (!header || !navToggle) return;
    header.setAttribute("data-menu-open", open ? "true" : "false");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    const lang = getLang();
    navToggle.setAttribute("aria-label", open ? (lang === "en" ? "Close menu" : "Закрити меню") : (lang === "en" ? "Open menu" : "Відкрити меню"));
  };
  setMenuOpen(false);
  if (navToggle) navToggle.addEventListener("click", () => setMenuOpen(header?.getAttribute("data-menu-open") !== "true"));

  // Close menu after click
  if (nav) {
    nav.addEventListener("click", (e) => {
      const target = e.target;
      if (target instanceof HTMLAnchorElement) setMenuOpen(false);
    });
  }

  // Smooth scroll (native) with small offset to account for sticky header
  const scrollToHash = (hash) => {
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return false;
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const y = window.scrollY + el.getBoundingClientRect().top - headerH - 10;
    window.scrollTo({ top: y, behavior: "smooth" });
    return true;
  };

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLAnchorElement)) return;
    const href = t.getAttribute("href") || "";
    if (!href.startsWith("#") || href === "#") return;

    if (href === "#privacy") {
      if (privacyDialog && typeof privacyDialog.showModal === "function") {
        e.preventDefault();
        privacyDialog.showModal();
      }
      return;
    }

    if (scrollToHash(href)) e.preventDefault();
  });

  // Open privacy dialog from footer link
  if (privacyLink && privacyDialog && typeof privacyDialog.showModal === "function") {
    privacyLink.addEventListener("click", (e) => {
      e.preventDefault();
      privacyDialog.showModal();
    });
  }

  // Pricing plan → contact form hidden field
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const plan = t.getAttribute("data-plan");
    if (!plan || !form) return;
    const hidden = form.querySelector('input[name="plan"]');
    if (hidden) hidden.value = plan;
  });

  // Contact form: no backend, build mailto
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const project = String(fd.get("project") || "").trim();
      const message = String(fd.get("message") || "").trim();
      const plan = String(fd.get("plan") || "").trim();

      const lang = getLang();
      const subjectParts = [lang === "en" ? "Portfolio inquiry" : "Заявка: портфоліо"];
      if (plan) subjectParts.push(lang === "en" ? `topic ${plan}` : `тема ${plan}`);
      const subject = subjectParts.join(" — ");

      const lines =
        lang === "en"
          ? [
              `Name: ${name}`,
              `Email: ${email}`,
              project ? `Topic: ${project}` : null,
              plan ? `Topic (button): ${plan}` : null,
              "",
              "Message:",
              message,
            ].filter(Boolean)
          : [
              `Ім’я: ${name}`,
              `Email: ${email}`,
              project ? `Тема: ${project}` : null,
              plan ? `Тема (кнопка): ${plan}` : null,
              "",
              "Повідомлення:",
              message,
            ].filter(Boolean);

      const body = encodeURIComponent(lines.join("\n"));
      const mailto = `mailto:golf5oskar@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
      window.location.href = mailto;
    });
  }
})();

