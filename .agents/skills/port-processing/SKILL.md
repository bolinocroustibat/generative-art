---
name: port-processing
description: Use when porting a Processing sketch to p5.js WEBGL, or when a sketch is off-center, too small, or stuck at the bottom because of camera, ortho, or Y-axis differences.
---

# Processing to p5.js WEBGL

Processing puts the origin at the top-left and +Y goes down. Fixed multipliers (`width * 1.0`, camera z of `-1000`) work there.

p5.js WEBGL puts the origin at the center and +Y goes up. Scale positions and sizes from the canvas. The canvas is already centered; do not add `width / 2`, `height / 2`.

## Camera

Orthographic projection with an explicit box. Move the camera up to compensate for the flipped Y axis, and scale its distance with the canvas.

```typescript
const zoom = 1.2
p.ortho(
	(-p.width / 2) * zoom,
	(p.width / 2) * zoom,
	(-p.height / 2) * zoom,
	(p.height / 2) * zoom,
	0,
	p.max(p.width, p.height) * 4,
)

const size = p.max(p.width, p.height)
p.translate(0, -p.height * 0.25, -size * 1.5)
```

Replace Processing's fixed multipliers with `size * multiplier`. Skip geometry below a canvas-relative threshold (`size * 0.1`) instead of a pixel constant. Initial object size is typically `size * 1.5`.

Create the canvas with `p.WEBGL`. p5.js `smooth()` takes no sample-count argument, so drop Processing's `smooth(8)`.

## When the picture is wrong

- Pattern sits at the bottom: add a vertical offset, `p.translate(0, -p.height * 0.25, z)`.
- Pattern is too small or too large: drive every size from `const size = p.max(p.width, p.height)`.
- Pattern is off-center: leave the origin at `(0, 0, z)`.
