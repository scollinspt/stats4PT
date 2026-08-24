# stats4PT TODO

## Custom domain

- [x] Choose and register a domain for stats4PT: `stats4PT.org`.
- [x] Decide whether stats4PT should use its own domain or a subdomain within the
      broader clinical inquiry ecosystem.
- [x] Add the chosen domain to the GitHub Pages settings.
- [x] Configure DNS records for the apex domain and `www` subdomain.
- [x] Add a `CNAME` file to this repository.
- [x] Enable and verify HTTPS after DNS propagation.
- [x] Redirect `www.stats4PT.org` to canonical `https://stats4PT.org/`.
- [x] Update the README and main portfolio to use the canonical URL.
- [ ] Add canonical metadata to the stats4PT pages.

### Registrar recommendation

Start with **Cloudflare Registrar** if its supported top-level domains include
the domain you choose. It generally offers at-cost registration and renewal,
WHOIS privacy, strong DNS, DNSSEC, and a good fit for a GitHub Pages site. The
main tradeoff is that domains registered there must use Cloudflare nameservers.

Choose **Namecheap** if you value a more conventional registrar interface,
broader domain selection, independent nameserver control, or registrar support
more than the lowest renewal cost. Check the renewal price rather than only the
first-year promotional price before purchasing.

For the initial GitHub Pages setup, use DNS-only records until the custom domain
and HTTPS certificate work reliably. Cloudflare proxying can be evaluated later
if its caching or security features are actually needed.

## Clinical inquiry ecosystem

- [x] Document the ecosystem's scholarly purposes and project boundaries in
      `docs/ECOSYSTEM_PRINCIPLES.md`.
- [ ] Use this shared architecture in every ecosystem description and diagram:
      stats4PT develops the language and methods of discovery from observations
      toward scientific claims; stats4PT and Physiolog make distinct
      contributions to Models4PT; Models4PT performs integrative model building;
      and the Clinical Inference Engine supports patient-specific practice
      reasoning.
- [x] Add stats4PT to the main portfolio at <https://scollinspt.github.io/> and
      its research/projects pages.
- [x] Add an ecosystem section to the stats4PT homepage with clear descriptions,
      boundaries, and links to each related project.
- [ ] Link relevant stats4PT lessons to Physiolog at <https://physiolog.org/>,
      especially its textbook and simulations, while keeping those resources
      owned by Physiolog.
- [ ] Link causal-modeling lessons to the Models4PT repository at
      <https://github.com/scollinspt/Models4PT> as examples of the distinct
      integrative model-building process.
- [ ] Link Bayesian and patient-specific reasoning lessons to the Clinical
      Inference Engine repository at
      <https://github.com/scollinspt/Clinical-Inference-Engine>, explicitly
      distinguishing education about Bayesian reasoning from practice reasoning.
- [x] Add a reciprocal link back to stats4PT from the main portfolio.
- [ ] Add reciprocal links back to stats4PT from Physiolog, Models4PT, and the
      Clinical Inference Engine.
- [x] Add author attribution and canonical portfolio, About, research,
      publications, GitHub, LinkedIn, public-writing, and contact links to the
      stats4PT site.
- [ ] Apply the shared terminology for observations, evidence, claims,
      generative mechanisms, population causal knowledge, individual
      information, uncertainty, and practice reasoning across every project.
- [ ] Create a cross-project content and data ownership table so integrations do
      not blur the boundaries documented in `docs/ECOSYSTEM_PRINCIPLES.md`.
- [ ] Label each lesson integration as educational content, a conceptual link, a
      shared knowledge representation, or a software/data interface.
- [ ] Define a provenance-preserving handoff from stats4PT examples to candidate
      evidence or causal claims that Models4PT can evaluate and integrate.
- [ ] Define how Physiolog mechanisms can be referenced by Models4PT without
      copying or obscuring their source and assumptions.
- [ ] Create a consistent visual identity and navigation convention across the
      ecosystem without making the projects indistinguishable.

## Interactive lessons

### Simulations

- [ ] Inventory existing Physiolog simulations that can support stats4PT lessons.
- [ ] Match each useful simulation to a lesson and a specific learning objective.
- [ ] Prototype an embedded simulation in one lesson with a non-embedded fallback
      link for accessibility and restrictive browsers.
- [ ] Build a sampling-distribution simulation for sample size, standard error,
      and confidence intervals.
- [ ] Build a Bayesian updating simulation using prevalence, sensitivity,
      specificity, and sequential evidence.
- [ ] Build an interactive causal-model exercise for confounders, mediators,
      colliders, and backdoor paths as discovery-oriented instruction; hand off
      comprehensive model building to Models4PT.
- [ ] Add instructions, reflection prompts, and interpretation questions around
      each simulation rather than presenting it as an isolated widget.
- [ ] Verify keyboard access, mobile behavior, reduced-motion support, and useful
      fallback content for every simulation.

### Videos

- [ ] Inventory existing videos and identify lesson sections that benefit from
      demonstration rather than additional prose.
- [ ] Choose a durable video host and embedding policy.
- [ ] Add responsive, privacy-conscious video embeds that load only when needed.
- [ ] Provide captions, transcripts, titles, durations, and direct fallback links.
- [ ] Add short orienting text before each video and reflection prompts after it.

### Quizzes

- [ ] Define measurable learning objectives for each lesson before writing quiz
      questions.
- [ ] Create a small question bank for each lesson with explanations for correct
      and incorrect responses.
- [ ] Prototype an accessible, client-side formative quiz that requires no login
      and stores no personal or clinical data.
- [ ] Include scenario-based questions that test interpretation and causal
      reasoning rather than arithmetic recall alone.
- [ ] Add immediate feedback, retry behavior, and a clear reset control.
- [ ] Decide whether progress should remain in the browser or later integrate
      with a learning platform; document privacy implications before tracking.
- [ ] Test quizzes with students and clinicians, then revise ambiguous items.

## Content and maintenance

- [x] Revise the eight-lesson sequence for progressive flow, distinct lesson
      purposes, accurate causal and critical-realist terminology, and explicit
      cross-project boundaries.
- [x] Add lesson learning metadata: estimated time, objectives, prerequisites,
      and key terms.
- [x] Remove the obsolete Substack import workflow, bootstrap artifacts,
      platform-specific lesson prose, and dead links. The repository is the sole
      source of truth for stats4PT.
- [ ] Add a last-reviewed date to each lesson.
- [ ] Correct equation markup and render mathematical notation consistently.
- [ ] Add a table of contents and in-page navigation to long lessons.
- [ ] Add citations or reference sections in a consistent format.
- [ ] Add automated checks for broken internal links and missing local assets.
- [ ] Add basic privacy-respecting traffic analytics only if the resulting data
      will answer a defined project question.
