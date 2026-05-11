# Deploying My Olympian to Google Cloud Run

> Goal: a public HTTPS URL that judges can hit, with `min-instances=1` so they never see a cold-start spinner.

## 0. One-time setup (do once, ~15 min)

### 0a. Create a GCP project

1. Go to https://console.cloud.google.com.
2. Top-left, click the project picker → **NEW PROJECT**.
3. Name it `my-olympian-hack` (or anything).
4. Note the **Project ID** that gets generated — it looks like `my-olympian-hack-12345`. You'll need this.

### 0b. Enable billing

Cloud Run requires a billing account, even when you're inside the free tier.

1. In the console, go to **Billing**.
2. Link a billing account (add a card if you don't have one).
3. **Activate hackathon credits**: there's a link in your Devpost confirmation email titled "Activate your Google Cloud account" — clicking it adds the $300 in free credits to your billing account. Do this BEFORE deploying.

### 0c. Enable the APIs you need

In the console, go to **APIs & Services → Library** and enable each of these (use the search bar):

- **Cloud Run Admin API**
- **Cloud Build API**
- **Artifact Registry API**
- **Vertex AI API** (only if you plan to use the Vertex AI auth path below — recommended for the hackathon to use your Google Cloud credits)

Each takes 10–30 seconds to enable.

### 0d. Install the `gcloud` CLI

1. Download from https://cloud.google.com/sdk/docs/install-sdk → Windows installer (`GoogleCloudSDKInstaller.exe`).
2. Run it. At the end, let it run `gcloud init`.
3. `gcloud init` will:
   - Open a browser to log you in to Google.
   - Ask you to pick a project — pick the one you created in 0a.
   - Ask you to pick a default region — pick `us-central1`.
4. Verify install:
   ```powershell
   gcloud --version
   gcloud config list
   ```

## 1. Deploy (run from the project folder)

Pick **one** of the two auth modes below. The Vertex AI path is recommended for hackathon submissions because it draws on the $300 Google Cloud credits and gives full access to `imagen-4.0-generate-001`.

### 1A. Vertex AI mode (recommended)

```powershell
cd C:\Personal\Hackathons\Google\my-olympian

# Replace YOUR_PROJECT_ID before running
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
  --set-env-vars "GOOGLE_VERTEXAI=1,GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID,GOOGLE_CLOUD_LOCATION=us-central1"
```

Then grant the Cloud Run service account permission to call Vertex AI (one-time):

```powershell
# Get your project number
$projectNumber = gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID `
  --member="serviceAccount:$projectNumber-compute@developer.gserviceaccount.com" `
  --role="roles/aiplatform.user"
```

### 1B. AI Studio key mode (fallback)

```powershell
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

What happens in either mode:
1. `gcloud` zips your local source.
2. Uploads it to Cloud Build.
3. Cloud Build reads your `Dockerfile` and builds the image (~3–5 min first time).
4. Pushes the image to Artifact Registry.
5. Deploys it to Cloud Run.
6. Prints a public URL like `https://my-olympian-XXXXX-uc.a.run.app`.

**Save that URL.** You'll need it for the Devpost submission and the demo video.

## 2. Verify the deploy

```powershell
# Replace with your actual URL
$url = "https://my-olympian-XXXXX-uc.a.run.app"

# Should return 200
Invoke-WebRequest -Uri "$url/" -UseBasicParsing | Select-Object StatusCode

# Should return real Gemini text
Invoke-RestMethod -Uri "$url/api/narrative" -Method POST -ContentType "application/json" -Body '{"archetypeId":"reach-rhythm","paraLeading":true}'
```

Open the URL in an **incognito** window to confirm it's not gated by your Google login.

## 3. Common deploy errors and fixes

| Error message | Fix |
|---|---|
| `Permission denied on resource project ...` | You're not logged in or wrong project — run `gcloud auth login` and `gcloud config set project YOUR_PROJECT_ID`. |
| `Cloud Build API has not been used in project ...` | Enable Cloud Build API (step 0c). Wait 60 seconds, retry. |
| `Step #X: Build failed: ... npm ci` | Look at the build log — usually a TypeScript or lint error. Run `npm run build` locally first to catch these before deploy. |
| `The user-provided container failed to start` | Cloud Run port binding — confirm Dockerfile sets `ENV PORT=8080` and `HOSTNAME=0.0.0.0`. Both are already set in the project's Dockerfile. |
| `Quota exceeded for resource ...` | Region is full. Try a different region: `us-east1` or `us-west1`. |
| `Request had insufficient authentication scopes` | Locally, run `gcloud auth application-default login`. On Cloud Run, ensure the runtime service account has the `roles/aiplatform.user` role (see step 1A). |
| `Vertex AI API has not been used in project ...` | Enable the Vertex AI API in step 0c, then retry. |
| `PERMISSION_DENIED: ... aiplatform.endpoints.predict` | The Cloud Run service account is missing `roles/aiplatform.user`. Re-run the `add-iam-policy-binding` from step 1A. |
| Narrative or image returns mock content | Either credentials are missing or the wrong model is set. In Cloud Run console, confirm env vars: `GOOGLE_VERTEXAI=1`, `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`. |

## 4. Post-deploy hardening (optional but cheap)

```powershell
# Make sure the service stays warm during the judging window
gcloud run services update my-olympian `
  --region us-central1 `
  --min-instances 1
```

`min-instances=1` costs ~$5/month at idle. Negligible against the $300 in hackathon credits.

## 5. Re-deploys (if you change code)

Same `gcloud run deploy` command. Cloud Build caches layers so subsequent deploys take ~90 seconds instead of 3 minutes.

## 6. After successful deploy

1. Update `README.md` — replace the "Live demo" placeholder with your real URL.
2. Update Devpost submission with the URL.
3. Record the demo video against the deployed URL (not localhost).
