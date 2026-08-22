# stats4PT

A simple GitHub Pages site starter for a free physical therapy statistics learning hub.

## What this repo now includes

- A dedicated homepage (`/index.html`) for the stats4PT project
- A starter lessons page (`/lessons/getting-started.html`)
- Lightweight shared styling (`/assets/styles.css`)
- An image folder for logos (`/img`)
- A source-text file for Substack lesson links (`/stats4PT main page info.txt`)

## Publishing with GitHub Pages

1. Push this repository to GitHub.
2. In **Settings → Pages**, set:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or your default branch)
   - **Folder**: `/ (root)`
3. Save settings and wait for deployment.

Your site will be available at:

`https://<your-github-username>.github.io/stats4PT/`

## Bringing in your Substack content

1. Put your welcome-page lesson links in:

`/stats4PT main page info.txt`

Use one lesson per line:

`Lesson title | https://...`

2. Put your logo files in:

`/img`

3. Use each lesson page in `/lessons` as a dedicated destination for a cleaned-up version of your Substack posts:

- Keep a short learning summary
- Add practical PT-focused examples
- Include a “Read original post” link back to Substack

Duplicate and adapt `/lessons/getting-started.html` for each new topic.