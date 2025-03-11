# Generative Art Collection

A collection of generative art algorithms implemented in TypeScript using [p5.js](https://p5js.org/).

![Example Image](output/antipi_1.png)

## Overview

This project contains a variety of generative art algorithms, each creating unique visual patterns and compositions. The codebase has been structured to allow for easy experimentation and extension, with shared utilities for common operations like color management, canvas sizing, and image saving.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (latest version recommended)
- A modern web browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/generative-art.git
   cd generative-art
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

4. Open your browser and navigate to the local URL shown in your terminal (typically `http://localhost:5173`)

## Project Structure

```
generative-art/
├── algorithms/              # Individual generative art algorithms
├── data/                    # Shared data files
│   └── colorsPalettes.ts    # Color palettes for different algorithms
├── helpers/                 # Shared utility functions
│   ├── canvasDimensions.ts  # Canvas sizing utilities
│   ├── colorUtils.ts        # Color manipulation utilities
│   ├── index.ts             # Central export file for all helpers
│   ├── keyboardControls.ts  # Keyboard interaction utilities
│   └── saveImage.ts         # Image saving utilities
├── settings.ts              # Global settings (algorithm selection, canvas dimensions)
├── main.ts                  # Main entry point that loads the selected algorithm
├── index.html               # Main HTML entry point
└── style.css                # Global styles
```

## Usage

### Switching Algorithms

To switch between algorithms, modify the `CURRENT_ALGORITHM` value in `settings.ts`. You can specify either an algorithm folder or a specific file within an algorithm folder:

```typescript
// Format: "algorithm" or "algorithm/file"
// Examples:
export const CURRENT_ALGORITHM = "paper"     // Uses algorithms/paper/index.ts
export const CURRENT_ALGORITHM = "paper/paper2"  // Uses algorithms/paper/paper2.ts
```

When only the algorithm name is provided (e.g., "paper"), the system will use the `index.ts` file from that algorithm's folder. To use a different file within the algorithm folder, specify it after a forward slash (e.g., "paper/paper2").

### Canvas Dimensions

You can set canvas dimensions by modifying the constants in `settings.ts`:

```typescript
// Canvas dimensions
export const CANVAS_WIDTH = 960
export const CANVAS_HEIGHT = 960
```

If these constants are commented out, the canvas will use the window dimensions.

### Color Palettes

The color palette is completely independent from the algorithm. You can set the palette to use by modifying the `COLOR_PALETTE` value in `settings.ts`:

```typescript
// Color palette to use
export const COLOR_PALETTE = "op_prob1"
```

Available palettes can be found in `data/colorsPalettes.ts`. This decoupled approach allows you to use any palette with any algorithm, creating unique visual combinations.

### Keyboard Controls

All sketches support the following keyboard controls:
- **Space**: Generate a new variation with a random seed
- **S**: Save the current canvas as a PNG image
