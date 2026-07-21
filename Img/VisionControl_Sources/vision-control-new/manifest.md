# VisionControl. AI Framer Media Manifest

Source page: https://timshih.framer.website/works/vision_control_ai

Downloaded on: 2026-07-07

| File | Type | Page position | Description | Source URL |
|---|---|---|---|---|
| `01-background-vanta.mp4` | Video | Full-page background, starts at top of page | Vanta-style ambient background video behind the VisionControl page | https://framerusercontent.com/assets/HzjGHaAkgzP74d5z6PJEg0uY.mp4 |
| `02-global-nav-logo.png` | Image | Global navigation, top-left | Tim Shih site logo used in the shared nav; probably global chrome, not case-study content | https://framerusercontent.com/images/QtjfACCXzkqES8ib3U6qpzE3U0.png?width=616&height=162 |
| `03-hero-thumbnail.png` | Image | Hero / intro area, first large image after intro text | VisionControl. AI main thumbnail image | https://framerusercontent.com/images/5YZsHsAsS3h2A9Gc3txKqAin9js.png?width=3000&height=2000 |
| `04-problem-framing-image-1.png` | Image | Problem Framing & Technical Pivot, first image | Sample project image shown after the problem framing text | https://framerusercontent.com/images/ROJlKJOMzaReTl2ayrrPp3r9ZA.png?width=2120&height=1132 |
| `05-problem-framing-image-2.png` | Image | Problem Framing & Technical Pivot, second image | Sample project image shown after the first problem framing image | https://framerusercontent.com/images/oViuFVC1Cq1WB0m9RtMTfqEWkTI.png?width=2120&height=1266 |
| `06-ml5-pose-tracking-demo.mp4` | Video | ML5.JS / Process area, first media after ML5.JS text | Webcam pose-tracking demo video with red skeletal tracking lines | https://framerusercontent.com/assets/rF4hFqmPDXUSbAeLY9S3yRbOkug.mp4 |
| `07-javascript-skeleton-capture.png` | Image | ML5.JS / Process area, image after pose-tracking video | JavaScript / skeletal-line capture or workflow screenshot | https://framerusercontent.com/images/xR0O8OLOTfjoYwhHAzUsteAAcU.png?width=3096&height=1964 |
| `08-stable-diffusion-controlnet-result.png` | Image | ML5.JS / Process area, final image | Stable Diffusion / ControlNet output or technical workflow result | https://framerusercontent.com/images/f07MIy83eiD52MNVfmbSPGyp44.png?width=6912&height=4604 |

Notes:

- Framer also exposes default favicon / touch-icon assets. I did not download them because they are global browser icons, not VisionControl page content.
- The rendered page exposes `alt="Thumbnail image"` on the hero image and `alt="Sample project image"` on the other project images. No more specific image alt text was present in the DOM.
- The current `data-vision-control-new.js` still uses placeholders per the earlier template rule. These files are ready to use later if you decide to replace placeholders with real `image` / `video` entries.

---

# Process / Behind-the-Scenes Batch (added to `Research & Problem Framing`, `Solution & Product Direction`, `Building the PoC` sections)

Added on: 2026-07-17

Target page: `vision-control-rewritten.html` (data file: `data/data-vision-control-rewritten.js`)

These images live directly under `Img/` in three folders Tim organized by section name (`Img/Research & Problem Framing/`, `Img/Solution & Product Direction/`, `Img/Build The PoC/`), not inside this `vision-control-new/` folder. They were left at their original paths and filenames rather than moved/renamed, since the filenames themselves are descriptive and map directly onto the sub-headers already written in each section's content — moving them would have thrown away that correspondence. `&` characters in the paths are HTML-escaped as `&amp;` in the data file's `src` values.

**Layout (revised 2026-07-17, second pass):** these are NOT embedded inline in the section text anymore. The `sections` schema now supports an optional `media: [{ type, src, alt, afterHeading }]` array per section — when present, the section renders the same left-media-column / right-text-column split as the OVERVIEW block (previously sections were single-column, text-only, which is what an earlier pass of this insertion got wrong: images were hand-embedded as inline `<img>` tags interrupting the text flow). `afterHeading` names the exact `<strong>` sub-header text the image is tied to; on desktop (≥1024px) the media column shows one image at a time and cross-fades to the matching image as the user scrolls the text column past that sub-header (scroll-sync, via `js/case-study-template.js`'s `initScrollSyncMedia()`). Below 1024px, the text column has no independent scroll, so scroll-sync doesn't apply — the media column instead shows all of a section's images stacked in normal reading order, same as OVERVIEW's own mobile behavior.

| File | Section | `afterHeading` | Purpose |
|---|---|---|---|
| `Img/Research & Problem Framing/R&PF_ID+TPC — Internship Discovery + Traditional Production Costs.png` | Research & Problem Framing | Traditional Production Costs | Documents the internship observation and traditional photoshoot cost/timeline context that motivated the project |
| `Img/Research & Problem Framing/R&PF_EAIE+KPP — Early AI Experiments + Key Pain Points.png` | Research & Problem Framing | Key Pain Points | Shows the early text-to-image experiments and the four recurring pain points they exposed |
| `Img/Research & Problem Framing/R&PF_OS — Opportunity Statement.png` | Research & Problem Framing | Opportunity Statement | Illustrates the opportunity statement that closes out the section |
| `Img/Solution & Product Direction/S&PD — Direct Input & System Flow.png` | Solution & Product Direction | Proposed System Flow | Diagrams the direct pose-input concept and the proposed system flow described in the closing paragraph |
| `Img/Build The PoC/BTPC — Debug the Pipeline One Layer at a Time.png` | Building the PoC | Debugging Approach | Shows the pipeline broken into independently-tested stages during debugging |
| `Img/Build The PoC/BTPC — From Movement to Generated Image.png` | Building the PoC | Technical Breakthrough | Shows the moment physical movement was successfully translated into a generated character, the project's technical breakthrough |

Notes:

- I have not visually inspected these images myself — alt text and "purpose" descriptions above are inferred from filenames and the surrounding written content, not from looking at the actual image contents. Worth a quick check that they match once you see them rendered.
- `afterHeading` is matched against the rendered `textContent` of `<strong>` elements inside the section's text column (plain text, no HTML tags) — if a sub-header's exact wording ever changes in `content`, the matching image in `media` needs its `afterHeading` updated to match, or the scroll-sync trigger for that image silently stops firing (it just falls back to whatever was last active, no error thrown).
