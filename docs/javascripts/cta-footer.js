(function () {
  const EMAIL = "Layanaalnasser@gmail.com";
  const LINKEDIN = "https://www.linkedin.com/in/layan-alnasser";

  function getBase() {
    try {
      if (typeof __md_get === "function") return __md_get("__base") || "";
    } catch (e) {}
    return "";
  }

  // Always produce a valid MkDocs link under whatever base path you're deployed to
  function url(path) {
    const base = getBase().replace(/\/$/, ""); // remove trailing slash
    const clean = String(path || "").replace(/^\//, ""); // remove leading slash
    // Allow empty path -> base + "/"
    const joined = `${base}/${clean}`.replace(/\/+/g, "/");
    return clean ? joined : `${base}/`;
  }

  function getSiteName() {
    const titleEl = document.querySelector(".md-header__title .md-ellipsis");
    return titleEl ? titleEl.textContent.trim() : "Website";
  }

  function addHeaderCTA() {
    const headerInner = document.querySelector(".md-header__inner");
    if (!headerInner) return;
    if (headerInner.querySelector("a.header-cta")) return;

    const cta = document.createElement("a");
    cta.className = "header-cta";
    cta.href = `mailto:${EMAIL}`;
    cta.textContent = "Contact";
    cta.setAttribute("aria-label", "Contact");
    headerInner.appendChild(cta);
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

  function addFooterBlock() {
    const footer = document.querySelector(".md-footer");
    if (!footer) return;
    if (footer.querySelector(".custom-footer")) return;

    const meta = footer.querySelector(".md-footer-meta");
    const block = document.createElement("section");
    block.className = "custom-footer";

    const siteName = getSiteName();

    // Matches your nav:
    // Home
    // Academics: Overview, Notes & Learning, Resources
    // Career Development: About Me, Resume / CV, Projects, Activities & Workshops
    // Links
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
            <div class="footer-col__title">Contact</div>
            <a class="footer-link" href="mailto:${EMAIL}">${EMAIL}</a>
            <a class="footer-link" href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a>
          </div>
        </div>
      </div>
    `;

    if (meta) footer.insertBefore(block, meta);
    else footer.prepend(block);
  }

  function run() {
    addHeaderCTA();
    addFooterBlock();
    styleFooterMetaToMatch();
  }

  // MkDocs Material instant navigation support
  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(run);
  } else {
    document.addEventListener("DOMContentLoaded", run);
  }
})();
