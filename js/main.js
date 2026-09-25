(function () {
  var titles = {
    ru: "Көркем Бала — центр раннего развития детей в Астане",
    kk: "Көркем Бала — Астанадағы балаларды ерте жастан дамыту орталығы"
  };
  var descriptions = {
    ru: "Центр раннего развития «Көркем Бала» в Астане: логопед, нейропсихолог, психолог, АФК, сенсорная интеграция, логомассаж и детский массаж. Улица Керей, Жәнібек хандар, 44/2, НП-3.",
    kk: "Астанадағы «Көркем Бала» ерте дамыту орталығы: логопед, нейропсихолог, психолог, АФК, сенсорлық интеграция, логомассаж және балалар массажы. Керей, Жәнібек хандар көшесі, 44/2, НП-3."
  };
  var waText = {
    ru: "Здравствуйте! Хочу записать ребёнка в центр «Көркем Бала».",
    kk: "Сәлеметсіз бе! Баламды «Көркем Бала» орталығына жазғым келеді."
  };

  var buttons = document.querySelectorAll(".lang-btn");
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");

  function apply(lang) {
    if (lang !== "ru" && lang !== "kk") lang = "ru";
    document.documentElement.lang = lang;
    document.title = titles[lang];
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", descriptions[lang]);
    buttons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === lang ? "true" : "false");
    });
    if (burger) burger.setAttribute("aria-label", lang === "kk" ? "Мәзір" : "Меню");
    var closeBtn = document.getElementById("lightbox-close");
    if (closeBtn) closeBtn.setAttribute("aria-label", lang === "kk" ? "Жабу" : "Закрыть");
    document.querySelectorAll(".js-alt").forEach(function (node) {
      var text = node.getAttribute(lang === "kk" ? "data-alt-kk" : "data-alt-ru");
      if (!text) return;
      if (node.tagName === "IMG") node.alt = text;
      else node.setAttribute("data-alt", text);
    });
    var href = "https://wa.me/77025327786?text=" + encodeURIComponent(waText[lang]);
    document.querySelectorAll(".js-wa").forEach(function (link) {
      link.href = href;
    });
    try {
      localStorage.setItem("korkem-lang", lang);
    } catch (e) {}
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      apply(btn.getAttribute("data-lang"));
    });
  });

  function closeNav() {
    if (!nav || !burger) return;
    nav.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }

  if (burger && nav) {
    burger.addEventListener("click", function (event) {
      event.stopPropagation();
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("open")) return;
      if (nav.contains(event.target) || burger.contains(event.target)) return;
      closeNav();
    });
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("open");
    lightboxImg.removeAttribute("src");
  }

  if (lightbox && lightboxImg) {
    document.querySelectorAll("[data-full]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        lightboxImg.src = btn.getAttribute("data-full");
        lightboxImg.alt = btn.getAttribute("data-alt") || "";
        lightbox.classList.add("open");
      });
    });
    var closeBtn = document.getElementById("lightbox-close");
    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeLightbox();
      closeNav();
    }
  });

  var saved = document.documentElement.lang || "ru";
  try {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "kk" || q === "ru") saved = q;
    else saved = localStorage.getItem("korkem-lang") || saved;
  } catch (e) {}
  apply(saved);
})();
