# AI Video Backend Setup

The public GitHub Pages site can run the browser canvas generator, but it cannot safely call paid AI video APIs directly. API keys must stay on a private backend.

## Recommended Architecture

1. The website uploads or analyzes the song locally.
2. The website creates a storyboard with prompts and target length.
3. A private backend receives the prompt request.
4. The backend calls an AI video provider such as Kling-style video APIs or OpenAI video APIs.
5. The backend polls each job until the provider returns video clips.
6. For full-song videos, the backend stitches the short clips together with the audio using a video tool such as FFmpeg.
7. The website shows the finished video download link.

## Why The Backend Is Required

Never put provider API keys in `index.html` or any public JavaScript file. Anyone can view those keys in the browser and spend your credits.

## Provider Reality Check

Most AI video providers generate short clips, not one finished 5 minute music video in a single call.

- Kling-style APIs commonly generate short clips such as 5 or 10 seconds.
- OpenAI video API clips are also short duration options.
- Canva's developer platform is useful for apps, Connect API workflows, and Canva editor integrations, but it is not a simple public endpoint for generating Magic Media videos from this GitHub Pages site.

For a 5 minute song, the practical path is to generate many short scenes and stitch them together.

## Environment Variables

Use these on your backend host, not in the public website:

```bash
AI_VIDEO_PROVIDER=kling
KLING_API_KEY=your_private_key
OPENAI_API_KEY=your_private_key
ALLOWED_ORIGIN=https://imlofficial.github.io
```

## API Contract For The Website

The website should call your backend like this:

```http
POST /api/ai-video/generate
Content-Type: application/json

{
  "provider": "kling",
  "prompt": "cinematic blue lightning, I.M.L. logo energy, music video",
  "seconds": 180,
  "aspectRatio": "16:9",
  "style": "cinematic"
}
```

The backend should respond with a job object:

```json
{
  "jobId": "provider-job-id-or-local-batch-id",
  "provider": "kling",
  "status": "queued",
  "clipSeconds": 10,
  "clipCount": 18,
  "message": "Generation started. Poll the status endpoint."
}
```

Then the website polls:

```http
GET /api/ai-video/status/:jobId
```

## Next Build Step

After you choose a provider and backend host, connect the website to that backend endpoint and add a real AI Generate button beside the current browser canvas export button.
