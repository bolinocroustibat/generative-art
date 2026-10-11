import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []

	p.setup = async (): Promise<void> => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.P2D)
		p.smooth()
		p.pixelDensity(2)
		seed = p.floor(p.random(999999))
		colors = await getColorPalette()
		generate()
	}

	p.draw = (): void => {}

	const generate = (): void => {
		p.randomSeed(seed)
		p.background(rcol())

		const unit = p.width / 960
		const diag = p.dist(0, 0, p.width, p.height)
		const cc = p.int(p.random(8, p.random(8, 30)))
		for (let c = 0; c < cc; c++) {
			const x = p.random(p.width)
			const y = p.random(p.height)
			const s = p.random(60, 260) * unit
			const a = p.random(p.TWO_PI)
			const rnd = p.int(p.random(3))
			if (rnd === 0) {
				p.stroke(rcol())
				p.strokeWeight(s)
				p.strokeCap(p.SQUARE)
				p.line(x, y, x + p.cos(a) * diag, y + p.sin(a) * diag)
				p.noStroke()
				p.fill(rcol())
				p.ellipse(x, y, s, s)
			} else if (rnd === 1) {
				const c1 = rcol()
				let c2 = rcol()
				while (c1.toString() === c2.toString()) c2 = rcol()
				p.noStroke()
				p.fill(c1)
				p.arc(x, y, s, s, a - 0.01, a + p.PI + 0.01, p.OPEN)
				p.fill(c2)
				p.arc(x, y, s, s, a + p.PI, a + p.PI * 2, p.OPEN)
			} else {
				const ccc = p.int(p.random(2, 16))
				const ss = p.random(80, p.random(200, 500)) * unit
				const d = (ss / ccc) * p.random(0.1, 0.4)
				const des = ss / ccc
				const dx = -ss * 0.5
				const dy = -ss * 0.5
				const diamonds = p.random(1) < 0.5
				p.noStroke()
				p.push()
				p.translate(x, y)
				p.rotate(p.HALF_PI * 0.5 * p.int(p.random(4)))
				for (let j = 0; j < cc; j++) {
					for (let i = 0; i < cc; i++) {
						if (diamonds) {
							p.push()
							p.translate(dx + i * des, dy + j * des)
							p.rotate(p.PI * 0.25)
							p.rect(0, 0, d, d)
							p.pop()
						} else {
							p.ellipse(dx + i * des, dy + j * des, d, d)
						}
					}
				}
				p.pop()
			}
		}
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "forms",
	})
}

new p5(sketch)
