// Vercel serverless function — guestbook backed by a Redis (Upstash REST) store.
// Connecting Vercel KV / Upstash in the dashboard sets the REST env vars
// automatically — no code changes needed. Both naming schemes supported.

const MAX_NAME = 40;
const MAX_WORDS = 400;
const MAX_MESSAGE_CHARS = 4000; // backstop
const MAX_PHOTO_LEN = 950000; // base64 chars (~700KB)
const KEEP_LATEST = 300;
const ALLOWED_PHOTO = /^data:image\/(jpeg|png|webp);base64,/;

module.exports = async function handler(req, res) {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.STORAGE_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.STORAGE_TOKEN;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  if (!url || !token) {
    return res.status(503).json({ error: "Guestbook not connected yet." });
  }

  async function kv(command) {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    });
    const data = await r.json();
    if (data.error) throw new Error(data.error);
    return data.result;
  }

  try {
    if (req.method === "GET") {
      const raw = await kv(["LRANGE", "messages", "0", "-1"]);
      const messages = (raw || [])
        .map((s) => { try { return JSON.parse(s); } catch { return null; } })
        .filter((m) => m && m.name && m.message)
        .reverse(); // newest first
      return res.status(200).json({ messages });
    }

    if (req.method === "POST") {
      let body = req.body;
      if (typeof body === "string") {
        try { body = JSON.parse(body); } catch { body = {}; }
      }
      const name = String((body || {}).name || "").trim().slice(0, MAX_NAME);
      const message = String((body || {}).message || "").trim().slice(0, MAX_MESSAGE_CHARS);
      const words = message.split(/\s+/).filter(Boolean).length;
      if (words > MAX_WORDS) {
        return res.status(400).json({ error: "Message is over 400 words." });
      }
      let photo = null;
      if (
        typeof (body || {}).photo === "string" &&
        body.photo.length <= MAX_PHOTO_LEN &&
        ALLOWED_PHOTO.test(body.photo)
      ) {
        photo = body.photo;
      }

      if (!name || !message) {
        return res.status(400).json({ error: "Name and message are required." });
      }

      const entry = JSON.stringify({ name, message, photo, ts: Date.now() });
      await kv(["RPUSH", "messages", entry]);
      await kv(["LTRIM", "messages", String(-KEEP_LATEST), "-1"]);
      return res.status(201).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed." });
  } catch (e) {
    return res.status(500).json({ error: "Something went wrong." });
  }
};
