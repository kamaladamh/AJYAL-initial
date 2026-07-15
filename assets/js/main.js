(function () {
  var nav = document.querySelector("[data-nav]");
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navMenu = document.querySelector("[data-nav-menu]");
  var canvas = document.querySelector("[data-hero-canvas]");
  var routeTabs = Array.prototype.slice.call(document.querySelectorAll("[data-route-tab]"));
  var routeInput = document.querySelector("[data-route-input]");
  var formTitle = document.querySelector("[data-form-title]");
  var messageLabel = document.querySelector("[data-message-label]");
  var submitLabel = document.querySelector("[data-submit-label]");
  var form = document.querySelector("[data-lead-form]");
  var statusBox = document.querySelector("[data-form-status]");

  var routeCopy = {
    SolarCheck: {
      title: "REQUEST A SOLARCHECK",
      label: "Building details / location",
      submit: "Submit SolarCheck Request"
    },
    Consultation: {
      title: "BOOK A CONSULTATION",
      label: "Project brief",
      submit: "Book Consultation"
    },
    Presentation: {
      title: "BOOK A PRESENTATION",
      label: "Team and project context",
      submit: "Request Presentation"
    }
  };

  function updateNav() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 36);
  }

  function closeMenu() {
    if (!nav || !navMenu || !navToggle) return;
    nav.classList.remove("is-open");
    navMenu.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    var label = navToggle.querySelector(".sr-only");
    if (label) label.textContent = "Open menu";
  }

  function setRoute(route) {
    var copy = routeCopy[route] || routeCopy.SolarCheck;
    routeTabs.forEach(function (tab) {
      var active = tab.getAttribute("data-route-tab") === route;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    if (routeInput) routeInput.value = route;
    if (formTitle) formTitle.textContent = copy.title;
    if (messageLabel) messageLabel.textContent = copy.label;
    if (submitLabel) submitLabel.textContent = copy.submit;
  }

  function showStatus(message, isError) {
    if (!statusBox) return;
    statusBox.textContent = message;
    statusBox.classList.add("is-visible");
    statusBox.classList.toggle("is-error", !!isError);
  }

  function drawHeroCanvas() {
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var frame = 0;
    var animationId = 0;

    function resize() {
      canvas.width = Math.max(canvas.clientWidth, 1);
      canvas.height = Math.max(canvas.clientHeight, 1);
    }

    function draw() {
      var width = canvas.width;
      var height = canvas.height;
      var cols = 16;
      var rows = 10;
      var cw = width / cols;
      var ch = height / rows;
      ctx.clearRect(0, 0, width, height);

      for (var c = 0; c < cols; c += 1) {
        for (var r = 0; r < rows; r += 1) {
          var wave = Math.sin(frame * 0.015 + c * 0.4 + r * 0.3) * 0.5 + 0.5;
          var gold = (c + r) % 7 === 0;
          var alpha = 0.03 + wave * (gold ? 0.12 : 0.055);
          ctx.fillStyle = gold ? "rgba(211,173,122," + alpha + ")" : "rgba(252,252,252," + alpha + ")";
          ctx.fillRect(c * cw + 1, r * ch + 1, cw - 2, ch - 2);
        }
      }

      for (var i = 0; i < 5; i += 1) {
        var x = width * 0.55 + i * 38;
        var waveY = Math.sin(frame * 0.012 + i * 0.6) * 8;
        var panelWidth = 18;
        var panelHeight = height * (0.45 + i * 0.07) + waveY;
        var gradient = ctx.createLinearGradient(x, height, x, 80 + waveY);
        gradient.addColorStop(0, "rgba(211,173,122,0)");
        gradient.addColorStop(0.5, "rgba(211,173,122," + (0.05 + i * 0.014) + ")");
        gradient.addColorStop(1, "rgba(252,252,252," + (0.08 + i * 0.02) + ")");
        ctx.fillStyle = gradient;
        ctx.save();
        ctx.translate(x, height - panelHeight);
        ctx.beginPath();
        ctx.moveTo(0, panelHeight);
        ctx.lineTo(panelWidth, panelHeight);
        ctx.lineTo(panelWidth * 0.7, 0);
        ctx.lineTo(panelWidth * 0.3, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      frame += 1;
      animationId = window.requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("beforeunload", function () {
      window.cancelAnimationFrame(animationId);
    });
  }

  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });

  if (navToggle && navMenu && nav) {
    navToggle.addEventListener("click", function () {
      var open = !navMenu.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      navMenu.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      var label = navToggle.querySelector(".sr-only");
      if (label) label.textContent = open ? "Close menu" : "Open menu";
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", function (event) {
    var anchor = event.target.closest("a[href^='#']");
    if (!anchor) return;
    if (anchor.getAttribute("href") === "#") {
      event.preventDefault();
      return;
    }
    var route = anchor.getAttribute("data-route");
    if (route) setRoute(route === "solarcheck" ? "SolarCheck" : route);
    closeMenu();
  });

  routeTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      setRoute(tab.getAttribute("data-route-tab"));
    });
  });

  Array.prototype.slice.call(document.querySelectorAll("[data-collection]")).forEach(function (card) {
    card.addEventListener("click", function () {
      Array.prototype.slice.call(document.querySelectorAll("[data-collection]")).forEach(function (item) {
        item.classList.remove("is-active");
      });
      card.classList.add("is-active");
    });
  });

  if (form) {
    form.addEventListener("submit", function (event) {
      if (!window.fetch) return;
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      showStatus("Sending your request...", false);
      fetch(form.getAttribute("action"), {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (!data.ok) throw new Error(data.message || "Unable to send request.");
          showStatus("Request received. The right AJYAL specialist will be in touch within one business day.", false);
          form.reset();
          setRoute("SolarCheck");
        })
        .catch(function (error) {
          showStatus(error.message || "Unable to send request. Please email sales@ajyal.com.sa.", true);
        });
    });
  }

  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  }

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  } else {
    drawHeroCanvas();
  }
})();
