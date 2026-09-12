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
See [`docs/PROJECT_LOG.md`](docs/PROJECT_LOG.md) for completed milestones,
validation records, and releases.

## Author

stats4PT is created by [Sean M. Collins, PT, ScD](https://scollinspt.github.io/),
a physical therapist and Professor of Clinical Inquiry in the Doctor of Physical
Therapy Program at Plymouth State University.

- [About](https://scollinspt.github.io/about.html)
- [Research program](https://scollinspt.github.io/research.html)
- [Publications](https://scollinspt.github.io/publications.html)
- [GitHub](https://github.com/scollinspt)
- [LinkedIn](https://www.linkedin.com/in/sean-collins-868b3a391/)

## What this repo includes

- A dedicated course homepage (`/index.html`) for the stats4PT project
- Eight complete, self-hosted lesson pages in `/lessons`
- Standalone classroom resources in `/presentations`
- Local copies of all lesson figures in `/img/lessons`
- Lightweight shared styling (`/assets/styles.css`)
- An image folder for logos (`/img`)

## Source of truth

This repository is the canonical source for all stats4PT content, design, and
functionality. Development begins with the tracked files here and ends with the
deployment to <https://stats4PT.org/>. The lessons do not depend on an external
publishing platform, import process, or content synchronization service.

## Publishing with GitHub Pages

The site deploys through `.github/workflows/pages.yml` whenever changes are
pushed to `main`.

The published site is available at:

<https://stats4PT.org/>
