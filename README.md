# Site Intelligence Prototype
## Prototype Demo Project

SiteIntel uses one fictional Oil India Limited-related scenario for demonstration:

- **Project:** OIL Assam Pipeline Expansion - Construction Package
- **Activity:** Pipeline Trench Preparation - Section A - Chainage 12+500
- **Report:** "Trench preparation completed at Ch. 12+500 in Section A. Excavation and bedding work completed."
- **AI match:** 94% confidence, 100% progress

This is prototype/demo data and does not represent confidential or operational Oil India Limited information.

## Judge demo flow

1. Start on **Dashboard** and point out the 68% actual versus 74% planned progress, the six delayed activities, and the three critical alerts.
2. Open **Document Intelligence** and choose **Use sample** for `OIL_Assam_Pipeline_DPR_Demo.xlsx`.
3. Let the staged processing sequence complete, then show the four extracted activities, normalized terms, progress values, and confidence scores.
4. Open **Activity Matching** and show how “Earth filling” becomes “Earthwork Filling – Zone B” with a confidence score.
5. Open **Progress & Risk** and highlight the 12% Pier Construction variance, HIGH risk, likely cause, and recommended action.
6. Open **Project Insights** and click **Generate project report** to show the weekly intelligence brief and priority actions.
7. Use **Demo Mode** at any point to reset the experience to the complete sample scenario.

## Intentionally mocked

- XLS and XLSX files are parsed client-side with SheetJS. PDF, DOCX, and CSV uploads are accepted for the prototype but still use the simulated demo extraction path.
- There is no authentication, database, external AI API, OCR service, or cloud dependency.
- The sample project data is static and designed for a 3–5 minute demonstration.
- All modules use one shared prototype project state; no separate supervisor dataset has been introduced.

## Future replacement points

- Replace the PDF/DOCX/CSV extraction path in `src/App.jsx` with OCR/document-processing API calls.
- Replace matching rows with an NLP/LLM or vector-search service that returns normalized schedule IDs and confidence scores.
- Replace the activity arrays with a schedule/project API or database query.
- Replace the risk summary with a backend rule engine or predictive model consuming time-series progress data.
- Replace the report modal with a backend report generator that persists and exports PDF/DOCX reports.

A local Smart India Hackathon prototype for construction project intelligence. It demonstrates the workflow from field document ingestion to activity normalization, schedule matching, progress tracking, risk analysis, and an automatically generated project brief.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://127.0.0.1:5173/`.

For a production bundle:

```bash
npm run build
npm run preview
```

## Publish on GitHub Pages

This repository includes [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml),
which builds and publishes the app automatically whenever `main` is pushed.

1. Create a new GitHub repository. The repository can have any name.
2. From this project folder, initialize Git and push the project:

   ```bash
   git init
   git branch -M main
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/<your-user>/<your-repository>.git
   git push -u origin main
   ```

3. In GitHub, open **Settings > Pages** and set **Source** to **GitHub Actions**.
4. Open the repository's **Actions** tab and wait for **Deploy to GitHub Pages** to finish.
5. Open the URL shown by the workflow, normally
   `https://<your-user>.github.io/<your-repository>/`.

The Vite build uses relative asset URLs, so the page works whether the repository
is published under a project URL or at a custom/root Pages URL. Do not upload
only the `src` folder; the workflow builds and publishes `dist`.
