import p5 from "p5"
import { getColorPalette, getCanvasDimensions, setupKeyboardControls } from "../../helpers/index.ts"

// Create a p5.js sketch in instance mode
const sketch = (p: p5) => {
	let seed: number

	const colors: string[] = getColorPalette()

	p.setup = (): void => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height)
		p.smooth()
		p.pixelDensity(2)
		seed = p.floor(p.random(999999)) // Initialize seed
		generate()
	}

	p.draw = (): void => {
		// This is intentionally empty as we're using generate() for drawing
		// Original comment: //if (frameCount%40 == 0) generate()
	}

	const generate = (): void => {
		p.randomSeed(seed)
		p.background(rcol())
		p.noStroke()

		// Original code had multiple commented-out sections for different eye patterns
		// We'll implement the final version that was active in the original

		const x = 0
		const y = 0
		const cc = p.floor(p.random(10, 200))
		const mdx = p.random(0.55, 0.64)
		const mdy = p.random(0.08, 0.13)
		const ic = p.random(colors.length)
		const dc = p.random(10) * p.random(1)
		const ss = p.random(50, 260)
		const rot = p.random(-p.PI, p.PI)

		for (let i = 0; i < cc; i++) {
			const s = p.map(i, 0, cc, p.width * 1.5, ss)
			const mx = s * mdx
			const my = s * mdy

			p.push()
			p.translate(p.width / 2, p.height / 2)
			p.rotate(p.map(i, 0, cc, rot, 0))
			p.fill(getColor(ic + dc * i))

			p.beginShape()
			p.vertex(x - s * 1.1, y) // first point
			p.bezierVertex(x - s * 1.1, y - my, x - mx, y - s * 0.6, x, y - s * 0.6)
			p.bezierVertex(x + mx, y - s * 0.6, x + s * 1.1, y - my, x + s * 1.1, y)
			p.vertex(x + s * 1.1, y) // first point
			p.bezierVertex(x + s * 1.1, y + my, x + mx, y + s * 0.6, x, y + s * 0.6)
			p.bezierVertex(x - mx, y + s * 0.6, x - s * 1.1, y + my, x - s * 1.1, y)
			p.endShape(p.CLOSE)
			p.pop()
		}

		eye(p.width / 2, p.height / 2, ss)
	}

	const eye = (x: number, y: number, s: number): void => {
		const amp = p.random(0.5, p.random(0.5, 0.9))
		p.fill(p.color("#EADBC6"))

		const mx = s * p.random(0.55, 0.64)
		const my = s * p.random(0.08, 0.13)

		p.beginShape()
		p.vertex(x - s * 1.1, y) // first point
		p.bezierVertex(x - s * 1.1, y - my, x - mx, y - s * 0.6, x, y - s * 0.6)
		p.bezierVertex(x + mx, y - s * 0.6, x + s * 1.1, y - my, x + s * 1.1, y)
		p.vertex(x + s * 1.1, y) // first point
		p.bezierVertex(x + s * 1.1, y + my, x + mx, y + s * 0.6, x, y + s * 0.6)
		p.bezierVertex(x - mx, y + s * 0.6, x - s * 1.1, y + my, x - s * 1.1, y)
		p.endShape(p.CLOSE)

		p.fill(rcol())
		p.ellipse(x, y, s, s)
		p.fill(10)
		p.ellipse(x, y, s * amp, s * amp)
	}

	// Color utility functions
	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const getColor = (v: number): p5.Color => {
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
		algorithmName: "eyes001"
	})
}

// Create a new p5 instance with the sketch
new p5(sketch) 