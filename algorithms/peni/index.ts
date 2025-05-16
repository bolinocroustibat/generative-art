import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	getInterpolatedColor,
	getRandomColor,
	setupKeyboardControls,
} from "../../helpers"

let seed: number
let colors: string[]
let backs: string[]

// Create a p5.js sketch in instance mode
const sketch = (p: p5) => {
	p.setup = async () => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.WEBGL)
		p.smooth()
		p.pixelDensity(2)
		colors = await getColorPalette()
		backs = ["#00A75B", "#42B6F0", "#ECABB4"]
		generate()
	}

	p.draw = () => {
		// if (p.frameCount % 40 === 0) generate()
	}

	// Set up keyboard controls with our custom generate function
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "peni",
	})

	const generate = () => {
		p.background("#E3DADB")
		// Translate to center the coordinate system
		p.translate(-p.width / 2, -p.height / 2)

		const gg = p.floor(p.random(40, 100))
		const gs = p.width / gg
		p.noStroke()
		for (let j = 0; j < gg; j++) {
			for (let i = 0; i < gg; i++) {
				p.fill(0, 5)
				p.rect(i * gs + 1, j * gs + 1, 4, 4)
				p.fill(255, 50)
				p.rect(i * gs, j * gs, 4, 4)
			}
		}

		const cc = p.floor(p.random(2, 8))
		const ss = p.width / (cc + 1)

		const ds = ss * 0.25
		for (let j = 0; j < cc * 4 + 2; j++) {
			for (let i = 0; i < cc * 4 + 2; i++) {
				const color1 = getRandomColor(p, colors)
				p.fill(p.red(color1), p.green(color1), p.blue(color1), 8)
				p.ellipse(i * ds, j * ds, ds, ds)
				const color2 = getRandomColor(p, colors)
				p.fill(p.red(color2), p.green(color2), p.blue(color2), 12)
				p.ellipse(i * ds, j * ds, ds * 0.5, ds * 0.5)
			}
		}

		const bb = 9
		const des = 2
		const s = ss - bb
		for (let j = 0; j < cc; j++) {
			for (let i = 0; i < cc; i++) {
				const xx = (i + 0.5) * ss + bb * 0.5
				const yy = (j + 0.5) * ss + bb * 0.5
				p.noStroke()
				const backColor = getRandomColor(p, backs)
				p.fill(p.red(backColor), p.green(backColor), p.blue(backColor), 200)
				p.rect(xx + des, yy + des, ss - bb, ss - bb, 3)
				p.stroke(0, 240)
				p.fill(0, 2)
				p.rect(xx, yy, ss - bb, ss - bb, 4)

				const rnd = p.floor(p.random(4))
				const cx = xx + (ss - bb) * 0.5
				const cy = yy + (ss - bb) * 0.5

				p.noStroke()
				if (rnd === 0) {
					p.fill(0, 15)
					p.ellipse(cx + 2, cy + 2, ss * 0.5, ss * 0.5)
					const color = getRandomColor(p, colors)
					p.fill(p.red(color), p.green(color), p.blue(color))
					p.ellipse(cx, cy, ss * 0.5, ss * 0.5)
				}
				if (rnd === 1) {
					p.fill(0, 15)
					diamont(cx + 2, cy + 2, ss * 0.8)
					const color = getRandomColor(p, colors)
					p.fill(p.red(color), p.green(color), p.blue(color))
					diamont(cx, cy, ss * 0.8)
				}

				if (rnd === 2) {
					const sss = ss * 0.4
					p.fill(0, 15)
					p.rect(cx - sss * 0.5 + 2, cy - sss * 0.5 + 2, sss, sss)
					const color = getRandomColor(p, colors)
					p.fill(p.red(color), p.green(color), p.blue(color))
					p.rect(cx - sss * 0.5, cy - sss * 0.5, sss, sss)
				}

				if (rnd === 3) {
					const div = p.floor(p.pow(2, p.floor(p.random(1, 4))))
					const sss = s / div
					const ns = sss * p.random(0.6, 0.8)
					const dd = (sss - ns) * 0.5 + des
					for (let jj = 0; jj < div; jj++) {
						for (let ii = 0; ii < div; ii++) {
							const color = getRandomColor(p, colors)
							p.fill(p.red(color), p.green(color), p.blue(color))
							p.rect(xx + sss * ii + dd, yy + sss * jj + dd, ns, ns, ns * 0.1)
						}
					}
				}

				const color3 = getRandomColor(p, colors)
				p.fill(p.red(color3), p.green(color3), p.blue(color3), 20)
				p.ellipse(cx, cy, ss * 0.1, ss * 0.1)
				const color4 = getRandomColor(p, colors)
				p.fill(p.red(color4), p.green(color4), p.blue(color4))
				diamont(cx, cy, ss * 0.08)
				const color5 = getRandomColor(p, colors)
				p.fill(p.red(color5), p.green(color5), p.blue(color5))
				diamont(cx, cy, ss * 0.04)
			}
		}

		p.noFill()
		for (let i = 0; i < 1000; i++) {
			const x = p.random(p.width)
			const y = p.random(p.height)
			const r = p.width * p.random(0.012)
			const a1 = p.random(p.TWO_PI)
			const a2 = a1 + p.random(p.HALF_PI)
			p.stroke(p.random(255), p.random(255) * p.random(1))
			p.arc(x, y, r, r, a1, a2)
		}

		const finalColor = getRandomColor(p, colors)
		p.fill(p.red(finalColor), p.green(finalColor), p.blue(finalColor))
		circle(p.width / 2, p.height / 2, p.width * p.random(0.3, 0.5))
	}

	const circle = (x: number, y: number, s: number) => {
		const r = s * 0.5
		const res = p.floor(p.max(8, r * p.PI))
		const da = p.TWO_PI / res

		p.beginShape()
		for (let i = 0; i < res; i++) {
			const xx = x + p.cos(da * i)
			const yy = y + p.sin(da * i)
			const rr = r * p.map(p.noise(xx, yy), 0, 1, 0.6, 1)
			p.vertex(xx * rr, yy * rr)
		}
		p.endShape(p.CLOSE)
	}

	const diamont = (x: number, y: number, s: number) => {
		const r = s * 0.5
		p.beginShape()
		p.vertex(x - r, y)
		p.vertex(x, y - r)
		p.vertex(x + r, y)
		p.vertex(x, y + r)
		p.endShape(p.CLOSE)
	}
}

// Create a new p5 instance with the sketch
new p5(sketch)
