# stats4PT

A simple GitHub Pages site starter for a free physical therapy statistics learning hub.

## What this repo includes

- A dedicated course homepage (`/index.html`) for the stats4PT project
- Eight complete, self-hosted lesson pages in `/lessons`
- Local copies of all lesson figures in `/img/lessons`
- Lightweight shared styling (`/assets/styles.css`)
- An image folder for logos (`/img`)
- A repeatable content importer (`/tools/import_substack.py`)

## Publishing with GitHub Pages

1. Push this repository to GitHub.
2. In **Settings → Pages**, set:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or your default branch)
   - **Folder**: `/ (root)`
3. Save settings and wait for deployment.

Your site will be available at:

`https://<your-github-username>.github.io/stats4PT/`

## Refreshing the lesson content

The lesson text and images are stored in this repository, so visitors do not
need Substack to read the course. To refresh all local lessons from the original
public posts, run:

```sh
python3 tools/import_substack.py
```

To refresh one lesson while working on the importer, use its Substack slug:

```sh
python3 tools/import_substack.py --slug introduction-to-statistical-inference
```

The importer reads Substack's structured public post data, downloads article
figures, preserves the article HTML, and rewrites links between the eight lessons
to local URLs. Substack is an import source, not a runtime dependency of the site.