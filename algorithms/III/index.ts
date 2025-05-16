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
		p.background(0)
		p.stroke(255)
		p.noFill()
		p.noStroke()

		// Reset the coordinate system - Processing uses top-left as origin, WEBGL uses center
		p.translate(-p.width / 2, -p.height / 2, 0)

		const quads: p5.Vector[] = []
		quads.push(p.createVector(0, 0, p.width))

		const sub = p.floor(p.random(p.random(40, 100)))

		for (let k = 0; k < sub; k++) {
			const ind = p.floor(p.random(quads.length * p.random(1)))
			const q = quads[ind]
			const div = p.floor(p.random(2, 4))
			const s = q.z / div

			for (let j = 0; j < div; j++) {
				for (let i = 0; i < div; i++) {
					quads.push(p.createVector(q.x + s * i, q.y + s * j, s))
				}
			}

			quads.splice(ind, 1)
		}

		for (let i = 0; i < quads.length; i++) {
			const q = quads[i]
			const div = p.floor(p.pow(2, p.floor(2 + p.random(4)))) * 2
			const da = p.TWO_PI / div

			p.beginShape()
			p.fill(rcol())
			p.vertex(q.x, q.y)
			p.vertex(q.x + q.z, q.y)
			p.fill(rcol())
			p.vertex(q.x + q.z, q.y + q.z)
			p.vertex(q.x, q.y + q.z)
			p.endShape(p.CLOSE)

			const xx = q.x + q.z * 0.5
			const yy = q.y + q.z * 0.5
			const r = q.z * p.random(0.2, 0.9)

			const p1 = getRect(xx, yy, q.z, div)
			const p2 = getCircle(xx, yy, r, div)

			for (let j = 0; j < p1.length; j++) {
				const i1 = j
				const i2 = (j + 1) % p1.length

				p.fill(rcol())
				p.beginShape()
				p.fill(rcol())
				p.vertex(p1[i1].x, p1[i1].y)
				p.vertex(p1[i2].x, p1[i2].y)
				p.fill(rcol())
				p.vertex(p2[i2].x, p2[i2].y)
				p.vertex(p2[i1].x, p2[i1].y)
				p.endShape(p.CLOSE)
			}
		}
	}

	const getRect = (
		x: number,
		y: number,
		s: number,
		sub: number,
	): p5.Vector[] => {
		const aux: p5.Vector[] = []
		const r2 = s * 0.5 * p.sqrt(2)

		for (let i = 0; i < 4; i++) {
			const x1 = p.cos((i + 0.5) * p.HALF_PI) * r2
			const y1 = p.sin((i + 0.5) * p.HALF_PI) * r2
			const x2 = p.cos((i + 1.5) * p.HALF_PI) * r2
			const y2 = p.sin((i + 1.5) * p.HALF_PI) * r2

			for (let j = 0; j < sub / 4; j++) {
				const xx = x + p.map(j, 0, sub / 4, x1, x2)
				const yy = y + p.map(j, 0, sub / 4, y1, y2)
				aux.push(p.createVector(xx, yy))
			}
		}

		return aux
	}

	const getCircle = (
		x: number,
		y: number,
		s: number,
		sub: number,
	): p5.Vector[] => {
		const r = s * 0.5
		const aux: p5.Vector[] = []
		const da = p.TWO_PI / sub

		for (let j = 0; j < sub; j++) {
			aux.push(
				p.createVector(
					x + p.cos(da * j + p.HALF_PI * 0.5) * r,
					y + p.sin(da * j + p.HALF_PI * 0.5) * r,
				),
			)
		}

		return aux
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
		algorithmName: "III",
	})
}

// Create a new p5 instance with the sketch
new p5(sketch)
