(function () {
  const EMAIL = "Layanaalnasser@gmail.com";
  const GITHUB = "https://github.com/LayanAlnasser";
  const LINKEDIN = "https://www.linkedin.com/in/layan-alnasser";
  const BLUEPRINT = "https://blueprint.shoug-tech.com/";
  const STORAGE_KEYS = {
    nav: "garden-layout-hide-nav",
    toc: "garden-layout-hide-toc",
  };

  function getBase() {
    try {
      if (typeof __md_get === "function") return __md_get("__base") || "";
    } catch (e) {}
    return "";
  }
  
  function url(path) {
    const base = (getBase() || "").replace(/\/$/, "");
    const raw = String(path || "");

    // root
    if (!raw || raw === "/") return `${base}/`;

    const clean = raw.replace(/^\//, "");

    // If user passed an explicit file (".html", ".pdf", etc), keep it.
    const hasExt = /\.[a-z0-9]{2,5}($|\?)/i.test(clean);

    // If it's a "folder-ish" path (ends with "/"), keep it.
    const endsWithSlash = clean.endsWith("/");

    // Otherwise, assume it's a MkDocs page and make it directory-style.
    // This avoids broken links when use_directory_urls=true.
    const normalized = hasExt || endsWithSlash ? clean : `${clean}/`;

    return `${base}/${normalized}`.replace(/\/+/g, "/");
  }

  function getSiteName() {
    const titleEl = document.querySelector(".md-header__title .md-ellipsis");
    return titleEl ? titleEl.textContent.trim() : "Website";
  }

  function addHeaderBrand() {
    const headerInner = document.querySelector(".md-header__inner");
    const logo = headerInner?.querySelector(".md-logo");
    if (!headerInner || !logo) return;

    const existing = headerInner.querySelector(".header-brand");
    if (existing) {
      existing.textContent = getSiteName();
      return;
    }

    const brand = document.createElement("a");
    brand.className = "header-brand";
    brand.href = url("");
    brand.textContent = getSiteName();
    brand.setAttribute("aria-label", getSiteName());
    logo.insertAdjacentElement("afterend", brand);
  }

  function getHeaderActions() {
    const headerInner = document.querySelector(".md-header__inner");
    if (!headerInner) return null;

    let actions = headerInner.querySelector(".header-actions");
    if (!actions) {
      actions = document.createElement("div");
      actions.className = "header-actions";
      headerInner.appendChild(actions);
    }

    return actions;
  }

  function addHeaderCTA() {
    const actions = getHeaderActions();
    if (!actions) return;

    const existing = document.querySelector("a.header-cta");
    if (existing) {
      actions.appendChild(existing);
      return;
    }

    const cta = document.createElement("a");
    cta.className = "header-cta";
    cta.href = `mailto:${EMAIL}`;
    cta.textContent = "Contact";
    cta.setAttribute("aria-label", "Contact");
    actions.appendChild(cta);
  }

  function addHeaderLinks() {
    const actions = getHeaderActions();
    if (!actions) return;

    const links = [
      { cls: "header-link header-link--github", href: GITHUB, label: "GitHub" },
      { cls: "header-link header-link--linkedin", href: LINKEDIN, label: "LinkedIn" },
    ];

    links.forEach(({ cls, href, label }) => {
      let link = actions.querySelector(`.${cls.split(" ").join(".")}`);
      if (!link) {
        link = document.createElement("a");
        link.className = cls;
        link.target = "_blank";
        link.rel = "noopener";
        actions.appendChild(link);
      }

      link.href = href;
      link.textContent = label;
      link.setAttribute("aria-label", label);
    });
  }

  function setLayoutState(type, hidden) {
    const className = type === "nav" ? "layout-hide-nav" : "layout-hide-toc";
    document.body.classList.toggle(className, hidden);

    try {
      localStorage.setItem(
        type === "nav" ? STORAGE_KEYS.nav : STORAGE_KEYS.toc,
        hidden ? "1" : "0"
      );
    } catch (e) {}
  }

  function syncToggleLabels() {
    document.querySelectorAll(".layout-toggle").forEach((button) => {
      const type = button.getAttribute("data-target");
      const hidden = document.body.classList.contains(
        type === "nav" ? "layout-hide-nav" : "layout-hide-toc"
      );

      button.setAttribute("aria-pressed", hidden ? "false" : "true");
      button.textContent = hidden
        ? `Show ${type === "nav" ? "Nav" : "TOC"}`
        : `Hide ${type === "nav" ? "Nav" : "TOC"}`;
    });
  }

  function applyStoredLayoutState() {
    try {
      setLayoutState("nav", localStorage.getItem(STORAGE_KEYS.nav) === "1");
      setLayoutState("toc", localStorage.getItem(STORAGE_KEYS.toc) === "1");
    } catch (e) {
      document.body.classList.remove("layout-hide-nav", "layout-hide-toc");
    }

    syncToggleLabels();
  }

  function addLayoutToggles() {
    const actions = getHeaderActions();
    if (!actions) return;

    const existing = document.querySelector(".header-layout-tools");
    if (existing) {
      actions.prepend(existing);
      return;
    }

    const tools = document.createElement("div");
    tools.className = "header-layout-tools";
    tools.innerHTML = `
      <button class="layout-toggle" type="button" data-target="nav" aria-label="Toggle side navigation"></button>
      <button class="layout-toggle" type="button" data-target="toc" aria-label="Toggle table of contents"></button>
    `;

    actions.prepend(tools);

    tools.querySelectorAll(".layout-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const type = button.getAttribute("data-target");
        const className = type === "nav" ? "layout-hide-nav" : "layout-hide-toc";
        setLayoutState(type, !document.body.classList.contains(className));
        syncToggleLabels();
      });
    });
  }

  function styleFooterMetaToMatch() {
    const meta = document.querySelector(".md-footer-meta");
    if (!meta) return;

    const scheme =
      document.documentElement.getAttribute("data-md-color-scheme") || "default";

    if (scheme === "slate") {
      meta.style.background =
        "linear-gradient(90deg, var(--dark-1), var(--dark-2))";
      meta.style.borderTop = "1px solid rgba(230, 244, 241, 0.12)";
      meta.style.color = "rgba(230, 244, 241, 0.78)";
    } else {
      meta.style.background =
        "linear-gradient(90deg, var(--mint-1), var(--mint-2))";
      meta.style.borderTop = "1px solid rgba(31, 41, 55, 0.10)";
      meta.style.color = "var(--ink-muted)";
    }

    meta.querySelectorAll("*").forEach((el) => {
      el.style.color = "inherit";
    });
  }

  function setFooterMetaLine() {
    const copyright = document.querySelector(".md-footer-meta .md-copyright");
    const highlight = copyright?.querySelector(".md-copyright__highlight");
    if (!copyright || !highlight) return;

    copyright.innerHTML = "";
    copyright.appendChild(highlight);

    const suffix = document.createElement("span");
    suffix.className = "footer-meta-credit";
    suffix.innerHTML = `<span class="footer-meta-sep">|</span> Made by <a href="${BLUEPRINT}" target="_blank" rel="noopener">Blueprint</a>`;
    copyright.appendChild(suffix);
  }

  function addFooterBlock() {
    const footer = document.querySelector(".md-footer");
    if (!footer) return;
    if (footer.querySelector(".custom-footer")) return;

    const meta = footer.querySelector(".md-footer-meta");
    const block = document.createElement("section");
    block.className = "custom-footer";

    const siteName = getSiteName();

    block.innerHTML = `
      <div class="custom-footer__inner">
        <div class="custom-footer__left">
          <div class="custom-footer__brand">${siteName}</div>
          <div class="custom-footer__title">Stay Updated</div>

          <form class="custom-footer__form" action="mailto:${EMAIL}" method="get">
            <input
              class="custom-footer__input"
              type="email"
              name="email"
              placeholder="Email address"
              autocomplete="email"
              required
            >
            <button class="custom-footer__button" type="submit">
              Subscribe
            </button>
          </form>

          <div class="custom-footer__note">
            By entering your email, you agree to be contacted.
          </div>
        </div>

        <div class="custom-footer__right">
          <div class="footer-col">
            <div class="footer-col__title">Home</div>
            <a class="footer-link" href="${url("")}">Home</a>
          </div>

          <div class="footer-col">
            <div class="footer-col__title">Academics</div>
            <a class="footer-link" href="${url("academics/")}">Overview</a>
            <a class="footer-link" href="${url("academics/notes/")}">Notes &amp; Learning</a>
            <a class="footer-link" href="${url("academics/resources/")}">Resources</a>
          </div>

          <div class="footer-col">
            <div class="footer-col__title">Career Development</div>
            <a class="footer-link" href="${url("career/about/")}">About Me</a>
            <a class="footer-link" href="${url("career/cv/")}">Resume / CV</a>
            <a class="footer-link" href="${url("career/projects/")}">Projects</a>
            <a class="footer-link" href="${url("career/activities/")}">Activities &amp; Workshops</a>
          </div>

          <div class="footer-col">
            <div class="footer-col__title">Links</div>
            <a class="footer-link" href="${url("links/")}">Links</a>

            <div style="height:10px"></div>

            <div class="footer-col__title">Policies</div>
            <a class="footer-link" href="${url("privacy-notice/")}">Privacy Notice</a>
            <a class="footer-link" href="${url("academic-disclaimer/")}">Academic Disclaimer</a>
            <a class="footer-link" href="${url("copyright/")}">Copyright</a>

            <div style="height:10px"></div>

            <div class="footer-col__title">Contact</div>
            <a class="footer-link" href="mailto:${EMAIL}">${EMAIL}</a>
            <a class="footer-link" href="${GITHUB}" target="_blank" rel="noopener">GitHub</a>
            <a class="footer-link" href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a>
          </div>
        </div>
      </div>
    `;

    if (meta) footer.insertBefore(block, meta);
    else footer.prepend(block);
  }

  function run() {
    addHeaderBrand();
    addLayoutToggles();
    addHeaderLinks();
    addHeaderCTA();
    addFooterBlock();
    styleFooterMetaToMatch();
    setFooterMetaLine();
    applyStoredLayoutState();
  }

  // MkDocs Material instant navigation support
  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(run);
  } else {
    document.addEventListener("DOMContentLoaded", run);
  }
})();
