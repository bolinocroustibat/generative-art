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
		p.background(30)

		const { columns, rows, ss, originX, originY } = squareGrid()
		const ver = p.random(0.8, 0.9)
		const man = ver - p.random(0.05, 0.1)
		const rnd = p.int(p.random(5))

		p.noStroke()
		p.rectMode(p.CENTER)
		for (let j = 0; j <= rows; j++) {
			for (let i = 0; i <= columns; i++) {
				const xx = originX + i * ss
				const yy = originY + j * ss
				if (rnd === 0 || rnd === 2) {
					p.fill(rcol())
					diamond(xx, yy, ss)
				}
				if (rnd === 1 || rnd === 3) {
					p.fill(rcol())
					p.ellipse(xx, yy, ss, ss)
				}
				if (rnd === 2) {
					p.fill(rcol())
					p.beginShape()
					p.vertex(xx - ss * 0.25, yy - ss * 0.25)
					p.vertex(xx - ss * 0.25, yy + ss * 0.25)
					p.vertex(xx + ss * 0.25, yy + ss * 0.25)
					p.vertex(xx + ss * 0.25, yy - ss * 0.25)
					p.endShape()
				}
				if (rnd === 3) {
					p.fill(rcol())
					p.ellipse(xx, yy, ss * 0.5, ss * 0.5)
				}
			}
		}

		p.stroke(160)
		for (let i = 0; i <= columns; i++) {
			const xx = originX + i * ss
			linee(xx, originY, xx, originY + rows * ss, columns * 10, 0.4)
		}
		for (let j = 0; j <= rows; j++) {
			const yy = originY + j * ss
			linee(originX, yy, originX + columns * ss, yy, rows * 10, 0.4)
		}

		p.noStroke()
		for (let j = 0; j < rows; j++) {
			for (let i = 0; i < columns; i++) {
				const xx = originX + (i + 0.5) * ss
				const yy = originY + (j + 0.5) * ss
				p.fill(rcol())
				p.ellipse(xx - ss * 0.5, yy - ss * 0.5, ss * 0.07, ss * 0.07)
				p.fill(60)
				p.ellipse(xx - ss * 0.5, yy - ss * 0.5, ss * 0.06, ss * 0.06)

				p.fill(240)
				p.rect(xx, yy, ss * ver, ss * ver, 2)
				p.fill(250)
				p.beginShape()
				p.vertex(xx - ss * ver * 0.5, yy - ss * ver * 0.5)
				p.vertex(xx + ss * ver * 0.5, yy - ss * ver * 0.5)
				p.vertex(xx + ss * ver * 0.5, yy + ss * ver * 0.5)
				p.vertex(xx + ss * ver * 0.49, yy - ss * ver * 0.49)
				p.endShape(p.CLOSE)
				p.fill(rcol())
				p.rect(xx, yy, ss * man, ss * man, 2)

				const wash = rcol()
				p.fill(p.red(wash), p.green(wash), p.blue(wash), p.random(10))
				p.ellipse(xx, yy, ss * 2, ss * 2)

				drawMarks(xx, yy, ss, man)
			}
		}

		p.fill(255, 20)
		for (let j = 0; j < rows * 2; j++) {
			for (let i = 0; i < columns * 2; i++) {
				p.ellipse(originX + i * ss * 0.5, originY + j * ss * 0.5, 2, 2)
			}
		}
	}

	const drawMarks = (xx: number, yy: number, ss: number, man: number): void => {
		for (let k = 0; k < 4; k++) {
			const kind = p.int(p.random(6))
			if (kind === 0) {
				p.fill(rcol())
				p.ellipse(xx, yy, ss * 0.5, ss * 0.5)
			}
			if (kind === 1) {
				p.fill(rcol())
				diamond(xx, yy, ss)
			}
			if (kind === 2) {
				p.fill(rcol())
				diamond(xx, yy, ss * man)
			}
			if (kind === 3) {
				const ia = p.int(p.random(4)) + 0.5
				const r = Math.sqrt(2) * ss * 0.5 * man
				p.fill(rcol())
				p.beginShape()
				for (let l = 0; l < 3; l++) {
					p.vertex(
						xx + p.cos(p.HALF_PI * (l + ia)) * r,
						yy + p.sin(p.HALF_PI * (l + ia)) * r,
					)
				}
				p.endShape(p.CLOSE)
			}
			if (kind === 4) {
				const cc = p.int(p.random(2, 10))
				const sss = (ss * man) / cc
				const ssss = p.int(sss * p.random(0.1, 0.9))
				p.fill(rcol())
				for (let m = 0; m < cc; m++) {
					for (let l = 0; l < cc; l++) {
						p.rect(
							xx + sss * (l + 0.5 - cc * 0.5),
							yy + sss * (m + 0.5 - cc * 0.5),
							ssss,
							ssss,
						)
					}
				}
			}
		}
	}

	const diamond = (xx: number, yy: number, ss: number): void => {
		p.beginShape()
		p.vertex(xx, yy - ss * 0.5)
		p.vertex(xx - ss * 0.5, yy)
		p.vertex(xx, yy + ss * 0.5)
		p.vertex(xx + ss * 0.5, yy)
		p.endShape()
	}

	const linee = (
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		div: number,
		amp: number,
	): void => {
		for (let i = 0; i < div; i++) {
			const v1 = p.map(i + amp, 0, div, 0, 1)
			const v2 = p.map(i + 1 - amp, 0, div, 0, 1)
			p.line(
				p.lerp(x1, x2, v1),
				p.lerp(y1, y2, v1),
				p.lerp(x1, x2, v2),
				p.lerp(y1, y2, v2),
			)
		}
	}

	const squareGrid = (): {
		columns: number
		rows: number
		ss: number
		originX: number
		originY: number
	} => {
		const count = Math.max(1, p.int(p.random(3, p.random(5, 40))))
		const ss = p.min(p.width, p.height) / count
		const columns = Math.max(1, Math.floor(p.width / ss))
		const rows = Math.max(1, Math.floor(p.height / ss))
		return {
			columns,
			rows,
			ss,
			originX: (p.width - columns * ss) / 2,
			originY: (p.height - rows * ss) / 2,
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
		algorithmName: "circity",
	})
}

new p5(sketch)
