import p5 from "p5"
import { getColorPalette, getCanvasDimensions, setupKeyboardControls } from "../../helpers/index.ts"

// Create a p5.js sketch in instance mode
const sketch = (p: p5) => {
	let seed: number
	const colors: string[] = getColorPalette()

	// Box class equivalent to the Processing version
	class Box {
		x: number
		y: number
		z: number
		w: number
		h: number
		d: number

		constructor(x: number, y: number, z: number, w: number, h: number, d: number) {
			this.x = x
			this.y = y
			this.z = z
			this.w = w
			this.h = h
			this.d = d
		}
	}

	p.setup = (): void => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.WEBGL)
		p.smooth()
		p.pixelDensity(2)
		
		// In p5.js, we need to set these differently than Processing
		// Processing's ENABLE_STROKE_PERSPECTIVE doesn't exist in p5.js
		p.rectMode(p.CENTER)
		
		seed = p.floor(p.random(999999)) // Initialize seed
		generate()
	}

	p.draw = (): void => {
		// This is intentionally empty as we're using generate() for drawing
	}

	const generate = (): void => {
		p.randomSeed(seed)
		p.noiseSeed(seed)
		p.background(255)

		p.translate(p.width * 0.5, p.height * 0.55, -200)
		p.rotateX(p.HALF_PI)
		p.rotateY(p.random(-0.1, 0.1))
		p.rotateZ(p.random(-0.1, 0.1))

		p.scale(0.6)

		p.strokeWeight(0.2)

		// Create boxes array
		const boxes: Box[] = []
		boxes.push(new Box(0, 0, 0, p.width * 2, p.height * 3, p.width * 2))

		const subs = p.floor(p.random(2000))
		for (let l = 0; l < subs; l++) {
			const ind = p.floor(p.random(boxes.length * p.random(0.2, 1)))
			const b = boxes[ind]
			const w1 = p.random(0.3, 0.7)
			const w2 = (1 - w1)
			const h1 = p.random(0.3, 0.7)
			const h2 = (1 - h1)
			const d1 = p.random(0.3, 0.7)
			const d2 = (1 - d1)

			const w = b.w
			const h = b.h
			const d = b.d

			const newW1 = w1 * w
			const newW2 = w2 * w
			const newH1 = h1 * h
			const newH2 = h2 * h
			const newD1 = d1 * d
			const newD2 = d2 * d

			boxes.push(new Box(b.x - w * 0.5 + newW1 * 0.5, b.y - h * 0.5 + newH1 * 0.5, b.z - d * 0.5 + newD1 * 0.5, newW1, newH1, newD1))
			boxes.push(new Box(b.x + w * 0.5 - newW2 * 0.5, b.y - h * 0.5 + newH1 * 0.5, b.z - d * 0.5 + newD1 * 0.5, newW2, newH1, newD1))
			boxes.push(new Box(b.x - w * 0.5 + newW1 * 0.5, b.y + h * 0.5 - newH2 * 0.5, b.z - d * 0.5 + newD1 * 0.5, newW1, newH2, newD1))
			boxes.push(new Box(b.x + w * 0.5 - newW2 * 0.5, b.y + h * 0.5 - newH2 * 0.5, b.z - d * 0.5 + newD1 * 0.5, newW2, newH2, newD1))

			boxes.push(new Box(b.x - w * 0.5 + newW1 * 0.5, b.y - h * 0.5 + newH1 * 0.5, b.z + d * 0.5 - newD2 * 0.5, newW1, newH1, newD2))
			boxes.push(new Box(b.x + w * 0.5 - newW2 * 0.5, b.y - h * 0.5 + newH1 * 0.5, b.z + d * 0.5 - newD2 * 0.5, newW2, newH1, newD2))
			boxes.push(new Box(b.x - w * 0.5 + newW1 * 0.5, b.y + h * 0.5 - newH2 * 0.5, b.z + d * 0.5 - newD2 * 0.5, newW1, newH2, newD2))
			boxes.push(new Box(b.x + w * 0.5 - newW2 * 0.5, b.y + h * 0.5 - newH2 * 0.5, b.z + d * 0.5 - newD2 * 0.5, newW2, newH2, newD2))

			boxes.splice(ind, 1)
		}

		for (let l = 0; l < boxes.length; l++) {
			const o = boxes[l]
			p.push()
			p.translate(o.x, o.y, o.z)
			modulo1(o.w, o.h, o.d)
			modulo1(o.w, o.h, o.d)
			modulo1(o.w, o.h, o.d)
			p.pop()
		}
	}

	const modulo1 = (w: number, h?: number, d?: number): void => {
		// If only one parameter is provided, use it for all dimensions
		if (h === undefined || d === undefined) {
			const s = w
			modulo1(s, s, s)
			return
		}

		const mw = w * 0.5
		const mh = h * 0.5
		const md = d * 0.5
		const cc = 120
		p.stroke(0, p.random(16, 70))
		
		for (let i = 0; i < cc; i++) {
			const v = p.map(i, 0, cc - 1, -1, 1)
			if (p.random(1) < 0.5) p.line(mw * v, -mh, -md, mw * v, +mh, +md)
			if (p.random(1) < 0.5) p.line(mw * v, +mh, -md, mw * v, -mh, +md)
			if (p.random(1) < 0.5) p.line(mw * v, +mh, +md, mw * v, +mh, -md)
			if (p.random(1) < 0.5) p.line(mw * v, -mh, +md, mw * v, -mh, -md)
			if (p.random(1) < 0.5) p.line(mw * v, -mh, -md, mw * v, +mh, +md)
			if (p.random(1) < 0.5) p.line(mw * v, +mh, -md, mw * v, -mh, +md)
			if (p.random(1) < 0.5) p.line(mw, +mh * v, +md, mw, +mh * v, -md)
			if (p.random(1) < 0.5) p.line(mw, -mh * v, +md, mw, -mh * v, -md)

			if (p.random(1) < 0.5) p.line(-mw, +mh * v, -md, mw, +mh * v, -md)
			if (p.random(1) < 0.5) p.line(-mw, -mh * v, +md, mw, -mh * v, +md)
		}
	}

	// Color utility functions
	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const getColor = (v?: number): p5.Color => {
		if (v === undefined) {
			return getColor(p.random(colors.length))
		}
		const value = p.abs(v) % 1
		const ind1 = p.floor(value * colors.length)
		const ind2 = (p.floor(value * colors.length) + 1) % colors.length
		const c1 = p.color(colors[ind1])
		const c2 = p.color(colors[ind2])
		return p.lerpColor(c1, c2, (value * colors.length) % 1)
	}

	// Set up keyboard controls
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "hembras"
	})
}

// Create a new p5 instance with the sketch
new p5(sketch)
