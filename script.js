document.addEventListener("DOMContentLoaded", () => {
  renderResources();
  renderProjects();
  renderStats();
  initUIListeners();
});

function renderResources() {
  const container = document.getElementById("resource-container");
  if (!container) return;
  let htmlContent = "";
  COMMUNITY_RESOURCES.forEach((cat) => {
    htmlContent += `
      <div class="resource-category">
        <h3 class="category-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            ${cat.iconSvg}
          </svg>
          ${cat.categoryName}
        </h3>
        <div class="resource-grid">
    `;
    cat.items.forEach((item) => {
      const dimClass = item.isDim ? "resource-card-dim" : "";
      const tagSpan = item.tag
        ? `<span class="rc-tag ${item.tagClass || ""}">${item.tag}</span>`
        : "";
      let displayUrl = "";
      try {
        const parsedUrl = new URL(item.url);
        displayUrl = parsedUrl.hostname + parsedUrl.pathname;
        if (displayUrl.endsWith("/")) {
          displayUrl = displayUrl.slice(0, -1);
        }
        if (displayUrl.startsWith("www.")) {
          displayUrl = displayUrl.substring(4);
        }
      } catch (e) {
        displayUrl = item.url;
      }
      htmlContent += `
        <a href="${item.url}" target="_blank" rel="noopener" class="resource-card ${dimClass}">
          <div class="rc-top">
            <span class="rc-owner">${item.owner}</span>
            <svg class="rc-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
          <h4 class="rc-title">${item.title}</h4>
          <p class="rc-url">${displayUrl}</p>
          ${tagSpan}
        </a>
      `;
    });
    htmlContent += `
        </div>
      </div>
    `;
  });

  container.innerHTML = htmlContent;
}

function renderProjects() {
  const container = document.getElementById("project-container");
  if (!container) return;
  let htmlContent = "";
  GITHUB_PROJECTS.forEach((proj) => {
    const featuredClass = proj.isFeatured
      ? "project-card project-card-featured"
      : "project-card";
    const badgeMarkup = proj.badge
      ? `<span class="pc-badge">${proj.badge}</span>`
      : "";
    htmlContent += `
      <a href="${proj.url}" target="_blank" rel="noopener" class="${featuredClass}">
        <div class="pc-header">
          <svg class="pc-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span class="pc-lang ${proj.langClass}">${proj.lang}</span>
        </div>
        <h4 class="pc-title">${proj.title}</h4>
        <p class="pc-desc">${proj.desc}</p>
        <div class="pc-footer">
          <span class="pc-author">${proj.author}</span>
          ${badgeMarkup}
        </div>
        <code class="pc-repo">${proj.repo}</code>
      </a>
    `;
  });
  container.innerHTML = htmlContent;
}

function renderStats() {
  const botsStatEl = document.getElementById("stat-bots");
  const apisStatEl = document.getElementById("stat-apis");
  const totalBots =
    typeof GITHUB_PROJECTS !== "undefined" ? GITHUB_PROJECTS.length : 0;
  let totalApis = 0;
  if (typeof COMMUNITY_RESOURCES !== "undefined") {
    COMMUNITY_RESOURCES.forEach((cat) => {
      if (cat.categoryName.includes("API")) {
        totalApis += cat.items.length;
      }
    });
  }
  if (botsStatEl) botsStatEl.textContent = `${totalBots}+`;
  if (apisStatEl) apisStatEl.textContent = `${totalApis}+`;
}

function initUIListeners() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const nav = document.getElementById("nav");
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("active");
      hamburger.classList.toggle("active", open);
    });
  }
  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
  window.addEventListener(
    "scroll",
    () => {
      if (nav) {
        nav.classList.toggle("scrolled", window.scrollY > 20);
      }
    },
    { passive: true },
  );
}
