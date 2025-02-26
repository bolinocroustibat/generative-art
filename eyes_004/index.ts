import p5 from "p5"
import { colorPalettes } from "../data/colorsPalettes.ts"
import { getCanvasDimensions } from "../helpers/canvasDimensions.ts"
import { setupKeyboardControls } from "../helpers/keyboardControls.ts"
import { saveImage } from "../helpers/saveImage.ts"

// Create a p5.js sketch in instance mode
const sketch = (p: p5) => {
	let seed: number

	const colors: string[] = colorPalettes.royalTenenbaums

	p.setup = (): void => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.WEBGL)
		p.smooth(8)
		p.pixelDensity(2)
		seed = p.floor(p.random(999999)) // Initialize seed
		generate()
	}

	p.draw = (): void => {
		// This is intentionally empty as we're using generate() for drawing
	}

	const generate = (): void => {
		p.randomSeed(seed)
		p.background(rcol())

		// Reset the coordinate system - Processing uses top-left as origin, WEBGL uses center
		p.translate(-p.width / 2, -p.height / 2, 0)

		const rects: p5.Vector[] = []
		rects.push(p.createVector(0, 0, p.width))
		const sub = p.floor(p.random(100))

		for (let i = 0; i < sub; i++) {
			const ind = p.floor(p.random(rects.length))
			const r = rects[ind]
			const ms = r.z * 0.5
			rects.push(p.createVector(r.x, r.y, ms))
			rects.push(p.createVector(r.x + ms, r.y, ms))
			rects.push(p.createVector(r.x + ms, r.y + ms, ms))
			rects.push(p.createVector(r.x, r.y + ms, ms))
			rects.splice(ind, 1)
		}

		p.noStroke()
		for (let i = 0; i < rects.length; i++) {
			const r = rects[i]
			p.fill(rcol())
			p.rect(r.x, r.y, r.z, r.z)

			const ss = r.z * p.random(0.6, 0.8)
			const s1 = ss * p.random(0.4, 0.8)
			const s2 = s1 * p.random(0.5, p.random(0.6, 1))
			const cx = r.x + r.z * 0.5
			const cy = r.y + r.z * 0.5

			arc2(cx, cy, ss, ss * 1.2, 0, p.TAU, 0, 30, 0)
			arc2(cx, cy, ss, ss * 1.4, 0, p.TAU, 0, 30, 0)

			p.fill(240)
			p.ellipse(cx, cy, ss, ss)
			arc2(cx, cy, ss * 0.95, ss * 0.8, 0, p.TAU, 0, 25, 0)
			arc2(cx, cy, ss * 0.95, ss, 0, p.TAU, 0, 25, 0)

			p.fill(rcol())
			p.ellipse(cx, cy, s1, s1)
			p.stroke(0, 8)
			arc2(cx, cy, s1, 0, 0, p.TAU, 255, 30, 0)
			p.noStroke()
			arc2(cx, cy, s1, s1 * 0.8, 0, p.TAU, 0, 30, 0)

			p.fill(0)
			p.ellipse(cx, cy, s2, s2)

			arc2(cx + ss * 0.15, cy - ss * 0.15, ss * 0.5, 0, 0, p.TAU, 255, 0, 120)
			arc2(cx + ss * 0.15, cy - ss * 0.15, ss * 0.1, 0, 0, p.TAU, 255, 0, 20)

			arc2(cx, cy, s2, 0, 0, p.TAU, 0, 180, 0)
		}

		p.noFill()
		for (let i = 0; i < 4000; i++) {
			p.stroke(255, p.random(140) * p.random(1) * p.random(1) * p.random(1))
			const a1 = p.random(p.TWO_PI)
			const a2 = a1 + p.random(p.HALF_PI) * p.random(0.1, 1)
			const s = p.random(2, 10)
			p.arc(p.random(p.width), p.random(p.height), s, s, a1, a2)
		}
	}

	const arc2 = (
		x: number,
		y: number,
		s1: number,
		s2: number,
		a1: number,
		a2: number,
		col: number,
		shd1: number,
		shd2: number,
	): void => {
		const r1 = s1 * 0.5
		const r2 = s2 * 0.5
		const amp = a2 - a1
		const ma = p.map(amp, 0, p.TWO_PI, 0, 1)
		const cc = p.max(1, p.floor(p.max(r1, r2) * p.PI * ma))
		const da = amp / cc

		for (let i = 0; i < cc; i++) {
			const ang = a1 + da * i
			p.beginShape()
			p.fill(col, shd1)
			p.vertex(x + p.cos(ang) * r1, y + p.sin(ang) * r1)
			p.vertex(x + p.cos(ang + da) * r1, y + p.sin(ang + da) * r1)
			p.fill(col, shd2)
			p.vertex(x + p.cos(ang + da) * r2, y + p.sin(ang + da) * r2)
			p.vertex(x + p.cos(ang) * r2, y + p.sin(ang) * r2)
			p.endShape(p.CLOSE)
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
		const value = p.abs(v)
		const normalizedValue = value % colors.length
		const c1 = p.color(colors[p.floor(normalizedValue % colors.length)])
		const c2 = p.color(colors[p.floor((normalizedValue + 1) % colors.length)])
		return p.lerpColor(c1, c2, normalizedValue % 1)
	}

	// Set up keyboard controls
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "eyes004",
		customHandlers: {
			s: () => saveImage(p),
		},
	})
}

// Create a new p5 instance with the sketch
new p5(sketch)
