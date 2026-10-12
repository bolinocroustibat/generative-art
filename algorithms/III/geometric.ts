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
		p.noStroke()

		// Reset the coordinate system - Processing uses top-left as origin, WEBGL uses center
		p.translate(-p.width / 2, -p.height / 2, 0)

		const quads: p5.Vector[] = []
		quads.push(p.createVector(0, 0, p.width))

		const sub = p.floor(p.random(40, 100))

		// Create initial grid
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

		// Draw shapes with variations
		for (let i = 0; i < quads.length; i++) {
			const q = quads[i]
			const div = p.floor(p.pow(2, p.floor(2 + p.random(4)))) * 2
			const da = p.TWO_PI / div

			// Randomly choose shape type
			const shapeType = p.floor(p.random(3)) // 0: square, 1: triangle, 2: hexagon
			const rotation = p.random(p.TWO_PI)
			const zOffset = p.random(-50, 50) // 3D effect

			p.push()
			p.translate(q.x + q.z * 0.5, q.y + q.z * 0.5, zOffset)
			p.rotate(rotation)

			switch (shapeType) {
				case 0: // Square
					drawSquare(q.z)
					break
				case 1: // Triangle
					drawTriangle(q.z)
					break
				case 2: // Hexagon
					drawHexagon(q.z)
					break
			}

			p.pop()
		}
	}

	const drawSquare = (size: number): void => {
		const s = size * 0.8
		p.fill(rcol())
		p.beginShape()
		p.vertex(-s / 2, -s / 2)
		p.vertex(s / 2, -s / 2)
		p.vertex(s / 2, s / 2)
		p.vertex(-s / 2, s / 2)
		p.endShape(p.CLOSE)

		// Inner detail
		p.fill(rcol())
		p.beginShape()
		p.vertex(-s / 4, -s / 4)
		p.vertex(s / 4, -s / 4)
		p.vertex(s / 4, s / 4)
		p.vertex(-s / 4, s / 4)
		p.endShape(p.CLOSE)
	}

	const drawTriangle = (size: number): void => {
		const s = size * 0.8
		p.fill(rcol())
		p.beginShape()
		p.vertex(0, -s / 2)
		p.vertex(s / 2, s / 2)
		p.vertex(-s / 2, s / 2)
		p.endShape(p.CLOSE)

		// Inner detail
		p.fill(rcol())
		p.beginShape()
		p.vertex(0, -s / 4)
		p.vertex(s / 4, s / 4)
		p.vertex(-s / 4, s / 4)
		p.endShape(p.CLOSE)
	}

	const drawHexagon = (size: number): void => {
		const s = size * 0.8
		const angle = p.TWO_PI / 6
		p.fill(rcol())
		p.beginShape()
		for (let i = 0; i < 6; i++) {
			const x = (p.cos(angle * i) * s) / 2
			const y = (p.sin(angle * i) * s) / 2
			p.vertex(x, y)
		}
		p.endShape(p.CLOSE)

		// Inner detail
		p.fill(rcol())
		p.beginShape()
		for (let i = 0; i < 6; i++) {
			const x = (p.cos(angle * i) * s) / 4
			const y = (p.sin(angle * i) * s) / 4
			p.vertex(x, y)
		}
		p.endShape(p.CLOSE)
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
		algorithmName: "III/geometric",
	})
}

// Create a new p5 instance with the sketch
new p5(sketch)
