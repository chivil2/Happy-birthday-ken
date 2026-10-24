/* ============================================================
   Happy Birthday Ken — interactive celebration
   ============================================================ */

// ---- Photos: add more by dropping files in /images and listing them here ----
const PHOTOS = [
  { src: "images/photo1.jpg", caption: "Golden hour, golden person" },
  { src: "images/photo2.jpg", caption: "Cooling down like a star" },
  { src: "images/photo3.jpg", caption: "Adventure mode: on" },
];

const NAME = "Ken";
const CONFETTI_COLORS = ["#ffd166", "#ef476f", "#9b5de5", "#06d6a0", "#118ab2", "#fff8f0"];

const hasConfetti = typeof window.confetti === "function";
const fire = (opts) => {
  if (hasConfetti) window.confetti(Object.assign({ colors: CONFETTI_COLORS }, opts));
};

/* ================= INTRO: stars ================= */
(function buildStars() {
  const field = document.getElementById("introStars");
  for (let i = 0; i < 90; i++) {
    const s = document.createElement("span");
    s.className = "star";
    const size = Math.random() * 2.5 + 1;
    s.style.width = s.style.height = size + "px";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.setProperty("--tw-dur", Math.random() * 3 + 2 + "s");
    s.style.animationDelay = Math.random() * 3 + "s";
    field.appendChild(s);
  }
})();

/* ================= INTRO: gift opening ================= */
const gift = document.getElementById("gift");
const giftStage = document.getElementById("giftStage");
const reveal = document.getElementById("reveal");
let opened = false;

gift.addEventListener("click", () => {
  if (opened) return;
  opened = true;

  // burst from the gift itself
  const rect = gift.getBoundingClientRect();
  const origin = {
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  };
  fire({ particleCount: 160, spread: 100, startVelocity: 45, origin });

  giftStage.classList.add("opened");

  setTimeout(() => {
    reveal.classList.remove("hidden");
    revealName();
    fireworksShow(6000);
  }, 500);
});

function revealName() {
  // staggered "HAPPY BIRTHDAY" letters
  const line = document.getElementById("hbLine");
  "HAPPY BIRTHDAY".split("").forEach((ch, i) => {
    const span = document.createElement("span");
    if (ch === " ") {
      span.className = "space";
    } else {
      span.className = "letter";
      span.textContent = ch;
      span.style.animationDelay = 0.05 * i + "s";
    }
    line.appendChild(span);
  });

  const nameEl = document.getElementById("nameText");
  nameEl.textContent = NAME;
  nameEl.style.animationDelay = "0.9s";
  document.getElementById("ageLine").style.animationDelay = "1.7s";
  document.getElementById("enterBtn").style.animationDelay = "2.2s";

  // celebratory volleys timed with the reveal
  setTimeout(() => {
    fire({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } });
    fire({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } });
  }, 900);
  setTimeout(() => {
    fire({ particleCount: 120, spread: 160, startVelocity: 40, origin: { y: 0.5 }, shapes: ["star"] });
  }, 1500);
}

function fireworksShow(duration) {
  const end = Date.now() + duration;
  (function launch() {
    fire({
      particleCount: 40 + Math.random() * 40,
      startVelocity: 30 + Math.random() * 20,
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
  startBalloons();
  fire({ particleCount: 100, spread: 120, origin: { y: 0.4 } });
});

/* ================= BALLOONS ================= */
function startBalloons() {
  const field = document.getElementById("balloonField");
  const colors = ["#ef476f", "#ffd166", "#9b5de5", "#06d6a0", "#118ab2", "#f78c6b"];
  for (let i = 0; i < 14; i++) {
    const b = document.createElement("div");
    b.className = "balloon";
    const c = colors[i % colors.length];
    b.style.background = `radial-gradient(circle at 35% 30%, ${c}dd, ${c})`;
    b.style.left = Math.random() * 95 + "%";
    b.style.setProperty("--dur", 11 + Math.random() * 10 + "s");
    b.style.setProperty("--delay", Math.random() * 12 + "s");
    const scale = 0.6 + Math.random() * 0.7;
    b.style.width = 52 * scale + "px";
    b.style.height = 66 * scale + "px";
    field.appendChild(b);
  }
}

/* ================= CAKE & CANDLES ================= */
(function buildCake() {
  const holder = document.getElementById("candles");
  const candleColors = ["#ef476f", "#06d6a0", "#118ab2", "#ffd166", "#9b5de5"];
  const positions = [8, 28, 50, 72, 92]; // % across
  let lit = positions.length;

  positions.forEach((pos, i) => {
    const c = document.createElement("div");
    c.className = "candle";
    c.style.left = `calc(${pos}% - 5px)`;
    c.style.background = `repeating-linear-gradient(45deg, ${candleColors[i]}, ${candleColors[i]} 5px, #fff 5px, #fff 9px)`;

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

/* ================= GALLERY ================= */
(function buildGallery() {
  const gallery = document.getElementById("gallery");

  PHOTOS.forEach((photo) => {
    const card = document.createElement("figure");
    card.className = "photo-card";

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption || "Birthday memory";
    img.loading = "lazy";
    img.onerror = () => {
      card.style.display = "none"; // skip missing files silently
    };

    const frame = document.createElement("span");
    frame.className = "frame";

    card.appendChild(img);
    card.appendChild(frame);

    if (photo.caption) {
      const cap = document.createElement("figcaption");
      cap.className = "caption";
      cap.textContent = photo.caption;
      card.appendChild(cap);
    }
    gallery.appendChild(card);
  });

  // reveal on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("visible"), i * 120);
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  gallery.querySelectorAll(".photo-card").forEach((c) => observer.observe(c));
})();

/* ================= CONFETTI ON TAP ================= */
document.getElementById("main").addEventListener("pointerdown", (e) => {
  if (e.target.closest("button") || e.target.closest(".flame") || e.target.closest(".candle")) return;
  fire({
    particleCount: 25,
    spread: 70,
    startVelocity: 25,
    scalar: 0.8,
    origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
  });
});

/* ================= MUSIC: Happy Birthday via Web Audio ================= */
const music = (() => {
  const NOTES = {
    G3: 196.0, A3: 220.0, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0,
    A4: 440.0, Bb4: 466.16, C5: 523.25,
  };
  // [note, beats]
  const MELODY = [
    ["C4", 0.75], ["C4", 0.25], ["D4", 1], ["C4", 1], ["F4", 1], ["E4", 2],
    ["C4", 0.75], ["C4", 0.25], ["D4", 1], ["C4", 1], ["G4", 1], ["F4", 2],
    ["C4", 0.75], ["C4", 0.25], ["C5", 1], ["A4", 1], ["F4", 1], ["E4", 1], ["D4", 2],
    ["Bb4", 0.75], ["Bb4", 0.25], ["A4", 1], ["F4", 1], ["G4", 1], ["F4", 2],
  ];
  const BEAT = 0.42; // seconds per beat

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
      if (playing) play(); // loop the tune
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
