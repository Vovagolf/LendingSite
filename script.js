(() => {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const year = document.querySelector("[data-year]");
  const privacyLink = document.querySelector('a[href="#privacy"]');
  const privacyDialog = document.querySelector("#privacy");
  const form = document.querySelector("[data-contact-form]");

  if (year) year.textContent = String(new Date().getFullYear());

  // Theme: default to system, persist user choice
  const themeKey = "golf5LandingTheme";
  const applyTheme = (value) => {
    if (!value) {
      document.documentElement.removeAttribute("data-theme");
      return;
    }
    document.documentElement.setAttribute("data-theme", value);
  };
  try {
    applyTheme(localStorage.getItem(themeKey));
  } catch {
    // ignore storage errors
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "light" ? "" : "light";
      applyTheme(next);
      try {
        if (!next) localStorage.removeItem(themeKey);
        else localStorage.setItem(themeKey, next);
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
    navToggle.setAttribute("aria-label", open ? "Закрити меню" : "Відкрити меню");
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

      const subjectParts = ["Заявка: Volkswagen Golf 5"];
      if (plan) subjectParts.push(`пакет ${plan}`);
      const subject = subjectParts.join(" — ");

      const lines = [
        `Ім’я: ${name}`,
        `Email: ${email}`,
        project ? `Проєкт: ${project}` : null,
        plan ? `Пакет: ${plan}` : null,
        "",
        "Повідомлення:",
        message,
      ].filter(Boolean);

      const body = encodeURIComponent(lines.join("\n"));
      const mailto = `mailto:hello@example.com?subject=${encodeURIComponent(subject)}&body=${body}`;
      window.location.href = mailto;
    });
  }
})();

