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
		p.createCanvas(dimensions.width, dimensions.height, p.WEBGL)
		p.smooth()
		p.pixelDensity(2)
		seed = p.floor(p.random(999999)) // Initialize seed
		colors = await getColorPalette()
		generate()
	}

	p.draw = (): void => {
		// This is intentionally empty as we're using generate() for drawing
	}

	const generate = (): void => {
		p.randomSeed(seed)
		p.noiseSeed(seed)
		p.background(rcol())

		// Reset the coordinate system - Processing uses top-left as origin, WEBGL uses center
		p.translate(-p.width / 2, -p.height / 2, 0)

		p.rectMode(p.CENTER)
		p.noFill()
		for (let i = 0; i < 10; i++) {
			const x1 = p.random(p.width)
			const y1 = p.random(p.height)
			const x2 = p.random(p.width)
			const y2 = p.random(p.height)
			const baseColor = rcol()
			const strokeColor = p.color(baseColor.toString())
			strokeColor.setAlpha(10)
			p.stroke(strokeColor)
			p.line(x1, y1, x2, y2)

			const ang1 = p.random(p.TAU * 10)
			const ang2 = p.random(p.TAU * 10)
			const dist = p.dist(x1, y1, x2, y2)
			const cc = p.floor(dist * 2)
			const amp1 = p.random(200)
			const amp2 = p.random(200)
			const alp1 = p.random(40) * p.random(1)
			const alp2 = p.random(40) * p.random(1)

			for (let j = 0; j <= cc; j++) {
				const v = p.map(j, 0, cc, 0, 1)
				const currentColor = p.color(baseColor.toString())
				currentColor.setAlpha(p.lerp(alp1, alp2, v))
				p.stroke(currentColor)
				p.push()
				p.translate(p.lerp(x1, x2, v), p.lerp(y1, y2, v))
				p.rotate(p.lerp(ang1, ang2, v))
				const amp = p.lerp(amp1, amp2, v)
				p.rect(0, 0, amp, amp)
				p.pop()
			}
		}
	}

	const arc2 = (
		x: number,
		y: number,
		s1: number,
		s2: number,
		a1: number,
		a2: number,
		col: p5.Color,
		shd1: number,
		shd2: number,
	): void => {
		const r1 = s1 * 0.5
		const r2 = s2 * 0.5
		const amp = a2 - a1
		const ma = p.map(amp, 0, p.TWO_PI, 0, 1)
		const cc = p.max(8, p.floor(p.max(r1, r2) * p.PI * ma))
		const da = amp / cc

		for (let i = 0; i < cc; i++) {
			const ang = a1 + da * i
			p.beginShape()
			const fillColor1 = p.color(col.toString())
			fillColor1.setAlpha(shd1)
			p.fill(fillColor1)
			p.vertex(x + p.cos(ang) * r1, y + p.sin(ang) * r1)
			p.vertex(x + p.cos(ang + da) * r1, y + p.sin(ang + da) * r1)
			const fillColor2 = p.color(col.toString())
			fillColor2.setAlpha(shd2)
			p.fill(fillColor2)
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
			v = p.random(colors.length)
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
		algorithmName: "chea",
	})
}

// Create a new p5 instance with the sketch
new p5(sketch) 