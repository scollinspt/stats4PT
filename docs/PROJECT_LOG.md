# stats4PT Project Log

## 2026-08-24 - Curriculum revision and repository-native publishing

### Completed

- Reviewed the complete course and revised the eight-lesson sequence for a
  clearer progression from statistical inference and causality through Bayesian
  reasoning, mechanisms, causal diagrams, and statistical fallacies.
- Replaced the Getting Started placeholder with a course orientation.
- Added estimated times, learning objectives, prerequisites, key terms, and
  transitions to the lessons.
- Corrected conceptual boundaries: Bayesian updating does not establish
  causality, critical-realist domains remain ontologically distinct, mechanisms
  require evidence, and DAG arrows represent explicit causal assumptions.
- Clarified the roles of stats4PT, Physiolog, Models4PT, and the Clinical
  Inference Engine within the clinical inquiry ecosystem.
- Updated the homepage course descriptions, lesson order, author attribution,
  and project links.
- Established this repository as the sole source of truth for authoring and
  publishing stats4PT.
- Removed the obsolete Substack importer, link loader, bootstrap content list,
  platform-specific controls, and dead links.
- Updated the README and roadmap to reflect the repository-native workflow and
  completed curriculum work.

### Validation

- Formatted the homepage and all lesson pages with Prettier.
- Verified all 159 page references and local asset targets.
- Verified the complete lesson navigation chain.
- Confirmed `git diff --check` passes.
- Confirmed the revised production content at <https://stats4pt.org/>.

### Release

- Commit: `d06ad998896a1ad887d2d7d088d3cc56bccc8e2b`
  (`Revise stats4PT lesson curriculum`)
- Branch: `main`
- GitHub Pages workflow run: `32714979366`
- GitHub Pages deployment: `6060529299` (`success`)

### Next priorities

- Add canonical and Open Graph metadata to every page.
- Add last-reviewed dates, consistent equation rendering, in-page navigation,
  citations, and automated link checks.
- Add reciprocal ecosystem links when working in the corresponding project
  repositories.
