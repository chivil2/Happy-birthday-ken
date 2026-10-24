/* Wish page — friends leave messages + optional photos for Ken */

const fire = (opts) => {
  if (typeof window.confetti === "function") {
    window.confetti(
      Object.assign(
        { colors: ["#e59bb0", "#b98a2f", "#a63a3a", "#5d8f5f", "#f3ebd6"] },
        opts
      )
    );
  }
};

const form = document.getElementById("wishForm");
const nameInput = document.getElementById("wishName");
const msgInput = document.getElementById("wishMessage");
const charCount = document.getElementById("charCount");
const submitBtn = document.getElementById("wishSubmit");
const status = document.getElementById("wishStatus");
const photoInput = document.getElementById("wishPhoto");
const photoDrop = document.getElementById("photoDrop");
const photoPreview = document.getElementById("photoPreview");
const previewImg = document.getElementById("previewImg");
const photoRemove = document.getElementById("photoRemove");
const LOCAL_KEY = "ken-bday-wishes";
const WORD_LIMIT = 400;

let photoDataUrl = null;

function wordCount(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

msgInput.addEventListener("input", () => {
  const n = wordCount(msgInput.value);
  charCount.textContent = n + " / 400 words";
  charCount.classList.toggle("over", n > WORD_LIMIT);
});

/* ---- photo: read + downscale so it fits in the DB ---- */
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const max = 800;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      let quality = 0.8;
      let url = canvas.toDataURL("image/jpeg", quality);
      while (url.length > 850000 && quality > 0.35) {
        quality -= 0.15;
        url = canvas.toDataURL("image/jpeg", quality);
      }
      photoDataUrl = url;
      previewImg.src = url;
      photoPreview.style.display = "block";
      photoDrop.style.display = "none";
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

photoRemove.addEventListener("click", () => {
  photoDataUrl = null;
  photoInput.value = "";
  photoPreview.style.display = "none";
  photoDrop.style.display = "flex";
});

function saveLocal(entry) {
  let list = [];
  try { list = JSON.parse(localStorage.getItem(LOCAL_KEY)) || []; } catch {}
  list.unshift(entry);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(list.slice(0, 100)));
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const message = msgInput.value.trim();
  if (!name || !message) return;
  if (wordCount(message) > WORD_LIMIT) {
    status.classList.add("error");
    status.textContent = "keep it under 400 words";
    return;
  }

  submitBtn.disabled = true;
  status.classList.remove("error");
  status.textContent = "sending...";

  const entry = { name, message, photo: photoDataUrl, ts: Date.now() };

  try {
    const r = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    if (!r.ok) throw new Error();
    status.textContent = "sealed & delivered — ken will see it on his page";
    fire({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
    setTimeout(() => {
      fire({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } });
      fire({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } });
    }, 300);
  } catch {
    saveLocal(entry);
    status.textContent = "saved! it'll reach ken once the scroll archive is connected";
  }

  msgInput.value = "";
  charCount.textContent = "0 / 400 words";
  photoRemove.click();
  submitBtn.disabled = false;
});
