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
		p.resetMatrix()
		p.background("#1E211C")
		p.translate(p.width / 2, p.height / 2)

		const unit = p.min(p.width, p.height)
		const ss = p.random(unit * 0.06, unit * 0.33)
		const dx = ss * 2 * (3 / 4)
		const dy = (Math.sqrt(3) * ss) / 4
		const cw = p.int(p.width / dx) + 2
		const ch = p.int(p.height / dy) + 2
		p.noStroke()
		for (let j = -p.int(ch / 2); j <= ch / 2; j++) {
			for (let i = -p.int(cw / 2); i <= cw / 2; i++) {
				const x = (j % 2 === 0 ? i : i + 0.5) * dx
				const y = j * dy
				drawNestedHex(x - dx * 0.5, y - dy, ss * p.random(0.6))
				drawNestedHex(x, y, ss)
				hexTri(x, y, ss)
			}
		}
	}

	const drawNestedHex = (x: number, y: number, start: number): void => {
		let s = start
		for (let k = 0; k < 100 && s > 1; k++) {
			p.fill(rcol())
			hex(x, y, s)
			s *= p.random(p.random(0.95, 1))
		}
	}

	const hex = (x: number, y: number, s: number): void => {
		const r = s * 0.5
		const da = p.TWO_PI / 6
		p.beginShape()
		for (let i = 0; i < 6; i++) {
			const ang = da * i
			p.vertex(x + p.cos(ang) * r, y + p.sin(ang) * r)
		}
		p.endShape(p.CLOSE)
	}

	const hexTri = (x: number, y: number, s: number): void => {
		const r = s * 0.5
		const da = p.TWO_PI / 6
		for (let i = 0; i < 6; i++) {
			const ang = da * i
			const ang2 = da * (i + 1)
			p.beginShape()
			p.fill(0, p.random(120))
			p.vertex(x, y)
			p.fill(0, p.random(120))
			p.vertex(x + p.cos(ang) * r, y + p.sin(ang) * r)
			p.fill(0, p.random(120))
			p.vertex(x + p.cos(ang2) * r, y + p.sin(ang2) * r)
			p.endShape(p.CLOSE)
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
		algorithmName: "hexa",
	})
}

new p5(sketch)
