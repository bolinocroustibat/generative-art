import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

// Create a p5.js sketch in instance mode
const sketch = (p: p5) => {
	let seed: number
	const colors: string[] = getColorPalette()

	p.setup = (): void => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height)
		p.pixelDensity(2)
		seed = p.floor(p.random(999999)) // Initialize seed
		generate()
	}

	const generate = (): void => {
		p.randomSeed(seed)
		p.background(rcol())

		let cc = p.floor(p.random(12, 30)) * 2
		cc = 30 // Override with fixed value as in original
		const ss = (p.width * 1.0) / cc

		p.noStroke()
		p.rectMode(p.CENTER)
		const des1 = p.random(10000)
		const det1 = p.random(0.05)
		const des2 = p.random(10000)
		const det2 = p.random(0.05)
		const des3 = p.random(10000)
		const det3 = p.random(0.05)
		const des4 = p.random(10000)
		const det4 = p.random(0.05)

		for (let j = -1; j <= cc; j++) {
			for (let i = -1; i <= cc; i++) {
				const xx = ss * (i + 0.5)
				const yy = ss * (j + 0.5)

				if ((i + j) % 2 === 0) p.fill(0)
				else p.fill(255)
				p.rect(xx, yy, ss, ss)

				if ((i + j) % 2 === 1) p.fill(0)
				else p.fill(255)

				if (p.noise(des1 + i * det1, des1 + j * det1) < 0.5) {
					p.rect(xx - ss * 0.3, yy - ss * 0.3, ss * 0.2, ss * 0.2)
				}
				if (p.noise(des2 + i * det2, des2 + j * det2) < 0.5) {
					p.rect(xx + ss * 0.3, yy - ss * 0.3, ss * 0.2, ss * 0.2)
				}
				if (p.noise(des3 + i * det3, des3 + j * det3) < 0.5) {
					p.rect(xx + ss * 0.3, yy + ss * 0.3, ss * 0.2, ss * 0.2)
				}
				if (p.noise(des4 + i * det4, des4 + j * det4) < 0.5) {
					p.rect(xx - ss * 0.3, yy + ss * 0.3, ss * 0.2, ss * 0.2)
				}
			}
		}
	}

	// Arc2 function from the original sketch
	const arc2 = (
		x: number,
		y: number,
		s1: number,
		s2: number,
		a1: number,
		a2: number,
		col: number,
		alp1: number,
		alp2: number,
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
			p.fill(col, alp1)
			p.vertex(x + p.cos(ang) * r1, y + p.sin(ang) * r1)
			p.vertex(x + p.cos(ang + da) * r1, y + p.sin(ang + da) * r1)
			p.fill(col, alp2)
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
		algorithmName: "op_prob1",
	})
}

// Create a new p5 instance with the sketch
new p5(sketch)
