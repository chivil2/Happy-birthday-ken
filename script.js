/* ============================================================
   Happy 20th Birthday Ken — an Apothecary Diaries celebration
   ============================================================ */

// ---- Gallery photos: add more by dropping files in /images and listing them ----
const PHOTOS = [
  { src: "images/photo1.jpg", caption: "golden hour in the gardens" },
  { src: "images/photo2.jpg", caption: "cooler than the emperor" },
  { src: "images/photo3.jpg", caption: "exploring the outer court" },
];

const CONFETTI_COLORS = ["#f2b8c6", "#d4af5f", "#b23a48", "#4f9e8a", "#f7efdc", "#8e2a38"];
const LOCAL_KEY = "ken-bday-wishes";

const hasConfetti = typeof window.confetti === "function";
const fire = (opts) => {
  if (hasConfetti) window.confetti(Object.assign({ colors: CONFETTI_COLORS }, opts));
};

/* ================= INTRO: imperial scroll ================= */
const scroll = document.getElementById("scroll");
const introCard = document.getElementById("introCard");
const reveal = document.getElementById("reveal");
let opened = false;

scroll.addEventListener("click", () => {
  if (opened) return;
  opened = true;

  scroll.classList.add("open");

  const rect = scroll.getBoundingClientRect();
  const origin = {
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  };

  // scroll unrolls, confetti bursts, card flies away, reveal begins
  setTimeout(() => fire({ particleCount: 140, spread: 100, startVelocity: 42, origin }), 500);
  setTimeout(() => {
    introCard.classList.add("opened");
    reveal.classList.remove("hidden");
    fireworksShow(5500);
    timedVolleys();
  }, 1100);
});

function timedVolleys() {
  setTimeout(() => {
    fire({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } });
    fire({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } });
  }, 1100);
  setTimeout(() => {
    fire({ particleCount: 120, spread: 160, startVelocity: 40, origin: { y: 0.5 }, shapes: ["star"] });
  }, 1800);
}

function fireworksShow(duration) {
  const end = Date.now() + duration;
  (function launch() {
    fire({
      particleCount: 35 + Math.random() * 40,
      startVelocity: 28 + Math.random() * 20,
      spread: 360,
      ticks: 90,
      gravity: 0.9,
      origin: { x: 0.15 + Math.random() * 0.7, y: 0.2 + Math.random() * 0.4 },
      scalar: 0.9 + Math.random() * 0.5,
    });
    if (Date.now() < end) setTimeout(launch, 250 + Math.random() * 450);
  })();
}

/* ================= ENTER MAIN ================= */
document.getElementById("enterBtn").addEventListener("click", () => {
  document.getElementById("intro").classList.add("fade-out");
  document.getElementById("main").classList.remove("hidden");
  startPetals();
  fire({ particleCount: 100, spread: 120, origin: { y: 0.4 } });
});

/* ================= FALLING BLOSSOM PETALS ================= */
function startPetals() {
  const field = document.getElementById("petalField");
  for (let i = 0; i < 18; i++) {
    const p = document.createElement("div");
    p.className = "petal";
    const size = 8 + Math.random() * 12;
    p.style.width = size + "px";
    p.style.height = size * 0.7 + "px";
    p.style.left = Math.random() * 100 + "%";
    p.style.setProperty("--dur", 9 + Math.random() * 9 + "s");
    p.style.setProperty("--delay", Math.random() * 14 + "s");
    if (Math.random() < 0.25) {
      p.style.background = "radial-gradient(circle at 30% 30%, #ecd9a8, #d4af5f)";
    }
    field.appendChild(p);
  }
}

/* ================= CAKE & CANDLES ================= */
(function buildCake() {
  const holder = document.getElementById("candles");
  const candleColors = ["#b23a48", "#d4af5f", "#4f9e8a", "#f2b8c6", "#8e2a38"];
  const positions = [8, 28, 50, 72, 92]; // % across
  let lit = positions.length;

  positions.forEach((pos, i) => {
    const c = document.createElement("div");
    c.className = "candle";
    c.style.left = `calc(${pos}% - 5px)`;
    c.style.background = `repeating-linear-gradient(45deg, ${candleColors[i]}, ${candleColors[i]} 5px, #f7efdc 5px, #f7efdc 9px)`;

    const f = document.createElement("div");
    f.className = "flame";
    f.style.animationDelay = Math.random() * 0.3 + "s";
    c.appendChild(f);
    holder.appendChild(c);

    const blow = () => {
      if (c.classList.contains("out")) return;
      c.classList.add("out");
      const smoke = document.createElement("span");
      smoke.className = "smoke";
      c.appendChild(smoke);
      setTimeout(() => smoke.remove(), 1500);
      lit--;
      if (lit === 0) allCandlesOut();
    };
    f.addEventListener("click", blow);
    c.addEventListener("click", blow);
  });

  function allCandlesOut() {
    document.getElementById("wishMsg").classList.remove("hidden");
    const rect = document.getElementById("cake").getBoundingClientRect();
    const origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: rect.top / window.innerHeight,
    };
    fire({ particleCount: 200, spread: 130, startVelocity: 45, origin });
    setTimeout(() => fireworksShow(3500), 400);
  }
})();

/* ================= GALLERY (framed portraits) ================= */
(function buildGallery() {
  const gallery = document.getElementById("gallery");
  const tilts = ["tilt-l", "tilt-c", "tilt-r"];

  PHOTOS.forEach((photo, i) => {
    const card = document.createElement("figure");
    card.className = "portrait " + tilts[i % tilts.length];

    const tape = document.createElement("span");
    tape.className = "tape";

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption || "Birthday memory";
    img.loading = "lazy";
    img.onerror = () => { card.style.display = "none"; };

    const cap = document.createElement("figcaption");
    cap.textContent = photo.caption || "";

    card.appendChild(tape);
    card.appendChild(img);
    card.appendChild(cap);
    gallery.appendChild(card);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("visible"), i * 140);
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  gallery.querySelectorAll(".portrait").forEach((c) => observer.observe(c));
})();

/* ================= CONFETTI ON TAP ================= */
document.getElementById("main").addEventListener("pointerdown", (e) => {
  if (e.target.closest("button") || e.target.closest(".flame") || e.target.closest(".candle") || e.target.closest("a")) return;
  fire({
    particleCount: 25,
    spread: 70,
    startVelocity: 25,
    scalar: 0.8,
    origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
  });
});

/* ================= WISHES WALL (read-only for Ken) ================= */
(function wishesWall() {
  const wishesEl = document.getElementById("wishes");

  function localWishes() {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || []; }
    catch { return []; }
  }

  function renderWish(entry, isLocal) {
    const card = document.createElement("div");
    card.className = "wish-card";

    const tape = document.createElement("span");
    tape.className = "tape";
    card.appendChild(tape);

    if (entry.photo && /^data:image\//.test(entry.photo)) {
      const img = document.createElement("img");
      img.className = "wish-photo";
      img.src = entry.photo;
      img.alt = "photo from " + entry.name;
      img.loading = "lazy";
      card.appendChild(img);
    }

    const text = document.createElement("p");
    text.className = "wish-text";
    text.textContent = entry.message; // textContent = XSS-safe

    const name = document.createElement("p");
    name.className = "wish-name";
    name.textContent = "— " + entry.name;
    if (isLocal) {
      const tag = document.createElement("span");
      tag.className = "local-tag";
      tag.textContent = "  (this device)";
      name.appendChild(tag);
    }

    const seal = document.createElement("span");
    seal.className = "seal wish-seal";
    seal.textContent = String.fromCharCode(0x795D);

    card.appendChild(text);
    card.appendChild(name);
    card.appendChild(seal);
    return card;
  }

  function showEmpty() {
    const p = document.createElement("p");
    p.className = "wishes-empty";
    p.textContent = "tributes are on their way...";
    wishesEl.appendChild(p);
  }

  async function loadWishes() {
    wishesEl.innerHTML = "";
    const local = localWishes().map((m) => ({ ...m, local: true }));
    try {
      const r = await fetch("/api/messages");
      if (!r.ok) throw new Error();
      const data = await r.json();
      const all = [...local, ...(data.messages || [])];
      if (!all.length) return showEmpty();
      all.forEach((m) => wishesEl.appendChild(renderWish(m, m.local)));
    } catch {
      if (!local.length) return showEmpty();
      local.forEach((m) => wishesEl.appendChild(renderWish(m, true)));
    }
  }

  loadWishes();
})();

/* ================= MUSIC: Happy Birthday via Web Audio ================= */
const music = (() => {
  const NOTES = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0,
    A4: 440.0, Bb4: 466.16, C5: 523.25,
  };
  const MELODY = [
    ["C4", 0.75], ["C4", 0.25], ["D4", 1], ["C4", 1], ["F4", 1], ["E4", 2],
    ["C4", 0.75], ["C4", 0.25], ["D4", 1], ["C4", 1], ["G4", 1], ["F4", 2],
    ["C4", 0.75], ["C4", 0.25], ["C5", 1], ["A4", 1], ["F4", 1], ["E4", 1], ["D4", 2],
    ["Bb4", 0.75], ["Bb4", 0.25], ["A4", 1], ["F4", 1], ["G4", 1], ["F4", 2],
  ];
  const BEAT = 0.42;

  let ctx = null;
  let playing = false;
  let stopTimer = null;
  let nodes = [];

  function play() {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    playing = true;

    let t = ctx.currentTime + 0.05;
    let total = 0;
    MELODY.forEach(([note, beats]) => {
      const dur = beats * BEAT;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = NOTES[note];
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.03);
      gain.gain.setValueAtTime(0.22, t + dur * 0.7);
      gain.gain.linearRampToValueAtTime(0.0001, t + dur * 0.98);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur);
      nodes.push(osc);
      t += dur;
      total += dur;
    });

    stopTimer = setTimeout(() => {
      if (playing) play();
    }, total * 1000 + 600);
  }

  function stop() {
    playing = false;
    clearTimeout(stopTimer);
    nodes.forEach((n) => { try { n.stop(); } catch (e) {} });
    nodes = [];
  }

  return {
    toggle() {
      if (playing) { stop(); return false; }
      play(); return true;
    },
    get playing() { return playing; },
  };
})();

document.getElementById("musicToggle").addEventListener("click", function () {
  const on = music.toggle();
  this.classList.toggle("playing", on);
  document.getElementById("musicIcon").innerHTML = on ? "&#9836;" : "&#9835;";
});
