# Jarvio Automation Journey

This project provides an interactive automation journey canvas that can be opened directly in a browser without installing dependencies. It renders draggable blocks for Amazon, AI Agent, Gmail, and Slack, allows you to configure each step, and animates a left-to-right test run so you can preview how data moves through the workflow.

## Getting started

1. Clone or download this repository.
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox, or Safari).

That is all you need — the page loads React, React DOM, and React Flow from public CDNs at runtime. If you prefer to serve the files locally, run a simple static server:

```bash
python3 -m http.server 4173
```

Then visit [http://localhost:4173](http://localhost:4173) in your browser.

## Features

- **Drag-and-drop canvas** – React Flow powers a polished board where you can reposition cards, add new ones from the toolbar, and remove any step you no longer need.
- **Contextual configuration** – Selecting a block reveals a side panel with tailored dropdowns and inputs for Amazon datasets, AI Agent prompts, Gmail messages, and Slack alerts.
- **Guided run preview** – Trigger a demo run to watch each card progress through idle, running, and success states in sequence, mirroring the automation journey.
- **Instant updates** – Node labels and summaries reflect your configuration in real time, making the mock flow ideal for demos and stakeholder reviews.

## Project structure

The app is implemented as a lightweight, browser-ready React experience:

- `index.html` bootstraps fonts, styles, and the module scripts.
- `app.js` wires application state, node lifecycle, and the configuration panel.
- `flow-canvas.js`, `block-config-panel.js`, and `use-test-run.js` break the UI into focused modules.
- `styles.css` contains the UI theme so the interface matches the Jarvio brand reference.
- `assets/` houses the SVG logos for each integration block.

Because everything runs client-side, you can host these files on any static site provider (GitHub Pages, Netlify Drop, S3, etc.) or bundle them with other documentation without additional tooling.
