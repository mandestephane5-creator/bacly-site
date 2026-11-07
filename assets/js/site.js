/* Bacly : comportements du site (les liens se règlent dans config.js) */
(function () {
  "use strict";

  const C = window.BACLY_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const txt = (s) => String(s || "").trim();
  const reduit = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const apk = txt(C.apk), web = txt(C.web), mail = txt(C.email);
  const wa = String(C.whatsapp || "").replace(/\D/g, "");
  const waLien = (msg) => "https://wa.me/" + wa + (msg ? "?text=" + encodeURIComponent(msg) : "");

  /* ---------- 1. Liens depuis config.js ---------- */
  $$("[data-lien]").forEach((el) => {
    const url = el.dataset.lien === "apk" ? apk : web;
    if (url) {
      el.href = url;
      if (el.dataset.lien === "web") { el.target = "_blank"; el.rel = "noopener"; }
      return;
    }
    // lien pas encore rempli : bouton gardé, désactivé, avec un message
    el.removeAttribute("href");
    el.setAttribute("aria-disabled", "true");
    const s = $("span", el);
    if (s && el.dataset.vide) s.textContent = el.dataset.vide;
  });
  if (web) $$("[data-lien-app]").forEach((el) => { el.href = web; el.target = "_blank"; el.rel = "noopener"; });
  $$("[data-wa]").forEach((el) => {
    if (!wa) { const li = el.closest("[data-ligne]"); return (li || el).remove(); }
    el.href = waLien(el.dataset.waMsg || "Bonjour Bacly, ");
    el.target = "_blank"; el.rel = "noopener";
  });
  $$("[data-email]").forEach((el) => {
    if (!mail) { const li = el.closest("[data-ligne]"); return (li || el).remove(); }
    el.href = "mailto:" + mail; el.textContent = mail;
  });
  const rond = $("#barreRond");
  if (rond && wa) { rond.href = waLien("Bonjour Bacly, "); rond.target = "_blank"; rond.rel = "noopener"; rond.setAttribute("aria-label", "Écrire sur WhatsApp"); }
  $$("[data-annee]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- 2. Menu sur téléphone ---------- */
  const burger = $(".burger"), menu = $("#menu-mobile");
  if (burger && menu) {
    const ouvrir = (on) => {
      menu.hidden = !on;
      burger.setAttribute("aria-expanded", String(on));
      burger.setAttribute("aria-label", on ? "Fermer le menu" : "Ouvrir le menu");
      $("use", burger).setAttribute("href", on ? "#i-fermer" : "#i-menu");
    };
    burger.addEventListener("click", () => ouvrir(menu.hidden));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => ouvrir(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { ouvrir(false); burger.focus(); } });
  }

  /* ---------- 3. Choix de l'appareil ---------- */
  const SYSTEMES = {
    android: { lien: apk, bouton: "Télécharger l'APK", icone: "#i-telecharger", aide: "Ouvre le fichier téléchargé, puis <b>autorise l'installation</b> si le téléphone le demande.", vide: "Le lien de l'APK sera ajouté très bientôt." },
    iphone: { lien: web, bouton: "Ouvrir Bacly web", icone: "#i-web", aide: "Dans <b>Safari</b> : Partager, puis « Sur l'écran d'accueil ».", vide: "La version web sera en ligne très bientôt." },
    ordinateur: { lien: web, bouton: "Ouvrir la version web", icone: "#i-web", aide: "Fonctionne dans <b>Chrome, Edge ou Firefox</b>.", vide: "La version web sera en ligne très bientôt." },
  };
  const boutons = $$("[data-systeme]"), btn = $("#prendreBtn"), aide = $("#prendreAide");
  function choisir(k) {
    const s = SYSTEMES[k];
    boutons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.systeme === k)));
    $$("[data-appareil]").forEach((c) => c.classList.toggle("appareil-mis", c.dataset.appareil === k));
    $("span", btn).textContent = s.bouton;
    $("use", btn).setAttribute("href", s.icone);
    if (s.lien) {
      btn.href = s.lien;
      if (k === "android") btn.removeAttribute("target"); else { btn.target = "_blank"; btn.rel = "noopener"; }
      aide.innerHTML = s.aide;
    } else {
      btn.href = "#installer"; btn.removeAttribute("target");
      aide.innerHTML = s.aide + " " + s.vide;
    }
  }
  if (btn) {
    boutons.forEach((b) => b.addEventListener("click", () => choisir(b.dataset.systeme)));
    const ua = navigator.userAgent;
    choisir(/iPhone|iPad|iPod/i.test(ua) ? "iphone" : /Android/i.test(ua) ? "android" : matchMedia("(pointer: fine)").matches ? "ordinateur" : "android");
  }

  /* ---------- 4. Apparitions au défilement ---------- */
  const aVoir = $$(".monte, .etagere, .conversation");
  if (!("IntersectionObserver" in window) || reduit) aVoir.forEach((el) => el.classList.add("vu"));
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("vu"); io.unobserve(e.target);
    }), { rootMargin: "0px 0px -8% 0px" });
    aVoir.forEach((el) => io.observe(el));
    // classeurs : l'un après l'autre
    $$(".etagere .classeur").forEach((c, i) => (c.style.transitionDelay = i * 60 + "ms"));
    // notes de la fiche : un léger décalage
    $$(".notes").forEach((n) => $$(".note", n).forEach((x, i) => (x.style.transitionDelay = i * 90 + "ms")));
  }
  // une fois entrés, les classeurs réagissent tout de suite au survol
  $$(".etagere .classeur").forEach((c) => c.addEventListener("transitionend", () => (c.style.transitionDelay = ""), { once: true }));

  /* ---------- 5. Fiche annotée : la note survolée éclaire la zone de l'écran ---------- */
  $$("[data-cible]").forEach((n) => {
    const zone = $('.cible[data-zone="' + n.dataset.cible + '"]');
    if (!zone) return;
    const on = (v) => { zone.classList.toggle("eclaire", v); n.classList.toggle("actif", v); };
    n.addEventListener("mouseenter", () => on(true));
    n.addEventListener("mouseleave", () => on(false));
  });

  /* ---------- 6. Chrono d'épreuve : horloge de salle d'examen (démonstration) ---------- */
  const temps = $("#temps"), zoneChrono = $("#chronoZone");
  if (temps) {
    const NS = "http://www.w3.org/2000/svg";
    const grad = $("#graduations");
    const pt = (deg, r) => { const a = (deg * Math.PI) / 180; return [100 + r * Math.sin(a), 100 - r * Math.cos(a)]; };
    for (let i = 0; i < 60; i++) {
      const heure = i % 5 === 0, [x1, y1] = pt(i * 6, heure ? 80 : 84), [x2, y2] = pt(i * 6, 90);
      const l = document.createElementNS(NS, "line");
      l.setAttribute("x1", x1.toFixed(2)); l.setAttribute("y1", y1.toFixed(2));
      l.setAttribute("x2", x2.toFixed(2)); l.setAttribute("y2", y2.toFixed(2));
      l.setAttribute("stroke", heure ? "#0A1F22" : "#9FB8B4");
      l.setAttribute("stroke-width", heure ? "2.6" : "1");
      l.setAttribute("stroke-linecap", "round");
      grad.appendChild(l);
    }
    [[12, 0], [3, 90], [6, 180], [9, 270]].forEach(([n, deg]) => {
      const [x, y] = pt(deg, 68), t = document.createElementNS(NS, "text");
      t.setAttribute("x", x.toFixed(2)); t.setAttribute("y", (y + 6).toFixed(2));
      t.setAttribute("text-anchor", "middle"); t.setAttribute("font-size", "17");
      t.setAttribute("font-family", "Instrument Serif, Georgia, serif"); t.setAttribute("fill", "#0A1F22");
      t.textContent = n; grad.appendChild(t);
    });

    const DEBUT = 8 * 3600;               // l'épreuve de démonstration commence à 8 h
    const secteur = $("#secteur"), arc = $("#arc");
    const aigH = $("#aig-h"), aigM = $("#aig-m"), aigS = $("#aig-s"), plage = $("#plage");
    let total = 4 * 3600, depart = Date.now();
    const deux = (n) => String(n).padStart(2, "0");
    const angleH = (s) => ((s / 3600) % 12) * 30;

    function dessiner(reste) {
      const ecoule = total - reste, maintenant = DEBUT + ecoule;
      const a0 = angleH(maintenant), a1 = a0 + (reste / 3600) * 30;
      const [x0, y0] = pt(a0, 90), [x1, y1] = pt(a1, 90), grand = a1 - a0 > 180 ? 1 : 0;
      if (reste > 0) {
        secteur.setAttribute("d", `M100 100L${x0.toFixed(2)} ${y0.toFixed(2)}A90 90 0 ${grand} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}Z`);
        arc.setAttribute("d", `M${x0.toFixed(2)} ${y0.toFixed(2)}A90 90 0 ${grand} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`);
      } else { secteur.setAttribute("d", ""); arc.setAttribute("d", ""); }
      aigH.setAttribute("transform", `rotate(${a0.toFixed(2)} 100 100)`);
      aigM.setAttribute("transform", `rotate(${(((maintenant / 60) % 60) * 6).toFixed(2)} 100 100)`);
      aigS.setAttribute("transform", `rotate(${((maintenant % 60) * 6).toFixed(2)} 100 100)`);
    }
    const tic = () => {
      const reste = Math.max(0, total - Math.floor((Date.now() - depart) / 1000));
      temps.textContent = Math.floor(reste / 3600) + ":" + deux(Math.floor(reste / 60) % 60) + ":" + deux(reste % 60);
      zoneChrono.classList.toggle("fin", reste <= 15 * 60);
      dessiner(reste);
    };
    $$("[data-duree]").forEach((b) => b.addEventListener("click", () => {
      const h = Number(b.dataset.duree);
      total = h * 3600; depart = Date.now();
      $$("[data-duree]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      plage.textContent = "8 h et finit à " + (8 + h) + " h";
      tic();
    }));
    tic();
    setInterval(tic, 1000);
  }

  /* ---------- 7. Formulaire « Écris-nous » ---------- */
  const form = $("#ecrire");
  if (form) {
    const err = $("#ecrireErr"), envoi = $("#ecrireBtn");
    if (wa) envoi.innerHTML = '<svg class="ico"><use href="#i-bulle"/></svg>Envoyer sur WhatsApp';
    else if (mail) envoi.innerHTML = '<svg class="ico"><use href="#i-lettre"/></svg>Envoyer par e-mail';
    const TYPES = { sujet: "Demande de sujet", probleme: "Problème à signaler", autre: "Question" };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      err.hidden = true;
      const f = form.elements;
      if (txt(f.prenom.value).length < 2) { err.textContent = "Indique ton prénom."; err.hidden = false; return f.prenom.focus(); }
      if (txt(f.message.value).length < 3) { err.textContent = "Écris ton message."; err.hidden = false; return f.message.focus(); }
      const corps = "Bonjour Bacly,\n\n" + TYPES[f.type.value] + "\nPrénom : " + txt(f.prenom.value) + "\n\n" + txt(f.message.value);
      if (wa) window.open(waLien(corps), "_blank", "noopener");
      else if (mail) location.href = "mailto:" + mail + "?subject=" + encodeURIComponent("Bacly : " + TYPES[f.type.value]) + "&body=" + encodeURIComponent(corps);
      else { err.textContent = "Le formulaire n'est pas encore relié : ajoute le numéro WhatsApp ou l'e-mail de Bacly dans assets/js/config.js."; err.hidden = false; return; }
      envoi.innerHTML = '<svg class="ico"><use href="#i-coche"/></svg>Message prêt, il reste à l\'envoyer';
    });
  }
})();
