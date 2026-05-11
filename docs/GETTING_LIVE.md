# Getting My Olympian live — zero-experience runbook

> **Deadline:** May 11, 2026 @ 5:00 PM PDT = **8:00 PM EDT** Monday.
> **Now:** Sunday 9:12 PM EDT — about **23 hours** out.

This guide assumes you've never used Google Cloud, `gcloud`, or GitHub before. Every step has:

- **Do this:** the exact action.
- **You should see:** how to know it worked.
- **If it fails:** the most common fix.

Stop after each phase, paste any errors or your result back into the chat, and I'll keep you unstuck.

---

## The plan tonight (Sun) + tomorrow (Mon)

| Block | When | What |
|---|---|---|
| Phase 1 | Tonight, ~25 min | Create Google Cloud project, enable billing, claim $300 hackathon credits |
| Phase 2 | Tonight, ~15 min | Install `gcloud` CLI on your Windows machine |
| Phase 3 | Tonight, ~10 min | Create public GitHub repo + push code with Apache-2.0 license visible |
| Phase 4 | Tonight, ~10 min | First Cloud Run deploy → live `https://...run.app` URL |
| Phase 5 | Tonight, ~5 min | Smoke-test the live URL in incognito |
| **Sleep** | | |
| Phase 6 | Mon morning, ~90 min | Record 3:00 demo video, upload to YouTube unlisted |
| Phase 7 | Mon afternoon, ~20 min | Fill the Devpost submission, click submit by 5 PM PDT |

If something blows up in Phase 1-4 tonight, you still have all of Monday daytime to recover before the deadline. That's the buffer.

---

## Phase 1 — Google Cloud project + billing + hackathon credits

**Why:** Cloud Run needs a GCP project with billing enabled. The hackathon gives $300 in credits so you won't pay a cent if you stay tidy.

### 1.1 Create the project

1. Open https://console.cloud.google.com in your browser. Sign in with your Google account (the same `vishnusai.usa@gmail.com` you use for git is fine).
2. At the very top of the page, just right of the "Google Cloud" logo, you'll see a **project picker dropdown**. Click it.
3. In the popup that opens, top-right corner: click **NEW PROJECT**.
4. **Project name:** `my-olympian-hack`
5. **Organization:** leave as "No organization" if it's the default.
6. Click **CREATE**. Wait ~10 seconds.
7. The notification bell (top right) will say "Created project my-olympian-hack." Click **SELECT PROJECT** on that notification, or click the project picker again and pick it.
8. **Copy the Project ID** — under the project name there's an ID like `my-olympian-hack-123456`. Save it somewhere. You'll need it many times. (Project *name* and project *ID* are different — the ID is what `gcloud` cares about.)

**You should see:** Top of the page now shows "my-olympian-hack" next to the Google Cloud logo.

### 1.2 Enable billing

1. In the top-left hamburger menu (☰), go to **Billing**.
2. If a card is already linked to your Google account, you'll be asked to link the billing account to the new project. Click **LINK A BILLING ACCOUNT** and pick it.
3. If you have no billing account, click **MANAGE BILLING ACCOUNTS** → **CREATE ACCOUNT**. Add a credit card. **You won't be charged** if we stay inside the $300 hackathon credits.

**You should see:** Billing page shows "Billing is enabled for this project."

### 1.3 Claim the $300 hackathon credits

1. Go back to your Devpost confirmation email for the hackathon.
2. Find the link that says something like **"Activate your Google Cloud account"** or **"Claim your hackathon credits"**.
3. Click it. It'll ask you to pick which billing account to apply the credits to. Pick the one you just created.
4. Confirm.

**You should see:** Back in https://console.cloud.google.com/billing, your credits balance shows $300 (or $1000 in some cohorts) under "Promotional credits."

**If it fails:** No worries — Cloud Run for one weekend will cost about $0.50 even without credits. Move on and claim them later.

### 1.4 Enable the APIs we need

You need to enable three APIs in this project before `gcloud run deploy` will work.

1. Top-left hamburger menu → **APIs & Services** → **Library**.
2. In the search bar at the top, search and **enable each of these one at a time** (click the API, then click the blue **ENABLE** button on the next page, wait ~30 seconds, go back, search next):
   - **Cloud Run Admin API**
   - **Cloud Build API**
   - **Artifact Registry API**

**You should see:** Each API's page changes from "ENABLE" to "MANAGE" after you enable it.

**Checkpoint:** Paste your **Project ID** into the chat. I'll bake it into the deploy command for you in Phase 4.

---

## Phase 2 — Install `gcloud` CLI

**Why:** This is the command-line tool that talks to Google Cloud. We need it to run `gcloud run deploy`.

### 2.1 Download the installer

1. Open https://cloud.google.com/sdk/docs/install-sdk in your browser.
2. Scroll to the **Windows** section.
3. Click **Google Cloud CLI installer**. A file called `GoogleCloudSDKInstaller.exe` downloads.

### 2.2 Run the installer

1. Double-click `GoogleCloudSDKInstaller.exe`.
2. Accept defaults on every screen. The "single user" option is fine.
3. On the last screen, leave **"Run `gcloud init` to configure the Cloud SDK"** checked. Click **Finish**.

### 2.3 `gcloud init`

A terminal window opens automatically. It will:

1. Ask **"You must log in to continue. Would you like to log in?"** → type `Y` and hit Enter.
2. Open your browser. Sign in with the **same Google account** that owns the GCP project. Click **Allow** to grant permissions.
3. Back in the terminal: it lists your projects. Pick the number for `my-olympian-hack`.
4. **"Do you want to configure a default Compute Region and Zone?"** → type `Y`, then pick the number for **`us-central1`** (a common option is `us-central1-a`).

**You should see:** Final message ends with "Your Google Cloud SDK is configured and ready to use!"

### 2.4 Verify install

Close the terminal window from `gcloud init`. Open a **new** PowerShell window (Win+X → "Terminal" or "PowerShell") and run:

```powershell
gcloud --version
gcloud config list
```

**You should see:**

```
Google Cloud SDK 4xx.0.0
...
[core]
account = vishnusai.usa@gmail.com
project = my-olympian-hack-123456
```

**If `gcloud` is "not recognized":** Close ALL terminal windows (including the one inside Cursor) and open a fresh one. The installer modified your PATH but existing terminals won't see it until restarted. **Also restart Cursor** so its internal terminal picks up the new PATH.

**Checkpoint:** Run `gcloud config list` and paste the output. I'll confirm the project ID is right before we deploy.

---

## Phase 3 — GitHub: public repo + Apache-2.0 license visible

**Why:** Submission requires a public GitHub repo with Apache-2.0 license detected in the repo's About sidebar. No license badge = rule violation.

### 3.1 Create / sign in to GitHub

1. Open https://github.com. If you don't have an account, click **Sign up** (top right). Use the same email if you want. Verify your email when prompted.
2. If you already have one, **Sign in**.

### 3.2 Create the empty repo

1. Top-right plus icon (➕) → **New repository**.
2. **Repository name:** `My-Olympian`
3. **Description:** `Find yourself in 120 years of Team USA — Gemini × Cloud Run, Challenge 4 submission for the Team USA × Google Cloud Hackathon.`
4. **Public** ✓ (must be public)
5. **Do NOT** check "Add a README", "Add .gitignore", or "Choose a license" — we already have all three in the repo.
6. Click **Create repository**.

You'll land on an empty repo page with instructions.

### 3.3 Push your local repo

In the GitHub page that just opened, look for the section **"...or push an existing repository from the command line"**. It shows three lines like:

```
git remote add origin https://github.com/VSVwnl/My-Olympian.git
git branch -M main
git push -u origin main
```

(Your GitHub username will replace `VSVwnl` — copy from the GitHub page, don't trust mine.)

In a PowerShell terminal inside the project folder, but before pushing, **commit the pending model-default fixes I made earlier:**

```powershell
cd C:\Personal\Hackathons\Google\my-olympian

git add README.md SUBMISSION.md src/lib/gemini.ts

git commit -m "Align Gemini model defaults to design doc: narrative=gemini-2.5-pro, image=imagen-4.0-generate-001, env-overridable on all four lanes"
```

Then run the three commands GitHub showed you. The first time you push, a browser window may pop up asking you to authorize Git Credential Manager → click **Authorize**.

**You should see:** Refreshing your GitHub repo page now shows all your code, including `LICENSE`, `README.md`, `src/`, etc.

### 3.4 Verify Apache-2.0 is detected

1. On your repo page (https://github.com/YOUR_USERNAME/My-Olympian), look at the **right sidebar** under "About".
2. There should be a line that reads **"Apache-2.0 license"** with a small scale icon.

**If it's missing:** Click the gear icon ⚙ next to "About". In the "License" dropdown, GitHub auto-detects `LICENSE` files — if our file looks correct it should already show. If it doesn't, leave that screen, refresh, and check the sidebar again. GitHub re-scans on a short delay.

**Checkpoint:** Paste your repo URL (e.g. `https://github.com/VSVwnl/My-Olympian`) into the chat. I'll add it to `SUBMISSION.md` and we move on.

---

## Phase 4 — First Cloud Run deploy

**Why:** This is the hosted live URL judges will hit.

### 4.1 The deploy command

I'll give you the exact command. **Replace these two values before running:**

- `YOUR_PROJECT_ID` — your project ID from Phase 1.1 (e.g. `my-olympian-hack-123456`)
- `YOUR_GEMINI_KEY` — the value of `GEMINI_API_KEY` from your local `.env.local` file (starts with `AIzaSy...`)

```powershell
cd C:\Personal\Hackathons\Google\my-olympian

gcloud run deploy my-olympian `
  --source . `
  --region us-central1 `
  --project YOUR_PROJECT_ID `
  --allow-unauthenticated `
  --min-instances 1 `
  --max-instances 5 `
  --memory 512Mi `
  --cpu 1 `
  --timeout 60s `
  --set-env-vars "GEMINI_API_KEY=YOUR_GEMINI_KEY"
```

The backticks are PowerShell line continuations — they're important. If you'd rather have it on one line, that also works.

### 4.2 What you'll watch happen

The terminal will say something like:

```
Building using Dockerfile and deploying container to Cloud Run service [my-olympian] in project [my-olympian-hack-...] region [us-central1]
Allow unauthenticated invocations to [my-olympian]? (y/N)? y
```

Type `y` and Enter.

Then it streams the build log for ~3–5 minutes the first time (90 seconds on subsequent deploys because Cloud Build caches layers). When it's done you'll see:

```
Service [my-olympian] revision [my-olympian-00001-xyz] has been deployed and is serving 100 percent of traffic.
Service URL: https://my-olympian-xxxxxxxxxx-uc.a.run.app
```

**Save that Service URL.** It's the centerpiece of your submission.

### 4.3 Common errors and one-line fixes

| Error contains... | Fix |
|---|---|
| `Permission denied on resource project` | Wrong project. Run `gcloud config set project YOUR_PROJECT_ID` and retry. |
| `Cloud Build API has not been used` | You missed an API in 1.4. Open https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com, click ENABLE, wait 60s, retry. |
| `Step #X: npm ci ... ERR!` | A code-side build error. Paste the last 30 lines of the build log into the chat. |
| `The user-provided container failed to start` | Means the container started but crashed. Get the runtime logs with `gcloud run services logs read my-olympian --region us-central1 --limit 50` and paste them. |
| `Quota exceeded` | Try `--region us-east1` instead of `us-central1`. |

**Checkpoint:** Paste the Service URL into the chat when the deploy finishes.

---

## Phase 5 — Smoke-test the live URL

**Why:** Catch broken endpoints before the judge does.

### 5.1 Manual click-through (5 min)

1. Open the Service URL in an **incognito window** (Ctrl+Shift+N in Chrome).
2. The home page should load with "Find yourself in 120 years of Team USA."
3. Click **Begin**.
4. Move the sliders, pick a movement preference, click **Find my archetype**.
5. On the result page, confirm:
   - Top-2 cards render with the Paralympic-leaning card **first**.
   - The cluster scatter chart shows 5 colored ellipses + your white "you" point.
   - The narrative paragraph generates within ~10 seconds (uses `gemini-2.5-pro`).
   - "Hear your story" button plays audio after ~5 seconds.
   - The silhouette image renders (or falls back to the colored SVG if Imagen isn't available on your key — that's still acceptable).
   - The timeline shows Olympic + Paralympic columns of equal width.
   - "Open analyst chat" works and a suggested question returns an answer.

### 5.2 API smoke tests (1 min each)

In PowerShell, replace `YOUR_URL` and run:

```powershell
$url = "https://my-olympian-xxxxxxxxxx-uc.a.run.app"

Invoke-RestMethod -Uri "$url/api/narrative" -Method POST -ContentType "application/json" -Body '{"archetypeId":"reach-rhythm","paraLeading":true}'

Invoke-RestMethod -Uri "$url/api/chat" -Method POST -ContentType "application/json" -Body '{"archetypeId":"aerobic-engine","messages":[{"role":"user","text":"How is T54 structured?"}]}'

$silResp = Invoke-RestMethod -Uri "$url/api/silhouette" -Method POST -ContentType "application/json" -Body '{"archetypeId":"compact-power"}'
$silResp.kind   # "image" means Imagen worked. "mock" means it fell back.
```

**If `silhouette` returns "mock":** Imagen 4 isn't available on your AI Studio key. Quick fix without redeploying code:

```powershell
gcloud run services update my-olympian `
  --region us-central1 `
  --update-env-vars "GEMINI_IMAGE_MODEL=gemini-2.5-flash-image"
```

Wait 30 seconds and re-test. This switches to Nano Banana, which is universally available.

**Same trick** if `narrative` returns mock text (look for the literal phrase "set GEMINI_API_KEY"): set `GEMINI_NARRATIVE_MODEL=gemini-2.5-flash` instead of `gemini-2.5-pro`.

### 5.3 Update README + SUBMISSION with the live URL

Once you confirm the URL works, paste it into the chat and I'll do the README/SUBMISSION updates and commit them for you.

---

## Phase 6 — Demo video (~90 min, Monday morning)

The full beat sheet is in `DEMO_SCRIPT.md` and aligns to the design doc's 3-minute structure. We'll iterate on this together Monday — but here's the high-level plan so you can prep:

### 6.1 Recording tools (already on your Windows machine)

- **Screen recorder:** Press **Win+G** to open Xbox Game Bar → click the record button (red circle). Records the active window. Output is in `Videos\Captures`.
- **Better option:** Install **OBS Studio** (https://obsproject.com/) — free, more control, no watermark. ~10 min install.

### 6.2 Mic decision

- **If you have a USB or laptop mic:** Record voiceover live while clicking through.
- **If you don't or you're worried about clarity:** Record screen-only, no audio. Then add burned-in subtitles in CapCut (https://www.capcut.com/, free, ~30 min learning curve).
- **Either way:** The submission accepts both — voiceover OR English subtitles burned into the video.

### 6.3 Cuts you must include in the video

These are explicit rubric requirements:

1. Live demo of the deployed Cloud Run URL (most of the 3 minutes).
2. **3-second cutaway** to the Google Cloud Console showing your Cloud Run service exists.
3. **3-second cutaway** to either AI Studio OR `src/lib/gemini.ts` open in Cursor showing the Gemini model names.
4. **3-second cutaway** to your GitHub repo with "Apache-2.0 license" visible in the About sidebar.
5. Length **≤ 3:00**. Hard cutoff. 3:01 risks DQ.

### 6.4 Upload to YouTube unlisted

1. Sign in to https://youtube.com (same Google account).
2. Top-right → camera icon (📹) → **Upload video**.
3. Pick your file.
4. Title: `My Olympian — Team USA × Google Cloud Hackathon Demo`
5. Description: a one-paragraph version of the SUBMISSION.md project description.
6. **Visibility:** **Unlisted** (not Public, not Private — Unlisted).
7. Publish, copy the share link (looks like `https://youtu.be/...`).

**Checkpoint:** Paste the YouTube link into the chat.

---

## Phase 7 — Devpost submission (~20 min, Monday afternoon)

### 7.1 Open the submission form

1. Go to https://vibecodeforgoldwithgoogle.devpost.com.
2. Click **Join hackathon** if you haven't.
3. Click **Submit project** (the same place as the "Join" button after joining).

### 7.2 Fields, exactly what to paste

I've pre-written each field in `SUBMISSION.md`. Open that file and copy each block into the matching Devpost field:

- **Project name** → `SUBMISSION.md` § Project name
- **Tagline** → § Tagline
- **Project description** → § Project description (this is the long paragraph — paste the whole "Project description" section)
- **Try it** → § Try it
- **Built with** → § Built with
- **Hosted project URL** → paste your Cloud Run URL
- **Public code repository** → paste your GitHub URL
- **Demo video** → paste your YouTube unlisted URL

### 7.3 Final checks before clicking submit

Cross-check against `SUBMISSION.md` § "Pre-flight checklist." Every box must be ticked. Then click **Submit**.

---

## What to do right now

**Start Phase 1.** Open https://console.cloud.google.com in a new tab and follow Phase 1 step-by-step. When you get to the checkpoint at the end of Phase 1.4, paste your Project ID into the chat and I'll prep the rest.

If you hit ANY confusion or error message, just paste it into the chat — don't try to power through. Most issues are 30-second fixes once I see the exact error.

Let's get you on a podium.
