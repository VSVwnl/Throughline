# Throughline — 3:00 Demo Video Script

> Hard rules from the hackathon brief:
> - Maximum 3:00 (180 seconds).
> - Show: live demo + Gemini usage (AI Studio or code) + Google Cloud console.
> - English audio or English subtitles burned in.
> - Upload to YouTube as **unlisted**.
> - No real Team USA athletes by name or face (NIL).

## Beat sheet (use this with a stopwatch)

### 0:00 – 0:25 · Cold open with Paralympic-first framing

**On screen:** Open the deployed Cloud Run URL. Land on the home page.

**Voiceover (read aloud):**
> "Team USA has never had one body type. Across 120 years, the Paralympic and Olympic teams have been built from athletes with wildly different builds — and most fans only ever see a sliver of that story. Throughline is a Gemini-powered analyst that maps any fan's build to the broader Team USA story, with equal depth for Paralympic and Olympic sport families."

**Action:** Click "Begin."

---

### 0:25 – 1:00 · Live form fill + first reveal

**On screen:** The biometric form. Move sliders for height (around 178cm) and weight (around 75kg). Pick an age band and a movement preference. Click "Find my archetype."

**Voiceover:**
> "I'm entering my own build — height, weight, age range, movement style. No account, no signup. The result page leads with my top two Team USA archetypes as hero cards, then exposes the remaining three as one-tap pills below — every archetype is reachable from a single screen. The first card is the Paralympic-leaning archetype by design — Olympic and Paralympic results are always treated with equal prominence."

**Action:** Pause briefly on the two archetype cards. Tap one of the three pills below to show that the story, timeline, and chat update live.

---

### 1:00 – 1:30 · The cluster scatter (transparent matching)

**On screen:** Scroll down to the cluster scatter chart.

**Voiceover:**
> "This is where my inputs land in archetype space. The five archetype centroids are hand-built reference points based on US Olympic and Paralympic sport-family patterns — illustrative, not learned from athlete data, and labeled that way in the app. The ellipses mark roughly one standard deviation of build spread; the dashed white ring marks any archetype whose movement preference matches mine. Where ellipses overlap is where archetypes blend — the point being that Team USA is not one body type."

**Action:** Hover briefly to show the highlighted match.

---

### 1:30 – 2:05 · The 120-year timeline (Paralympic parity in action)

**On screen:** Scroll to the era timeline. Slowly scroll through the eras.

**Voiceover:**
> "From 1904 to today, the same archetype shows up in different sport families across Team USA history. Each era card has Olympic and Paralympic columns of equal width. Pre-1960 cards explicitly say 'the Paralympic Games begin in 1960' — we don't invent data. From the 1960s onward, you see the matched Paralympic sport families and classifications side-by-side with the Olympic ones."

**Action:** Pause on a 1980s or 2010s card so the Olympic + Paralympic columns are clearly equal.

---

### 2:05 – 2:30 · The story studio (Gemini multimodality)

**On screen:** Scroll up to the story section. Click "Hear your throughline."

**Voiceover (over the audio playback):**
> "Gemini 2.5 Pro generates a personalized 90-word throughline that connects my archetype across 120 years, with conditional phrasing throughout — 'could align with,' never 'you should.' Gemini 2.5 Flash TTS reads it aloud. The silhouette card on the left is rendered by Imagen 4 as an abstract, geometric form — no faces, no real athletes, NIL-safe by design."

**Action:** Let the audio play for ~10 seconds, then continue speaking over it.

---

### 2:30 – 2:50 · The chat agent (reasoning + Paralympic depth)

**On screen:** Click "Open analyst chat." Click the suggested question "How is the T54 classification structured?"

**Voiceover:**
> "The chat agent answers questions about classifications and eras. The system prompt enforces the same depth for Paralympic answers as Olympic ones, and conditional phrasing on every reply. This is the agentic surface — a Gemini-powered fan-facing analyst, exactly what the Challenge 4 brief asks for."

**Action:** Let the answer stream in. Don't wait for it to finish.

---

### 2:50 – 3:00 · Stack proof + close

**On screen:** Quickly cut to:
1. Google Cloud Console showing the deployed Cloud Run service (1 second).
2. `src/lib/gemini.ts` open in your editor with the four model names visible — `gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.5-flash-preview-tts`, `imagen-4.0-generate-001` (1 second).
3. The GitHub repo showing "Apache-2.0 license" in the About sidebar (1 second).
4. Back to the app's hero page.

**Voiceover (rapid):**
> "Four Gemini surfaces — Pro for narrative, Flash for chat, Flash TTS for audio, Imagen 4 for the silhouette card — wired through Vertex AI and Cloud Run. Apache-2.0 licensed. Throughline. Find yourself in 120 years of Team USA."

---

## Recording checklist

- [ ] Use OBS or the Windows Game Bar (Win+G) for screen recording.
- [ ] Record at 1080p, 30 fps.
- [ ] Use a microphone; if no mic, write the script as on-screen captions instead.
- [ ] Speak slowly. 180 seconds is shorter than you think — practice the read once.
- [ ] Burn English subtitles into the final video (use CapCut or DaVinci Resolve free).
- [ ] Final length: 2:55–3:00. Anything over 3:00 risks disqualification.

## Voiceover word count

Each beat is timed to roughly 150 words per minute (a relaxed pace). Total script is ~430 words → fits comfortably in 3:00 with a slight buffer for visual transitions.

## Safe fallback if you can't record voiceover

Record screen-only at 1.0× speed. In post, add on-screen text overlays for each section using the `**Voiceover**` blocks above as captions. Slower pace is fine — judges read.
