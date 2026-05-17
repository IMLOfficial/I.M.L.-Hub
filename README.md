[README.md](https://github.com/user-attachments/files/27900256/README.md)
# Free Video Agent

Free Video Agent is a standalone, GitHub-ready AI-style video creation agent. It turns a song/audio file, text prompt, and one or more images into a high-resolution video up to 5 minutes long.

It is designed to stay separate from any existing website or app. Run it as its own service, CLI tool, Docker container, or GitHub project.

## What It Can Do

- Generate videos from text, images, and optional music/audio.
- Create up to 5 minute videos.
- Render 1080p by default, with optional 4K output.
- Add captions, scene timing, subtle image motion, and audio sync.
- Validate inputs before rendering so failed jobs explain what is wrong.
- Save a JSON render plan beside each video for reproducible results.
- Run a dry plan without rendering when you want to inspect timing first.
- Run locally for free with open-source tools.
- Expose both a web API and a command-line interface.

## Honest Free Mode

This project does not depend on paid video-generation APIs. Instead, it uses local rendering with FFmpeg. That means it can create polished motion videos from your own images, text, and songs for free, but it does not magically invent brand-new photorealistic footage unless you connect an optional external model later.

## Requirements

- Python 3.11+
- FFmpeg installed and available on your system path

For the easiest setup, use Docker because it installs FFmpeg for you.

## Quick Start With Docker

```bash
docker build -t free-video-agent .
docker run --rm -p 8000:8000 free-video-agent
```

Open:

```text
http://localhost:8000
```

## Local Setup

On Windows, the guided path is:

```powershell
.\scripts\check_install.ps1
.\scripts\run_windows.ps1
```

Manual setup:

```bash
python -m venv .venv
.venv/Scripts/activate
pip install -r requirements.txt
uvicorn videoforge_agent.server:app --reload
```

## CLI Example

```bash
python -m videoforge_agent.cli ^
  --prompt "A cinematic birthday recap with warm captions" ^
  --images examples/photo1.jpg examples/photo2.jpg ^
  --audio examples/song.mp3 ^
  --output examples/output.mp4 ^
  --duration 60 ^
  --resolution 1920x1080
```

The CLI also writes `output.plan.json`, which contains the exact prompt, images, captions, durations, resolution, FPS, and quality settings used for the render.

To check the storyboard without rendering:

```bash
python -m videoforge_agent.cli ^
  --prompt "A cinematic birthday recap with warm captions" ^
  --images examples/photo1.jpg examples/photo2.jpg ^
  --output examples/output.mp4 ^
  --duration 60 ^
  --plan-only
```

## Accuracy Notes

The agent is accurate about:

- The requested duration, capped at 300 seconds.
- The number of generated scenes.
- Which image appears in each scene.
- Caption text derived from the prompt.
- Resolution, FPS, and quality settings passed into FFmpeg.
- Audio trimming or looping to match the video duration.
- Rendering commands fail early when assets are missing or unsupported.

For fully AI-generated moving footage, connect a local open-source video model or an external provider. The default free mode creates high-quality motion videos from provided assets.

## API Example

```bash
curl -X POST http://localhost:8000/render ^
  -F "prompt=A futuristic product launch teaser" ^
  -F "duration_seconds=45" ^
  -F "resolution=1920x1080" ^
  -F "images=@examples/photo1.jpg" ^
  -F "images=@examples/photo2.jpg" ^
  -F "audio=@examples/song.mp3" ^
  --output output.mp4
```

## Project Layout

```text
free-video-agent/
  src/videoforge_agent/
    agent.py       # Creates the video plan
    renderer.py    # Uses FFmpeg to render video
    server.py      # Web API and tiny upload UI
    cli.py         # Command-line entry point
  examples/        # Put sample images/audio here
  Dockerfile
  requirements.txt
```

## GitHub

This folder is ready to become its own GitHub repository:

```bash
cd free-video-agent
git init
git add .
git commit -m "Create free video generation agent"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/free-video-agent.git
git push -u origin main
```

## License

MIT
