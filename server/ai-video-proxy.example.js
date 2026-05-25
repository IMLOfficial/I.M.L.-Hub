import express from "express";

const app = express();
const port = Number(process.env.PORT || 8787);
const allowedOrigin = process.env.ALLOWED_ORIGIN || "https://imlofficial.github.io";

app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

const jobs = new Map();

function cleanPrompt(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 4000);
}

function normalizeSeconds(value) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds)) return 30;
  return Math.max(5, Math.min(300, Math.round(seconds)));
}

function getClipPlan(provider, totalSeconds) {
  const clipSeconds = provider === "openai" ? 12 : 10;
  return {
    clipSeconds,
    clipCount: Math.ceil(totalSeconds / clipSeconds)
  };
}

function createScenePrompt(basePrompt, index, count, style) {
  const phase = index === 0 ? "opening" : index === count - 1 ? "finale" : `scene ${index + 1}`;
  return `${basePrompt}. ${style || "cinematic music video"}. ${phase}. Smooth motion, high detail, no captions, no text overlays.`;
}

async function startProviderClip({ provider, prompt, seconds, aspectRatio }) {
  if (provider === "openai") {
    return startOpenAiVideo({ prompt, seconds, aspectRatio });
  }
  return startKlingVideo({ prompt, seconds, aspectRatio });
}

async function startKlingVideo({ prompt, seconds, aspectRatio }) {
  const apiKey = process.env.KLING_API_KEY;
  if (!apiKey) throw new Error("Missing KLING_API_KEY on the backend.");

  // Adjust this endpoint/body to match your exact Kling API vendor account.
  const response = await fetch("https://api.klingai.com/v1/videos/text2video", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt,
      duration: seconds <= 5 ? 5 : 10,
      aspect_ratio: aspectRatio || "16:9"
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || data.message || "Kling video request failed.");
  return data;
}

async function startOpenAiVideo({ prompt, seconds }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY on the backend.");

  const supportedSeconds = seconds <= 4 ? 4 : seconds <= 8 ? 8 : 12;
  const response = await fetch("https://api.openai.com/v1/videos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_VIDEO_MODEL || "sora-2",
      prompt,
      seconds: supportedSeconds,
      size: "1280x720"
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || "OpenAI video request failed.");
  return data;
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "song2video-ai-proxy" });
});

app.post("/api/ai-video/generate", async (req, res) => {
  try {
    const provider = req.body.provider === "openai" ? "openai" : "kling";
    const prompt = cleanPrompt(req.body.prompt);
    const seconds = normalizeSeconds(req.body.seconds);
    const aspectRatio = req.body.aspectRatio || "16:9";
    const style = req.body.style || "cinematic";

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const plan = getClipPlan(provider, seconds);
    const jobId = `song2video-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const job = {
      jobId,
      provider,
      status: "queued",
      seconds,
      ...plan,
      clips: [],
      createdAt: new Date().toISOString()
    };
    jobs.set(jobId, job);

    res.status(202).json({
      jobId,
      provider,
      status: "queued",
      clipSeconds: plan.clipSeconds,
      clipCount: plan.clipCount,
      message: "Generation started. Poll /api/ai-video/status/:jobId."
    });

    job.status = "running";
    for (let index = 0; index < plan.clipCount; index += 1) {
      const scenePrompt = createScenePrompt(prompt, index, plan.clipCount, style);
      const remaining = seconds - index * plan.clipSeconds;
      const clipDuration = Math.min(plan.clipSeconds, remaining);
      const providerJob = await startProviderClip({ provider, prompt: scenePrompt, seconds: clipDuration, aspectRatio });
      job.clips.push({ index, status: "submitted", providerJob });
    }
    job.status = "submitted";
    job.message = "All clip jobs were submitted. Add provider polling and FFmpeg stitching for final video delivery.";
  } catch (error) {
    const failedJob = [...jobs.values()].at(-1);
    if (failedJob && failedJob.status !== "submitted") {
      failedJob.status = "failed";
      failedJob.error = error.message;
    }
    console.error(error);
  }
});

app.get("/api/ai-video/status/:jobId", (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: "Job not found." });
  res.json(job);
});

app.listen(port, () => {
  console.log(`Song2Video AI proxy listening on http://localhost:${port}`);
});
