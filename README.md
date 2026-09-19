# Elie Bitonda Tuyizere — portfolio

A dependency-free HTML, CSS, and JavaScript portfolio. No build step, PHP backend, framework, or secret keys are required.

## GitHub Pages deployment

1. Copy the **contents of `site/`** into the root of the `elie-bitonda-portfolio` repository. Preserve `.nojekyll` and `LICENSE`. Do not copy backups, old reference folders, `tools/`, or `qa/`.
2. Commit and push these files to the branch used for publishing.
3. In the repository's **Settings → Pages**, select **Deploy from a branch**, select your publishing branch and **/(root)**, and save.
4. Check the published site at `https://elie-bitonda.github.io/elie-bitonda-portfolio/`. Relative asset paths support this repository subpath.
5. If changing the domain or repository, update the canonical URL, Open Graph URLs, Twitter image URL, and Person URL in `index.html`.

Nothing has been pushed or published by this rebuild.

## Contact activation

The native form action and JavaScript AJAX endpoint are configured for `ebitonda@andrew.cmu.edu`. No account ID or private key is needed. See [FormSubmit documentation](https://formsubmit.co/) and [AJAX documentation](https://formsubmit.co/ajax-documentation).

From the deployed HTTPS page, send one genuine test enquiry. FormSubmit may email an activation link to the owner on first use. Open the CMU inbox (and spam folder), confirm the address, then submit again and verify that the enquiry arrives and Reply-To works. Repeat this check after changing the hosting domain if the service requests activation again.

AJAX success means the provider accepted the request, not that inbox delivery has been independently confirmed. Local QA uses intercepted success/failure responses and sends no mail. A 20-second timeout preserves the visitor's text when delivery cannot be confirmed. The visible direct-email link remains available.

The `_honey` field supplies basic bot protection; client-side checks are not a substitute for the provider's server-side spam filtering. No secret is exposed in the frontend. Visitors are informed that the form sends their data through FormSubmit. The no-JavaScript fallback submits directly to the provider with native browser validation.

## Add a real CV

Place the public CV at `assets/docs/Elie_Bitonda_Tuyizere_CV.pdf`. An exact, commented Download CV anchor is already prepared beside the contact links in `index.html`; uncomment it after adding the file. You can also add the same anchor to the header or hero actions. Do not publish private identity documents. No fake PDF or broken download link is included.

## Project media and links

The malaria card and case study use selected metadata-free microscopy derivatives with matched experiment outputs. Its gallery includes two source fields, exact tiling diagrams, a saved-record tile rendering, complete annotated fields, and an unchanged detail crop. `assets/img/projects/malaria/engineering-runs.json` exposes only allowlisted experimental summary fields. Research reports, full datasets, raw experiment directories, and model weights must remain outside the deployed site.

The other three project visuals remain labelled engineering schematics. Supply publication-approved project photographs/screenshots to replace them if desired. Update each corresponding image and its alt text in `index.html`; those detail dialogs automatically reuse the card visual.

Project-specific repository/demo links, individual responsibilities for the accident project, subsystem details for KwandaBot, and measured outcomes were not available. Add them only after verification. The GitHub profile link already uses the supplied real URL.

## Editing

- `index.html`: content, contact recipient in form action, SEO, project case-study articles.
- `assets/css/style.css`: palette, typography, layout, transitions, responsive styles.
- `assets/js/main.js`: video, navigation, reveals, project filters and native dialogs.
- `assets/js/contact.js`: matching contact recipient in `endpoint`, submission and validation.
- `assets/css/malaria.css` and `assets/js/malaria.js`: scoped case-study styling and accessible image gallery.
- `assets/img/`: original schematics, hero poster, favicon, social sharing card.
- `assets/video/engineering.mp4`: existing portfolio video (approximately 1.1 MB).

System typography avoids external font requests. The hero video has a poster, pause control, reduced-motion handling, and pauses when out of view. Inline case studies remain readable if JavaScript is unavailable.
