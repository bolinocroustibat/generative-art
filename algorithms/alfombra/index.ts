import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

// Create a p5.js sketch in instance mode
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []

	p.setup = async (): Promise<void> => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height)
		p.smooth()
		p.pixelDensity(2)
		seed = p.floor(p.random(999999)) // Initialize seed
		colors = await getColorPalette()
		generate()
	}

	p.draw = (): void => {
		// This is intentionally empty as we're using generate() for drawing
		// Original comment: //generate();
	}

	const generate = (): void => {
		p.randomSeed(seed)
		p.background(0)

		const dc1 = p.random(1)
		const di1 = p.random(100000)
		const dc2 = p.random(1)
		const di2 = p.random(100000)
		const dc3 = p.random(1)
		const di3 = p.random(100000)

		p.noStroke()
		for (let i = 0; i < 100; i++) {
			const x = p.random(p.width)
			const y = p.random(p.height)
			const s = p.width * p.random(0.1, 0.3)
			const s2 = s * p.random(0.2, 0.6)

			p.noStroke()

			p.fill(
				getColor(p.noise(di1 + x * dc1, di1 + y * dc1) * colors.length * 4),
			)
			p.ellipse(x, y, s, s)

			p.fill(
				getColor(p.noise(di2 + x * dc2, di2 + y * dc2) * colors.length * 4),
			)
			p.ellipse(x, y, s2, s2)

			for (let j = 0; j < 100; j++) {
				const xx = p.random(p.width)
				const yy = p.random(p.height)
				const ss = p.width * p.random(0.003)
				p.fill(
					getColor(p.noise(di3 + x * dc3, di3 + y * dc3) * colors.length * 4),
				)
				p.ellipse(xx, yy, ss, ss)
			}
		}

		for (let i = 0; i < 16; i++) {
			pelos()
		}
	}

	const pelos = (): void => {
		const cc = p.floor(p.random(160, 220))
		const des = (p.width * 1.0) / cc
		const ia = p.random(10000)
		const da = p.random(0.01)
		const is = p.random(10000)
		const ds = p.random(0.01)
		const ic = p.random(10000)
		const dc = p.random(0.001)
		const init = p.random(colors.length)
		const vel = p.random(colors.length)

		for (let j = 0; j < cc; j++) {
			for (let i = 0; i < cc; i++) {
				const xx = (i + p.random(-0.5, 0.5)) * des
				const yy = (j + p.random(-0.5, 0.5)) * des
				const dis = p.noise(is + xx * ds, is + yy * ds) * des * 1.4
				const ang = p.noise(ia + xx * da, ia + yy * da) * p.TWO_PI
				p.stroke(getColor(init + p.noise(ic + dc * xx, ic + dc * yy) * vel, 80))
				p.line(xx, yy, xx + p.cos(ang) * dis, yy + p.sin(ang) * dis)
			}
		}
	}

	// Color utility functions
	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const getColor = (v?: number, alpha?: number): p5.Color => {
		if (v === undefined) {
			v = p.random(colors.length)
		}

		const value = p.abs(v)
		const normalizedValue = value % colors.length
		const c1 = p.color(colors[p.floor(normalizedValue % colors.length)])
		const c2 = p.color(colors[p.floor((normalizedValue + 1) % colors.length)])
		const result = p.lerpColor(c1, c2, normalizedValue % 1)

		if (alpha !== undefined) {
			result.setAlpha(alpha)
		}

		return result
	}

	// Set up keyboard controls
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "alfombra",
	})
}

// Create a new p5 instance with the sketch
new p5(sketch)
