import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	getRandomColor,
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
		generate()
	}

	// Set up keyboard controls with our custom generate function
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "paper2",
	})

	const generate = () => {
		p.randomSeed(seed)
		p.beginShape()
		const color1 = getRandomColor(p, colors)
		p.fill(p.red(color1), p.green(color1), p.blue(color1))
		p.vertex(0, 0)
		p.vertex(p.width, 0)
		const color2 = getRandomColor(p, colors)
		p.fill(p.red(color2), p.green(color2), p.blue(color2))
		p.vertex(p.width, p.height)
		p.vertex(0, p.height)
		p.endShape()

		p.noStroke()
		const c = 5400
		for (let i = 0; i < c; i++) {
			let xx = p.random(p.width)
			let yy = p.random(p.height)
			const ss =
				p.width / p.floor(p.pow(2, p.floor(p.random(p.random(1, 8), 8))))

			// Skip if shape is too small (less than 40 pixels)
			if (ss < 40) continue

			xx = xx - (xx % ss)
			yy = yy - (yy % ss)

			xx += ss * 0.5
			yy += ss * 0.5

			const rnd = p.floor(p.random(10)) // Increased number of shapes

			if (rnd === 0) {
				const color3 = getRandomColor(p, colors)
				p.fill(p.red(color3), p.green(color3), p.blue(color3))
				p.ellipse(xx, yy, ss, ss)
				const color4 = getRandomColor(p, colors)
				p.fill(p.red(color4), p.green(color4), p.blue(color4))
				p.arc(xx, yy, ss, ss, p.PI * 0.25, p.PI * 1.25)

				arc2(xx, yy, ss, ss * 1.6, 0, p.TWO_PI, p.color(0), 10, 0)
				const color5 = getRandomColor(p, colors)
				arc2(xx, yy, ss, ss * 0.4, 0, p.TWO_PI, color5, 20, 0)
			}
			if (rnd === 1) {
				const color6 = getRandomColor(p, colors)
				p.fill(p.red(color6), p.green(color6), p.blue(color6))
				p.rect(xx - ss * 0.5, yy - ss * 0.5, ss, ss)
				const color7 = getRandomColor(p, colors)
				p.fill(p.red(color7), p.green(color7), p.blue(color7))
				p.triangle(
					xx - ss * 0.5,
					yy - ss * 0.5,
					xx - ss * 0.5,
					yy + ss * 0.5,
					xx + ss * 0.5,
					yy + ss * 0.5,
				)
			}

			if (rnd === 2) {
				const color8 = getRandomColor(p, colors)
				p.fill(p.red(color8), p.green(color8), p.blue(color8))
				p.rect(xx - ss * 0.5, yy - ss * 0.5, ss, ss)
				const color9 = getRandomColor(p, colors)
				p.fill(p.red(color9), p.green(color9), p.blue(color9))
				p.triangle(
					xx - ss * 0.5,
					yy + ss * 0.5,
					xx,
					yy - ss * 0.5,
					xx,
					yy + ss * 0.5,
				)
				const color10 = getRandomColor(p, colors)
				p.fill(p.red(color10), p.green(color10), p.blue(color10))
				p.triangle(
					xx + ss * 0.5,
					yy + ss * 0.5,
					xx,
					yy - ss * 0.5,
					xx,
					yy + ss * 0.5,
				)
			}
			if (rnd === 3) {
				const color11 = getRandomColor(p, colors)
				p.fill(p.red(color11), p.green(color11), p.blue(color11))
				p.beginShape()
				p.vertex(xx, yy - ss * 0.5)
				p.vertex(xx - ss * 0.5, yy)
				p.vertex(xx, yy + ss * 0.5)
				p.vertex(xx + ss * 0.5, yy)
				p.endShape(p.CLOSE)
			}
			if (rnd === 4) {
				const color12 = getRandomColor(p, colors)
				p.fill(p.red(color12), p.green(color12), p.blue(color12))
				p.beginShape()
				p.vertex(xx - ss * 0.5, yy - ss * 0.5)
				p.vertex(xx + ss * 0.5, yy - ss * 0.5)
				p.vertex(xx + ss * 0.5, yy + ss * 0.5)
				p.vertex(xx - ss * 0.5, yy + ss * 0.5)
				p.endShape(p.CLOSE)
				const color13 = getRandomColor(p, colors)
				p.fill(p.red(color13), p.green(color13), p.blue(color13))
				p.ellipse(xx, yy, ss * 0.5, ss * 0.5)
			}
			if (rnd === 5) {
				const color14 = getRandomColor(p, colors)
				p.fill(p.red(color14), p.green(color14), p.blue(color14))
				p.beginShape()
				p.vertex(xx, yy - ss * 0.5)
				p.vertex(xx - ss * 0.5, yy)
				p.vertex(xx, yy + ss * 0.5)
				p.vertex(xx + ss * 0.5, yy)
				p.endShape(p.CLOSE)
				const color15 = getRandomColor(p, colors)
				p.fill(p.red(color15), p.green(color15), p.blue(color15))
				p.rect(xx - ss * 0.25, yy - ss * 0.25, ss * 0.5, ss * 0.5)
			}
			if (rnd === 6) {
				const color16 = getRandomColor(p, colors)
				p.fill(p.red(color16), p.green(color16), p.blue(color16))
				p.ellipse(xx, yy, ss, ss)
				const color17 = getRandomColor(p, colors)
				p.fill(p.red(color17), p.green(color17), p.blue(color17))
				p.arc(xx, yy, ss, ss, 0, p.PI)
				const color18 = getRandomColor(p, colors)
				p.fill(p.red(color18), p.green(color18), p.blue(color18))
				p.arc(xx, yy, ss, ss, p.PI, p.TWO_PI)
			}
			// New shapes
			if (rnd === 7) {
				// Double circle with arcs
				const color19 = getRandomColor(p, colors)
				p.fill(p.red(color19), p.green(color19), p.blue(color19))
				p.ellipse(xx, yy, ss, ss)
				const color20 = getRandomColor(p, colors)
				p.fill(p.red(color20), p.green(color20), p.blue(color20))
				p.ellipse(xx, yy, ss * 0.7, ss * 0.7)
				arc2(xx, yy, ss, ss * 0.7, 0, p.PI, p.color(0), 10, 0)
			}
			if (rnd === 8) {
				// Square with diagonal split
				const color21 = getRandomColor(p, colors)
				p.fill(p.red(color21), p.green(color21), p.blue(color21))
				p.beginShape()
				p.vertex(xx - ss * 0.5, yy - ss * 0.5)
				p.vertex(xx + ss * 0.5, yy - ss * 0.5)
				p.vertex(xx + ss * 0.5, yy + ss * 0.5)
				p.vertex(xx - ss * 0.5, yy + ss * 0.5)
				p.endShape(p.CLOSE)
				const color22 = getRandomColor(p, colors)
				p.fill(p.red(color22), p.green(color22), p.blue(color22))
				p.triangle(
					xx - ss * 0.5,
					yy - ss * 0.5,
					xx + ss * 0.5,
					yy + ss * 0.5,
					xx - ss * 0.5,
					yy + ss * 0.5,
				)
			}
			if (rnd === 9) {
				// Diamond with inner circle
				const color23 = getRandomColor(p, colors)
				p.fill(p.red(color23), p.green(color23), p.blue(color23))
				p.beginShape()
				p.vertex(xx, yy - ss * 0.5)
				p.vertex(xx - ss * 0.5, yy)
				p.vertex(xx, yy + ss * 0.5)
				p.vertex(xx + ss * 0.5, yy)
				p.endShape(p.CLOSE)
				const color24 = getRandomColor(p, colors)
				p.fill(p.red(color24), p.green(color24), p.blue(color24))
				p.ellipse(xx, yy, ss * 0.4, ss * 0.4)
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
		alp1: number,
		alp2: number,
	) => {
		const r1 = s1 * 0.5
		const r2 = s2 * 0.5
		const amp = a2 - a1
		const ma = p.map(amp, 0, p.TWO_PI, 0, 1)
		const cc = p.max(2, p.floor(p.max(r1, r2) * p.PI * ma * 0.5))
		const da = amp / cc
		for (let i = 0; i < cc; i++) {
			const ang = a1 + da * i
			p.beginShape()
			p.fill(p.red(col), p.green(col), p.blue(col), alp1)
			p.vertex(x + p.cos(ang) * r1, y + p.sin(ang) * r1)
			p.vertex(x + p.cos(ang + da) * r1, y + p.sin(ang + da) * r1)
			p.fill(p.red(col), p.green(col), p.blue(col), alp2)
			p.vertex(x + p.cos(ang + da) * r2, y + p.sin(ang + da) * r2)
			p.vertex(x + p.cos(ang) * r2, y + p.sin(ang) * r2)
			p.endShape(p.CLOSE)
		}
	}
}

// Create a new p5 instance with the sketch
new p5(sketch)
