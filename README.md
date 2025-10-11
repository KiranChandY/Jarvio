# Jarvio Automation Journey

This project contains a React + TypeScript workspace that renders the Jarvio automation flow on top of React Flow. Use the toolbar to add Amazon, AI Agent, Gmail, and Slack blocks, configure each step in the side panel, and play through the left-to-right run state animation.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm 9+ (ships with Node.js)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Launch the Vite development server:

   ```bash
   npm run dev -- --open
   ```

   The app is served on `http://localhost:5173` by default and the command opens it in your browser.

3. Build for production:

   ```bash
   npm run build
   ```

4. Preview the production bundle locally:

   ```bash
   npm run preview
   ```

## Project structure

```
├── public/                # Static assets served as-is
│   ├── ai-agent.svg
│   ├── amazon.svg
│   ├── favicon.svg
│   ├── gmail.svg
│   └── slack.svg
├── src/
│   ├── App.tsx            # Composition of the canvas and configuration panel
│   ├── components/
│   │   ├── BlockConfigPanel.tsx
│   │   └── FlowCanvas.tsx
│   ├── hooks/
│   │   └── useTestRun.ts  # Run state controller
│   ├── assets/            # In-app SVG imports
│   ├── styles.css         # Global styling for the UI
│   ├── types.ts
│   └── main.tsx           # React entry point
├── index.html             # Vite entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Features

- **Interactive canvas** – Drag nodes, reorder them, and connect them automatically in sequence.
- **Block library** – Add new Amazon, AI Agent, Gmail, or Slack steps with matching iconography.
- **Configuration side panel** – Update dropdowns and text fields for the selected block and see the node refresh instantly.
- **Run state animation** – Trigger an orchestrated left-to-right walkthrough that displays idle, running, and success states.
- **Responsive layout** – Works across desktop and tablet breakpoints with accessible focus states and ARIA-friendly markup.

## Linting and quality

Run ESLint to keep the codebase tidy:

```bash
npm run lint
```

## License

This project is provided for assessment purposes and does not carry a specific license.
