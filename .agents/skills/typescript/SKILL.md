---
name: typescript
description: Use when writing or editing TypeScript in this repo. Covers p5.js types, explicit return types, import extensions, null checks, and Biome formatting.
---

# TypeScript

Lint and format with Biome. Semicolons only when needed (`semicolons: "asNeeded"` in `biome.json`).

```bash
bun run check
```

Compiler options are in `tsconfig.json` (`strict`, `allowImportingTsExtensions`, `verbatimModuleSyntax`, `noEmit`). Do not invent a second config.

## Imports

Use explicit extensions. External packages first, then project modules.

```typescript
import p5 from "p5"

import { getCanvasDimensions } from "../../helpers"
```

## Types

Type the p5 sketch callback, async setup, vectors, colors, and arrays. Give functions an explicit return type. Do not use `any`. Avoid assertions; narrow with a type guard instead.

```typescript
import p5 from "p5"

const sketch = (p: p5) => {
	const position: p5.Vector = p.createVector(x, y, z)
	const color: p5.Color = p.color(r, g, b)
	const points: p5.Vector[] = []

	p.setup = async (): Promise<void> => {}

	const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
		return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
	}
}
```

Check null and undefined before use:

```typescript
if (colors && colors.length > 0) {
	const color = colors[p.floor(p.random(colors.length))]
}
```
