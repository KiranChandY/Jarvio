# Jarvio Flow Builder

A React + Vite playground for experimenting with Jarvio-style automation flows. Drag nodes around the canvas, tweak their configuration, and trigger a guided "test run" animation to watch each block execute from left to right.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (which bundles npm)

### Installation

```bash
npm install
```

### Running the development server

```bash
npm run dev
```

The app will be available at the URL printed in the terminal (typically `http://localhost:5173`).

### Linting

```bash
npm run lint
```

### Production build

```bash
npm run build
```

## Project structure

- `src/components/FlowCanvas.tsx` – React Flow canvas with creation, deletion, and animation controls.
- `src/components/BlockConfigPanel.tsx` – Contextual form that updates the selected block configuration.
- `src/hooks/useTestRun.ts` – Run-state controller that steps through nodes and updates visual statuses.
- `src/components/nodes/BlockNode.tsx` – Custom node renderer with status badges and summaries.
- `public/*.svg` – Brand-inspired icons used throughout the UI.

## Accessibility & design notes

- Keyboard focus and ARIA labels are provided for the interactive flow canvas and settings panel.
- The colour palette was tuned for clarity and contrast, striving to pass the “grandmother test”.

## License

This project is provided for assessment purposes and does not carry a specific license.
