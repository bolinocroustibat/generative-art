# Generative art

TypeScript sketches with p5.js. One piece per folder under `algorithms/`. Shared utilities live in `helpers/`. The sketch on screen is `CURRENT_ALGORITHM` in `settings.ts` (`"paper"` loads `algorithms/paper/index.ts`, `"paper/paper2"` loads `algorithms/paper/paper2.ts`).

## Commands

- `bun install`
- `bun run dev` — Vite dev server
- `bun run check` — format and lint with Biome (`biome check --write .`)

Compiler flags live in `tsconfig.json`. Do not copy them into instructions.

## Language

Code, comments, names, and commit messages are in English.

## Algorithms

- Entry file: `algorithms/<name>/index.ts`.
- Import shared helpers from that file's relative path to `helpers` (often `../../helpers`): `getCanvasDimensions`, `getColorPalette`, `getRandomColor`, `setupKeyboardControls`.
- `index.ts` is the main port. A variant, including an animation, is another file in the same folder (`order/order3Motion.ts`). Do not add a new top-level folder for an animation.
- Original Processing sketches live in `processing/`, a local gitignored clone. Do not copy a `.pde` into `algorithms/`.

Colors come from `getColorPalette()` in setup and `getRandomColor(p, colors)` while drawing. Every sketch follows this shape:

```typescript
import p5 from "p5"
import { getCanvasDimensions, getColorPalette, getRandomColor, setupKeyboardControls } from "../../helpers"

const sketch = (p: p5) => {
	let seed: number
	let colors: string[]

	p.setup = async (): Promise<void> => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.WEBGL)
		p.pixelDensity(2)

		colors = await getColorPalette()
		seed = p.floor(p.random(999999))
		generate()
	}

	const generate = (): void => {
		p.randomSeed(seed)
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "yourAlgorithm",
	})
}

new p5(sketch)
```

## Skills

On-demand procedures live in `.agents/skills/`. Read the matching skill before that work:

- `typescript` — types, imports, and Biome style when editing TypeScript
- `port-processing` — Processing to p5.js WEBGL (origin, Y axis, camera, scale)
