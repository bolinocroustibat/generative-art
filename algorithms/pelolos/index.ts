import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers"

let seed: number
let colors: string[]

// Create a p5.js sketch in instance mode
const sketch = (p: p5) => {
	p.setup = async () => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.P2D)
		p.smooth(8)
		p.pixelDensity(2)
		colors = await getColorPalette()
		seed = p.floor(p.random(999999))
		generate()
	}

	p.draw = () => {
		// Empty draw function as in original
	}

	// Set up keyboard controls with our custom generate function
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "pelolos",
	})

	const generate = () => {
		p.randomSeed(seed)
		p.noiseSeed(seed)
		const backgroundColor = getRandomColor()
		p.background(backgroundColor)

		const cc = p.floor(p.random(160, 320 * 20))
		const ss = p.height / cc

		p.stroke(0, 12)
		p.fill(255, 4)
		p.noFill()
		let det = p.random(0.006)

		for (let i = 0; i < cc; i++) {
			const mountain: p5.Vector[] = []
			let lx = 0
			let ly = (i + 0.5) * ss
			det *= p.random(0.98, 1.02)
			let vel = 0.2 + p.noise(lx * det * 0.2, ly * det * 0.2) * 1.2
			vel *= 3

			for (let j = 0; j <= p.width * 0.4; j++) {
				const amp = p.pow(p.map(j, 0, p.width * 0.5, 0, 1), 2.8) * 4
				const ang = p.map(
					p.noise(lx * det, ly * det),
					0,
					1,
					p.PI * (2 - amp),
					p.PI * (2 + amp),
				)
				mountain.push(p.createVector(lx, ly))
				lx += p.cos(ang) * vel
				ly += p.sin(ang) * vel
			}

			p.noFill()
			// More random stroke colors
			const strokeColor = getInterpolatedColor(p.random(colors.length))
			p.stroke(strokeColor)
			p.strokeWeight(p.random(0.5, 1.2))

			p.beginShape(p.QUADS)
			// Create a smooth color progression based on position
			const baseIndex = (p.cos(i * 0.02) * 0.5 + 0.5) * colors.length
			const colorStep = p.random(0.05, 0.15)

			p.stroke(0, 8)

			for (let j = 0; j < mountain.length - 1; j++) {
				const p1 = mountain[j]
				const p2 = mountain[j + 1]

				// Create smoother color transitions
				const progressJ = j / mountain.length
				const col1 = getInterpolatedColor(
					baseIndex + progressJ * colorStep * colors.length,
				)
				const col2 = getInterpolatedColor(
					baseIndex + (progressJ + colorStep) * colors.length,
				)

				// Add alpha variation for more depth
				const alpha1 = p.map(p1.y, 0, p.height, 255, 180)
				const alpha2 = p.map(p2.y, 0, p.height, 255, 180)

				p.fill(p.color(p.red(col1), p.green(col1), p.blue(col1), alpha1))
				p.vertex(p1.x, p1.y)
				p.fill(p.color(p.red(col2), p.green(col2), p.blue(col2), alpha2))
				p.vertex(p2.x, p2.y)
				p.fill(p.color(p.red(col2), p.green(col2), p.blue(col2), alpha2 * 0.5))
				p.vertex(p2.x, p2.y + 2)
				p.fill(p.color(p.red(col1), p.green(col1), p.blue(col1), alpha1 * 0.5))
				p.vertex(p1.x, p1.y + 2)
			}
			p.endShape()
			p.strokeWeight(1)
		}
	}

	// Color utility functions
	const getRandomColor = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const getInterpolatedColor = (v: number): p5.Color => {
		v = p.abs(v)
		v = v % colors.length
		const c1 = p.color(colors[p.floor(v % colors.length)])
		const c2 = p.color(colors[p.floor((v + 1) % colors.length)])
		return p.lerpColor(c1, c2, v % 1)
	}
}

// Create a new p5 instance with the sketch
new p5(sketch)
