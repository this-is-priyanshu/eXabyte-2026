// Elements
const navbar = document.getElementById("navbar");
const navContainer = document.getElementById("navContainer");
const mobileContainer = document.getElementById("mobileContainer");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const menuIcon = document.getElementById("menuIcon");
const closeIcon = document.getElementById("closeIcon");
const mobileLinks = document.querySelectorAll(".mobile-link");
const navLinks = document.querySelectorAll(".nav-link");
const gooeyBg = document.getElementById("gooeyBg");
const navItems = document.getElementById("navItems");
const desktopBtn = document.getElementById("desktopBtn");

gsap.from(".status-badge", {
  opacity: 0,
  y: -20,
  duration: 1,
  ease: "power3.out",
});

gsap.from("h1", {
  opacity: 0,
  y: 30,
  duration: 1.2,
  delay: 0.2,
  ease: "power3.out",
});

gsap.from(".location", {
  opacity: 0,
  y: 20,
  duration: 1,
  delay: 0.4,
  ease: "power3.out",
});

gsap.from(".address", {
  opacity: 0,
  y: 20,
  duration: 1,
  delay: 0.5,
  ease: "power3.out",
});

gsap.from(".shiny-cta", {
  opacity: 0,
  scale: 0.9,
  duration: 1,
  delay: 0.7,
  ease: "back.out(1.7)",
});

gsap.from(".visualization svg", {
  opacity: 0,
  scale: 0.95,
  duration: 1.5,
  delay: 0.3,
  ease: "power3.out",
});

// Button interaction
const ctaButton = document.querySelector(".shiny-cta");
ctaButton.addEventListener("click", () => {
  gsap.to(ctaButton, {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut",
  });
});

let isMobileMenuOpen = false;

// Desktop animations
gsap.fromTo(
  navContainer,
  {
    width: "100%",
    y: 0,
    background: "transparent",
    backdropFilter: "none",
    boxShadow: "none",
    duration: 1,
    ease: "power2.out",
  },
  {
    width: "50%",
    y: 10,
    background: "rgba(10, 10, 10, 0.8)",
    backdropFilter: "blur(10px)",
    boxShadow:
      "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset",
    duration: 1,
    delay: 1,
    ease: "power2.out",
  }
);

// Mobile animations
gsap.fromTo(
  mobileContainer,
  {
    width: "100%",
    y: 0,
    background: "transparent",
    backdropFilter: "none",
    boxShadow: "none",
    borderRadius: "2rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    duration: 1,
    ease: "power2.out",
  },
  {
    width: "90%",
    y: 10,
    background: "rgba(10, 10, 10, 0.8)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05)",
    borderRadius: "1rem",
    paddingLeft: "0.75rem",
    paddingRight: "0.75rem",
    duration: 1,
    delay: 1,
    ease: "power2.out",
  }
);

// Gooey Hover Effect
navLinks.forEach((link) => {
  link.addEventListener("mouseenter", function () {
    const rect = this.getBoundingClientRect();
    const parentRect = navItems.getBoundingClientRect();

    gsap.to(gooeyBg, {
      left: rect.left - parentRect.left,
      width: rect.width,
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  link.addEventListener("mouseleave", function () {
    gsap.to(link, {
      color: "#d4d4d8",
      duration: 0.2,
    });
  });

  link.addEventListener("mouseenter", function () {
    gsap.to(link, {
      color: "#ffffff",
      duration: 0.2,
    });
  });
});

navItems.addEventListener("mouseleave", () => {
  gsap.to(gooeyBg, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.out",
  });
});

// Button Hover
desktopBtn.addEventListener("mouseenter", function () {
  gsap.to(this, {
    y: -2,
    duration: 0.2,
    ease: "power2.out",
  });
});

desktopBtn.addEventListener("mouseleave", function () {
  gsap.to(this, {
    y: 0,
    duration: 0.2,
    ease: "power2.out",
  });
});

// Mobile Menu Toggle
menuToggle.addEventListener("click", () => {
  isMobileMenuOpen = !isMobileMenuOpen;

  if (isMobileMenuOpen) {
    mobileMenu.classList.add("open");

    // Animate menu open
    gsap.fromTo(
      mobileMenu,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
    );

    // Animate menu items (POP effect)
    gsap.fromTo(
      mobileMenu.children,
      {
        opacity: 0,
        scale: 0.9,
        y: 6,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: "back.out(1.4)",
      }
    );

    // Toggle icons
    gsap.to(menuIcon, {
      opacity: 0,
      rotation: 90,
      duration: 0.3,
      onComplete: () => (menuIcon.style.visibility = "hidden"),
    });
    gsap.to(closeIcon, {
      opacity: 1,
      rotation: 0,
      visibility: "visible",
      duration: 0.3,
    });
  } else {
    // Animate menu close
    gsap.to(mobileMenu, {
      opacity: 0,
      scale: 0.85,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => mobileMenu.classList.remove("open"),
    });

    // Toggle icons
    gsap.to(closeIcon, {
      opacity: 0,
      rotation: -90,
      duration: 0.3,
      onComplete: () => (closeIcon.style.visibility = "hidden"),
    });
    gsap.to(menuIcon, {
      opacity: 1,
      rotation: 0,
      visibility: "visible",
      duration: 0.3,
    });
  }
});

// Close mobile menu on link click
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (isMobileMenuOpen) {
      isMobileMenuOpen = false;

      gsap.to(mobileMenu, {
        opacity: 0,
        scale: 0.85,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => mobileMenu.classList.remove("open"),
      });

      gsap.to(closeIcon, {
        opacity: 0,
        rotation: -90,
        duration: 0.3,
        onComplete: () => (closeIcon.style.visibility = "hidden"),
      });
      gsap.to(menuIcon, {
        opacity: 1,
        rotation: 0,
        visibility: "visible",
        duration: 0.3,
      });
    }
  });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 70 },
        duration: 0.8,
        ease: "power2.inOut",
      });
    }
  });
});

