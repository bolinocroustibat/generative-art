import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers"

let seed: number
let colors: string[]
let primaryColor: p5.Color
let secondaryColor: p5.Color

// Create a p5.js sketch in instance mode
const sketch = (p: p5) => {
	p.setup = async () => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.P2D)
		p.smooth(8)
		p.pixelDensity(2)
		colors = await getColorPalette()
		// Select two distinct colors from the palette
		primaryColor = p.color(colors[0])
		secondaryColor = p.color(colors[Math.min(1, colors.length - 1)])
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
			// Get new colors on each generation
			primaryColor = p.color(colors[p.floor(p.random(colors.length))])
			secondaryColor = p.color(colors[p.floor(p.random(colors.length))])
			while (
				p.red(primaryColor) === p.red(secondaryColor) &&
				p.green(primaryColor) === p.green(secondaryColor) &&
				p.blue(primaryColor) === p.blue(secondaryColor)
			) {
				secondaryColor = p.color(colors[p.floor(p.random(colors.length))])
			}
			generate()
		},
		algorithmName: "abstracactact",
	})

	const generate = () => {
		p.background(primaryColor)

		const cc = p.floor(p.random(7, p.random(8, 160)))
		const ss = p.width / cc

		p.stroke(30)
		p.noStroke()

		const dx = p.floor(p.random(-5, 5))
		const dy = p.floor(p.random(-5, 5))

		for (let k = 0; k < 100; k++) {
			const lar = p.floor(p.random(8, p.random(8, 50)))

			let ax = p.floor(p.random(-4, cc + 4))
			let ay = p.floor(p.random(-4, cc + 4))
			const points: p5.Vector[] = []

			for (let i = 0; i < lar; i++) {
				points.push(p.createVector(ax, ay))
				ax += p.floor(p.random(-5, 5))
				ay += p.floor(p.random(-5, 5))
			}

			const sub = p.floor(p.random(1, 50))
			const shw = 40

			for (let j = 0; j < sub; j++) {
				p.beginShape()
				const baseColor = j % 2 === 0 ? primaryColor : secondaryColor
				p.fill(baseColor)

				const d1 = p.map(j, 0, sub, 0, 1)
				const d2 = p.map(j + 1, 0, sub, 0, 1)

				for (let i = 0; i < points.length; i++) {
					const p1 = points[i]
					const strokeColor = i % 2 === 0 ? secondaryColor : primaryColor
					p.stroke(strokeColor)
					p.fill(baseColor)
					p.vertex((p1.x + dx * d1) * ss, (p1.y + dy * d1) * ss)
				}

				for (let i = points.length - 1; i >= 0; i--) {
					const p1 = points[i]
					const strokeColor = (i + 1) % 2 === 0 ? secondaryColor : primaryColor
					p.stroke(strokeColor)
					p.fill(baseColor)
					p.vertex((p1.x + dx * d2) * ss, (p1.y + dy * d2) * ss)
				}

				p.endShape(p.CLOSE)
			}
		}
	}
}

// Create a new p5 instance with the sketch
new p5(sketch)
