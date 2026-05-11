# Throughline

> Find your archetype's path through 120 years of Team USA.

A submission for the **Team USA × Google Cloud Hackathon — Challenge 4: The Athlete Archetype Agent**.

Throughline is a multimodal Gemini agent that maps a fan's biometric inputs to one of five Team USA athlete archetypes, then walks that archetype across roughly 120 years of US Olympic **and** Paralympic sport families with equal analytical depth — narrated in text, audio, and image by Gemini.

- **Live demo:** _(set after Cloud Run deploy)_
- **Demo video:** _(YouTube unlisted link)_
- **License:** Apache 2.0 (see [`LICENSE`](./LICENSE))

## Why this matters

Team USA has never had one body type. Throughline lets any fan see themselves in the collective journey of Team USA without identifying any private individual, treating Paralympic and Olympic histories with equal depth.

## How Gemini is used

| Lane | Capability | Model | Purpose |
|---|---|---|---|
| Narrative | Reasoning + long context | `gemini-2.5-pro` | Personal 120-year throughline narrative |
| Audio | Multimodality | `gemini-2.5-flash-preview-tts` | Reads the narrative aloud (Kore voice) |
| Silhouette | Multimodality | `imagen-4.0-generate-001` | Stylized abstract silhouette card, NIL-safe |
| Chat | Reasoning | `gemini-2.5-flash` | Follow-up Q&A with equal Olympic/Paralympic depth |

All four models can be overridden via `GEMINI_NARRATIVE_MODEL`, `GEMINI_CHAT_MODEL`, `GEMINI_TTS_MODEL`, and `GEMINI_IMAGE_MODEL` environment variables — useful when staying inside the free-tier limits.

System prompts enforce four invariants on every Gemini call:

1. Conditional phrasing only ("could align with") — never "you should" / "you will".
2. Paralympic and Olympic responses match in depth and length.
3. Never name a specific real athlete.
4. Refuse performance predictions, training prescriptions, or medical advice.

## Tech

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4
- `@google/genai` SDK for all Gemini and Imagen calls
- Static JSON archetype data (no database)
- Deployed to **Google Cloud Run** (containerized)

## Local development

```powershell
# Install
npm install

# Add your Gemini API key (optional — app runs with mocks without it)
copy .env.local.example .env.local
# then edit .env.local and set GEMINI_API_KEY=...

# Run
npm run dev
# open http://localhost:3000
```

The app degrades gracefully without an API key: every Gemini call returns a deterministic mock response so the UI flow can be demoed and tested end-to-end before credentials are provisioned.

## Cloud Run deploy

Prerequisites: a GCP project with billing enabled, the `gcloud` CLI, and the Gemini API enabled.

```powershell
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Build + deploy
gcloud run deploy throughline `
  --source . `
  --region us-central1 `
  --allow-unauthenticated `
  --min-instances 1 `
  --set-env-vars GEMINI_API_KEY=YOUR_KEY
```

For judging windows, set `--min-instances 1` so judges do not hit a cold start.

## Data

- **Olympic / Paralympic sport-family references:** publicly available USOPC and IPC public materials, summarized at the sport-family and classification level. No private individuals are identified.
- **Pre-1960 Paralympics:** the Paralympic Games begin in 1960. Era cards before 1960 say so explicitly.

See [`/about`](./src/app/about/page.tsx) inside the app for the full data and rules note.

## Hackathon

This project was built for the [Team USA × Google Cloud Hackathon](https://vibecodeforgoldwithgoogle.devpost.com/) and is licensed under Apache 2.0.
