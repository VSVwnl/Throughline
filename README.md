# My Olympian

> Find your archetype's path through 120 years of Team USA.

A submission for the **Team USA × Google Cloud Hackathon — Challenge 4: The Athlete Archetype Agent**.

My Olympian is a multimodal Gemini agent that maps a fan's biometric inputs to one of five Team USA athlete archetypes, then walks that archetype across roughly 120 years of US Olympic **and** Paralympic sport families with equal analytical depth — narrated in text, audio, and image by Gemini.

- **Live demo:** https://my-olympian-861789748163.us-central1.run.app
- **Demo video:** _(YouTube unlisted link)_
- **License:** Apache 2.0 (see [`LICENSE`](./LICENSE))

## Why this matters

Team USA has never had one body type. My Olympian lets any fan see themselves in the collective journey of Team USA without identifying any private individual, treating Paralympic and Olympic histories with equal depth.

## How Gemini is used

| Lane | Capability | Model | Purpose |
|---|---|---|---|
| Narrative | Reasoning + long context | `gemini-2.5-pro` | Personal 120-year Olympian story |
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

# Wire up your credentials (optional — app runs with mocks if missing)
copy .env.example .env.local
# then edit .env.local and either:
#   - set GEMINI_API_KEY=...           (AI Studio path), or
#   - set GOOGLE_VERTEXAI=1 + GOOGLE_CLOUD_PROJECT=...  (Vertex AI path)

# Run
npm run dev
# open http://localhost:3000
```

The app degrades gracefully without credentials: every Gemini call returns a deterministic mock response so the UI flow can be demoed and tested end-to-end before any keys are provisioned. See [`.env.example`](./.env.example) for the full list of supported variables.

### Two auth modes — pick one

| Mode | When to use | Setup |
|---|---|---|
| **AI Studio API key** | Quickest path; counts against AI Studio quota | `GEMINI_API_KEY` only |
| **Vertex AI (recommended for hackathon)** | Uses Google Cloud credits, higher quotas, full model access incl. `imagen-4.0-generate-001` | `gcloud auth application-default login` once, then set `GOOGLE_VERTEXAI=1` and `GOOGLE_CLOUD_PROJECT` |

The same `@google/genai` SDK powers both modes — `src/lib/gemini.ts` switches based on `GOOGLE_VERTEXAI`.

## Cloud Run deploy

See [`DEPLOY.md`](./DEPLOY.md) for the full runbook. Short version:

```powershell
# Vertex AI path (recommended — uses Google Cloud credits, no key in env)
gcloud run deploy my-olympian `
  --source . `
  --region us-central1 `
  --allow-unauthenticated `
  --min-instances 1 `
  --set-env-vars "GOOGLE_VERTEXAI=1,GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID,GOOGLE_CLOUD_LOCATION=us-central1"
# Grant Cloud Run's service account Vertex AI access (one-time):
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID `
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" `
  --role="roles/aiplatform.user"
```

For judging windows, `--min-instances 1` avoids cold-start spinners. The same Dockerfile listens on `process.env.PORT` (default `8080`) and `HOSTNAME=0.0.0.0`.

## Data

- **Olympic / Paralympic sport-family references:** publicly available USOPC and IPC public materials, summarized at the sport-family and classification level. No private individuals are identified.
- **Pre-1960 Paralympics:** the Paralympic Games begin in 1960. Era cards before 1960 say so explicitly.

See [`/about`](./src/app/about/page.tsx) inside the app for the full data and rules note.

## Hackathon

This project was built for the [Team USA × Google Cloud Hackathon](https://vibecodeforgoldwithgoogle.devpost.com/) and is licensed under Apache 2.0.
