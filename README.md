# stats4PT

A free learning resource about the language and methods of scientific inquiry
in physical therapy. stats4PT focuses on how we move from observations toward
warranted scientific claims through statistical inference, uncertainty,
Bayesian reasoning, causal reasoning, and critical reflection.

## Place in the clinical inquiry ecosystem

Using Boyer's model of scholarship, stats4PT is primarily about **discovery**.
It contributes evidence, estimates, uncertainty, and candidate causal knowledge
to model building, but does not own the integrative model-building process.

- **stats4PT - discovery:** moves from observations toward scientific claims.
- **Physiolog - generative mechanisms:** contributes physiological knowledge
   about how and why effects occur.
- **Models4PT - integration:** combines evidence, mechanisms, context,
   provenance, uncertainty, and disagreement into comprehensive population
   causal models.
- **Clinical Inference Engine - practice:** combines population knowledge with
   individual information to support patient-specific practice reasoning.

See [`docs/ECOSYSTEM_PRINCIPLES.md`](docs/ECOSYSTEM_PRINCIPLES.md) for the
project boundaries and integration rules that govern site copy and future work.

## Author

stats4PT is created by [Sean M. Collins, PT, ScD](https://scollinspt.github.io/),
a physical therapist and Professor of Clinical Inquiry in the Doctor of Physical
Therapy Program at Plymouth State University.

- [About](https://scollinspt.github.io/about.html)
- [Research program](https://scollinspt.github.io/research.html)
- [Publications](https://scollinspt.github.io/publications.html)
- [GitHub](https://github.com/scollinspt)
- [LinkedIn](https://www.linkedin.com/in/sean-collins-868b3a391/)
- [The Peripatetic Physical Therapist](https://peripateticpt.substack.com/)

## What this repo includes

- A dedicated course homepage (`/index.html`) for the stats4PT project
- Eight complete, self-hosted lesson pages in `/lessons`
- Local copies of all lesson figures in `/img/lessons`
- Lightweight shared styling (`/assets/styles.css`)
- An image folder for logos (`/img`)
- A repeatable content importer (`/tools/import_substack.py`)

## Publishing with GitHub Pages

The site deploys through `.github/workflows/pages.yml` whenever changes are
pushed to `main`.

The published site is available at:

<https://stats4PT.org/>

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