# Devpost Submission — My Olympian

> Hackathon: [Team USA × Google Cloud](https://vibecodeforgoldwithgoogle.devpost.com/)
> Challenge: **Challenge 4 — The Athlete Archetype Agent**
> Deadline: **May 11, 2026 @ 5:00 PM PDT** (8:00 PM EDT)

## Pre-flight checklist (do these BEFORE filling Devpost)

- [ ] Cloud Run URL is live and tested in incognito.
- [ ] GitHub repo is public.
- [ ] GitHub repo About sidebar shows "Apache-2.0 license."
- [ ] Demo video is uploaded to YouTube as **unlisted**.
- [ ] Demo video is ≤ 3:00.
- [ ] Demo video shows live app + Gemini code/AI Studio + Google Cloud console.
- [ ] Demo video has English voiceover OR burned-in English subtitles.
- [ ] No real Team USA athletes are named or shown by face anywhere (UI, video, narrative).

---

## Project name

**My Olympian**

## Tagline (one line)

Find yourself in 120 years of Team USA.

## Project description (paste into Devpost)

> **Lead with Paralympic representation in the first paragraph — this is the rubric tiebreaker.**

My Olympian is a fan-facing analytical agent that maps any Team USA fan to one of five athlete archetypes, then walks that archetype across roughly 120 years of US **Paralympic and Olympic** sport families with equal analytical depth. Paralympic classifications are explained at the same level of detail as Olympic events. Where the historical record allows it (Paralympic Games begin in 1960), the era cards show Olympic and Paralympic columns side-by-side with equal width; where it does not, the cards say so explicitly rather than inventing data.

Built for **Challenge 4: The Athlete Archetype Agent** of the Team USA × Google Cloud Hackathon, My Olympian turns the brief's 120-year, biometric-input, fan-facing-agent specification into a single end-to-end experience: a 4-field form, a clustered archetype match, a 5-bubble cluster scatter, an Olympic+Paralympic timeline, and a multimodal Gemini story studio (text + audio + abstract silhouette image), plus a chat agent grounded in classification context.

### Key features

- **Five illustrative Team USA archetypes** seeded from US Olympic and Paralympic sport-family patterns: Reach & Rhythm, Compact Power, Aerobic Engine, Precision Control, Explosive Pivot. Each has Paralympic AND Olympic sport families pre-mapped at the sport-family + classification level — no individual athletes.
- **120-year timeline** with Olympic and Paralympic columns of equal width per era. Pre-1960 cards acknowledge that the Paralympic Games begin in 1960 instead of fabricating data.
- **Cluster scatter visualization** with one-standard-deviation ellipses showing the user's position relative to all 5 illustrative archetype centroids — a fan-engagement signal, not a competitive prediction.
- **All-five exploration** — the result page leads with the top two matches as hero cards and exposes the remaining three as one-tap pills, so every archetype is discoverable from a single screen.
- **Story Studio** (3 Gemini surfaces in one screen):
  - **Narrative** — `gemini-2.5-pro` generates a personalized ~100-word Olympian story using strict conditional phrasing.
  - **Audio** — `gemini-2.5-flash-preview-tts` (Kore voice) reads the narrative aloud.
  - **Silhouette card** — `imagen-4.0-generate-001` produces an abstract, geometric silhouette; deterministic SVG fallback when no credentials are present. NIL-safe by design — never shows real athletes.
- **Analyst chat** — `gemini-2.5-flash` answers follow-up questions about classifications, eras, and archetypes, with the same length and analytical depth required for Paralympic content as Olympic.

### How Gemini and Google Cloud are used

| Capability | Model | What it does |
|---|---|---|
| Reasoning + long context (narrative) | `gemini-2.5-pro` | 120-year personalized Olympian story |
| Reasoning (chat) | `gemini-2.5-flash` | Follow-up Q&A with equal Olympic / Paralympic depth |
| Multimodality (audio) | `gemini-2.5-flash-preview-tts` | Reads the narrative aloud (Kore voice) |
| Multimodality (image) | `imagen-4.0-generate-001` | Abstract archetype silhouette card, NIL-safe |
| Hosting | **Cloud Run** | Containerized Next.js app, `min-instances=1` |

System prompts on every Gemini call enforce four invariants: conditional phrasing only ("could align with"), equal Olympic/Paralympic depth, no real athletes named, refusal of performance prediction.

### Technologies used

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4
- `@google/genai` SDK
- Inline SVG for all charts (no charting library)
- Static JSON archetype data (no database — judges can reproduce)
- Containerized via the included `Dockerfile`, deployed to Google Cloud Run

### Data sources

- **Olympic sport-family references:** publicly available USOPC and Olympic event/sport materials, summarized at the sport-family level. No private individuals identified.
- **Paralympic sport-family references:** publicly available USOPC and IPC materials, summarized at the sport-family and classification level. No private individuals identified.
- **Pre-1960 Paralympic data:** explicitly absent — era cards before 1960 say so.

### Findings

- The five illustrative archetypes separate cleanly in the height × weight × movement-preference space, which is what makes the scatter plot readable — but the centroids are hand-built reference points, not learned from athlete data, and the app is labeled that way.
- Most archetypes have direct Paralympic counterparts when matched at the sport-family + classification level (Reach & Rhythm ↔ Para swimming S5–S10 + Para rowing PR1–PR3; Aerobic Engine ↔ Para handcycling H1–H5 + Para marathon T54; etc.).
- Where ellipses overlap on the scatter plot, those archetypes share build territory across Team USA history — the visual reinforces that there is no single Team USA body type.

## Required URLs (fill in before submitting)

| Field | Value |
|---|---|
| Hosted project URL | `https://my-olympian-861789748163.us-central1.run.app` |
| Public code repository | `https://github.com/YOUR_USERNAME/My-Olympian` |
| Demo video | `https://youtu.be/YOUR_UNLISTED_VIDEO_ID` |
| License | Apache 2.0 (visible in repo About sidebar) |

## Built with (Devpost tag list)

`gemini`, `google-cloud`, `cloud-run`, `nextjs`, `react`, `typescript`, `tailwindcss`, `imagen`, `tts`

## Try it (Devpost field)

```
1. Open the hosted URL.
2. Click "Begin."
3. Enter approximate height, weight, age band, and movement preference.
4. View your top 2 archetypes as hero cards — Paralympic-leaning is shown first by design.
5. Tap any of the three "Also explore" pills below to swap the story, timeline, and chat to a different archetype.
6. Click "Hear your story" to hear the Gemini-narrated audio.
7. Scroll the era timeline to see Olympic + Paralympic sport families side-by-side from 1904 → 2024.
8. Click "Open analyst chat" and try the suggested questions about classifications.
```

## Compliance notes (for judges)

- Apache-2.0 license is at the root of the repo and detected by GitHub.
- All app copy uses conditional phrasing ("could align with," "historically appears near," "may resemble"). The system prompt enforces this on every Gemini call.
- No real Team USA athletes are named or depicted anywhere.
- Olympic and Paralympic content are presented with equal column width and equal analytical depth in chat responses.
- Pre-1960 era cards acknowledge that Paralympic data does not exist before the founding of the Paralympic Games rather than inventing entries.
