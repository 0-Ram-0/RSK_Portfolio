const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const typingText = document.getElementById("typingText");
const HEADER = document.querySelector(".header");
const FOOTER = document.querySelector(".footer");
const PROFILE_SLOTS = [
  ...document.querySelectorAll(".profile-photo-wrap:not(.fixed-photo)"),
];

const words = [
  "AI/ML Engineer.",
  "Deep Learning Enthusiast.",
  "Full Stack Developer.",
  "Computer Vision Developer.",
];
let wordIndex = 0;

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function toggleMenu(forceOpen = null) {
  if (!navMenu || !menuToggle) return;
  const next = forceOpen ?? !navMenu.classList.contains("show");
  navMenu.classList.toggle("show", next);
  const icon = menuToggle.querySelector("i");
  if (icon) {
    icon.classList.toggle("fa-xmark", next);
    icon.classList.toggle("fa-bars", !next);
  }
}

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => toggleMenu());
}

function rotateTypingWord() {
  if (!typingText) return;
  wordIndex = (wordIndex + 1) % words.length;
  typingText.textContent = words[wordIndex];
  if (!prefersReducedMotion) {
    typingText.classList.remove("pulse-word");
    void typingText.offsetWidth;
    typingText.classList.add("pulse-word");
  }
}

setInterval(rotateTypingWord, 2200);

if (typingText) {
  typingText.addEventListener("animationend", () => {
    typingText.classList.remove("pulse-word");
  });
}

function updateScrollProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight || 1;
  const pct = Math.max(0, Math.min(100, (scrollTop / docHeight) * 100));
  document.documentElement.style.setProperty(
    "--scroll-progress",
    `${pct.toFixed(2)}%`
  );
}

const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('[name="name"]')?.value ?? "";
    const phone = form.querySelector('[name="phone"]')?.value ?? "";
    const email = form.querySelector('[name="email"]')?.value ?? "";
    const subject = form.querySelector('[name="subject"]')?.value ?? "";
    const bodyText = form.querySelector('[name="body"]')?.value ?? "";
    const body = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\n${bodyText}`;
    const href = `mailto:kherrajveersinh1012@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  });
}

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    toggleMenu(false);
  });
});

/** Hero ready state for entrance animation */
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });
});

/** Sticky header */
window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY || window.pageYOffset;
    HEADER?.classList.toggle("is-scrolled", y > 18);
    updateScrollProgress();
  },
  { passive: true }
);
updateScrollProgress();

/** Collect elements to reveal inside each section */
function gatherRevealTargets(section) {
  const out = [];
  section.querySelectorAll(".section-subtitle, .section-title").forEach((el) => {
    out.push(el);
  });
  const container = section.querySelector(":scope > .container");
  if (!container) return out;

  container
    .querySelectorAll(":scope > .about-card")
    .forEach((el) => out.push(el));
  container.querySelectorAll(":scope > .contact-grid > *").forEach((el) => {
    out.push(el);
  });

  container
    .querySelectorAll(":scope > .grid > *")
    .forEach((el) => out.push(el));

  return out;
}

function setupScrollReveals() {
  const sections = document.querySelectorAll(".section");
  if (prefersReducedMotion) {
    sections.forEach((sec) => sec.classList.add("section-visible"));
    return;
  }

  sections.forEach((sec) => {
    const targets = gatherRevealTargets(sec);
    targets.forEach((el, idx) => {
      el.classList.add("reveal-item");
      el.style.setProperty("--i", String(idx));
    });

    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("section-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -52px",
      }
    );

    obs.observe(sec);
  });
}

/** Active nav highlights */
function setupNavSections() {
  const navLinks = [...document.querySelectorAll(".nav a")];
  const pairs = [];

  navLinks.forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (!href.startsWith("#")) return;
    const raw = href.slice(1);
    const sectionEl =
      raw === "home"
        ? document.querySelector(".hero.section")
        : document.getElementById(raw);
    if (sectionEl?.classList.contains("section")) {
      pairs.push({ href, sectionEl });
    }
  });

  navLinks.forEach((l) => l.classList.remove("is-active"));
  navLinks
    .find((l) => l.getAttribute("href") === "#home")
    ?.classList.add("is-active");

  if (prefersReducedMotion || !pairs.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const match = pairs.find((p) => p.sectionEl === en.target);
        if (!match) return;
        navLinks.forEach((l) => l.classList.remove("is-active"));
        navLinks.forEach((l) => {
          if (l.getAttribute("href") === match.href) {
            l.classList.add("is-active");
          }
        });
      });
    },
    { rootMargin: "-38% 0px -52% 0px", threshold: 0 }
  );

  pairs.forEach((p) => observer.observe(p.sectionEl));
}

setupScrollReveals();
setupNavSections();

function setupTiltAndSpotlight() {
  if (prefersReducedMotion) return;
  const cards = document.querySelectorAll(
    ".project, .feature, .skill-block, .cert-card, .timeline, .collab-card, .hero-image.card, .contact-info"
  );
  cards.forEach((card) => {
    card.classList.add("tilt-card");
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y / rect.height) * 2 - 1) * 4;
      const ry = ((x / rect.width) * 2 - 1) * -4;
      card.style.transform = `perspective(900px) rotateX(${rx.toFixed(
        2
      )}deg) rotateY(${ry.toFixed(2)}deg) translateY(-5px)`;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      card.classList.add("is-hovered");
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.classList.remove("is-hovered");
    });
  });
}

function loadProfilePhoto() {
  if (!PROFILE_SLOTS.length) return;
  const candidates = [
    "profile.jpg",
    "profile.jpeg",
    "profile.png",
    "mypic.jpg",
    "mypic.png",
    "photo.jpg",
    "photo.png",
  ];
  let idx = 0;
  const tryNext = () => {
    if (idx >= candidates.length) return;
    const src = candidates[idx++];
    const img = new Image();
    img.onload = () => {
      PROFILE_SLOTS.forEach((wrap) => {
        const tag = wrap.querySelector(".profile-photo");
        if (!tag) return;
        tag.src = src;
        wrap.classList.add("has-photo");
      });
    };
    img.onerror = tryNext;
    img.src = src;
  };
  tryNext();
}

setupTiltAndSpotlight();
loadProfilePhoto();

if (!prefersReducedMotion && FOOTER) {
  const fobs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          FOOTER.classList.add("footer-visible");
          fobs.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );
  fobs.observe(FOOTER);
} else if (FOOTER) {
  FOOTER.classList.add("footer-visible");
}
