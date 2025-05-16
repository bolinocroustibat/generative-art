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

	p.draw = () => {
		// Empty draw function as in original
	}

	// Set up keyboard controls with our custom generate function
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "paper",
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

			xx = xx - (xx % ss)
			yy = yy - (yy % ss)

			xx += ss * 0.5
			yy += ss * 0.5

			const rnd = p.floor(p.random(4))

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
