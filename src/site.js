const isArabic = document.documentElement.lang === "ar";

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("motion-ready");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const menuButton = document.querySelector("#menu-toggle");
const siteNavigation = document.querySelector(".site-nav");

if (menuButton && siteNavigation) {
  const closeMenu = ({ restoreFocus = false } = {}) => {
    menuButton.setAttribute("aria-expanded", "false");
    siteNavigation.classList.remove("is-open");
    if (restoreFocus) menuButton.focus();
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    siteNavigation.classList.toggle("is-open", !isOpen);
  });

  siteNavigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu({ restoreFocus: true });
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (!siteNavigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
}

const briefFields = document.querySelector(".brief-form");
const sendButton = document.querySelector("#review-brief");
const result = document.querySelector("#brief-result");
const briefText = document.querySelector("#brief-text");
const copyButton = document.querySelector("#copy-brief");
const copyStatus = document.querySelector("#copy-status");

const messages = isArabic
  ? {
      title: "طلب مشروع من موقع Raqmio",
      name: "الاسم",
      company: "الشركة",
      email: "البريد الإلكتروني",
      need: "الاحتياج",
      service: "الخدمة",
      timeline: "موعد البدء",
      details: "تفاصيل إضافية",
      timelines: { soon: "قريبًا", planning: "خلال التخطيط", exploring: "أستكشف الخيارات" },
      fallback: "إذا لم يفتح واتساب تلقائيًا، اضغط هذا الرابط للمتابعة",
      unavailable: "تعذر تجهيز رابط واتساب. اتصل بـRaqmio مباشرة.",
      opened: "رسالتك جاهزة. راجعها في واتساب واضغط إرسال لإكمال التواصل.",
      copied: "تم نسخ ملخص المشروع.",
      copyFailed: "تعذر النسخ. حدد الملخص أعلاه وانسخه يدويًا."
    }
  : {
      title: "Raqmio website project inquiry",
      name: "Name",
      company: "Company",
      email: "Email",
      need: "Business need",
      service: "Service",
      timeline: "Timing",
      details: "Additional details",
      timelines: { soon: "Soon", planning: "I am planning", exploring: "I am exploring" },
      fallback: "If WhatsApp did not open, use this link to continue",
      unavailable: "We could not prepare the WhatsApp link. Call Raqmio directly.",
      opened: "Your message is ready. Review it in WhatsApp and press Send to contact Raqmio.",
      copied: "Project brief copied.",
      copyFailed: "Copy was unavailable. Select and copy the brief above."
    };

function getWhatsAppUrl() {
  const phoneLink = document.querySelector('a[href^="tel:"]');
  const localPhone = (phoneLink?.getAttribute("href") ?? "").replace(/^tel:/i, "").replace(/\D/g, "");

  // Egyptian mobile numbers use +20 internationally; drop the domestic leading zero for wa.me.
  if (!/^01\d{9}$/.test(localPhone)) return null;
  const internationalNumber = `20${localPhone.slice(1)}`;
  const configuredUrl = sendButton?.dataset.whatsappHref;
  const destination = configuredUrl ? new URL(configuredUrl) : new URL(`https://wa.me/${internationalNumber}`);

  if (destination.origin !== "https://wa.me" || destination.pathname !== `/${internationalNumber}`) return null;
  return destination;
}

function createWhatsAppFallbackLink() {
  let link = document.querySelector("#whatsapp-fallback");
  if (link) return link;

  link = document.createElement("a");
  link.id = "whatsapp-fallback";
  link.className = "button button--quiet whatsapp-fallback";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.hidden = true;
  link.textContent = messages.fallback;

  const insertionPoint = copyButton ?? result;
  insertionPoint?.insertAdjacentElement("beforebegin", link);
  return link;
}

if (briefFields && sendButton && result && briefText) {
  const fallbackLink = createWhatsAppFallbackLink();
  let openingWhatsApp = false;

  sendButton.addEventListener("click", () => {
    if (openingWhatsApp) return;

    const fields = [...briefFields.querySelectorAll("input, select, textarea")];
    const invalidField = fields.find((field) => !field.checkValidity());
    if (invalidField) {
      invalidField.reportValidity();
      invalidField.focus();
      return;
    }

    const destination = getWhatsAppUrl();
    if (!destination) {
      result.hidden = false;
      copyStatus.textContent = messages.unavailable;
      fallbackLink.hidden = true;
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }

    const values = Object.fromEntries(fields.map((field) => [field.name, field.value.trim()]));
    const service = briefFields.querySelector('[name="service"]');
    const lines = [
      messages.title,
      `${messages.name}: ${values.name}`,
      ...(values.company ? [`${messages.company}: ${values.company}`] : []),
      `${messages.email}: ${values.email}`,
      `${messages.need}: ${values.need}`,
      `${messages.service}: ${service?.selectedOptions[0]?.textContent?.trim() ?? values.service}`,
      `${messages.timeline}: ${messages.timelines[values.timeline] ?? values.timeline}`,
      ...(values.details ? [`${messages.details}: ${values.details}`] : [])
    ];

    const message = lines.join("\n");
    // encodeURIComponent keeps spaces as %20 (URLSearchParams would use "+", which some WhatsApp clients show literally).
    const whatsappUrl = new URL(`${destination.origin}${destination.pathname}?text=${encodeURIComponent(message)}`);
    fallbackLink.href = whatsappUrl.href;
    fallbackLink.hidden = false;
    briefText.textContent = message;
    result.hidden = false;
    copyStatus.textContent = messages.opened;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });

    // The user's click opens the prefilled chat; noopener prevents the destination controlling this page.
    window.open(whatsappUrl.href, "_blank", "noopener,noreferrer");
    openingWhatsApp = true;
    sendButton.disabled = true;
    window.setTimeout(() => {
      openingWhatsApp = false;
      sendButton.disabled = false;
    }, 1200);
  });
}

if (copyButton && briefText && copyStatus) {
  copyButton.addEventListener("click", async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(briefText.textContent);
      copyStatus.textContent = messages.copied;
    } catch {
      copyStatus.textContent = messages.copyFailed;
    }
  });
}

/* Hero stage: gentle pointer parallax on devices that have a real pointer */
(() => {
  const stage = document.getElementById("hero-stage");
  if (!stage || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layers = [...stage.querySelectorAll("[data-depth]")];
  const host = stage.closest(".hero-full") || stage;
  let raf = 0;
  host.addEventListener("pointermove", (e) => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / r.width;
    const y = (e.clientY - (r.top + r.height / 2)) / r.height;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => layers.forEach((el) => {
      const d = Number(el.dataset.depth) || 0;
      el.style.setProperty("--px", `${(-x * d).toFixed(1)}px`);
      el.style.setProperty("--py", `${(-y * d).toFixed(1)}px`);
    }));
  });
  host.addEventListener("pointerleave", () => layers.forEach((el) => { el.style.setProperty("--px", "0px"); el.style.setProperty("--py", "0px"); }));
})();
