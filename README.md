# Jarvio Automation Journey

This repository hosts a static ReactFlow playground that showcases the Jarvio automation journey. Open the page in any modern browser to drag Amazon, AI Agent, Gmail, and Slack blocks, tweak their configuration, and run a guided animation that highlights each step left-to-right.

## Quick start

1. Clone or download this repository.
2. Ensure the `public/` directory stays adjacent to `index.html` (the page loads its icons from there).
3. Open `index.html` in your preferred browser.

No build tools or package managers are required—the page pulls React, ReactDOM, and ReactFlow directly from CDN bundles and uses Babel Standalone to interpret the JSX at runtime.

## Project layout

- `index.html` – Self-contained UI with inline styles and the automation logic.
- `public/` – Brand assets for each block type.

## Features

- **Drag-and-drop canvas** powered by ReactFlow with custom block cards and a minimap.
- **Dynamic library** buttons that let you add additional Amazon, AI Agent, Gmail, or Slack steps.
- **Inline configuration panel** that adapts its fields to the selected block.
- **Test run sequencer** that animates idle, running, and success states from left to right.
- **Accessible styling** including descriptive ARIA labels, focusable blocks, and high-contrast colour choices.

## Browser support

The experience has been tested with Chromium-based browsers and Safari using ECMAScript modules. If you need to run in older browsers, bundle the page with your preferred toolchain.

## License

This project is provided for assessment purposes and does not carry a specific license.
