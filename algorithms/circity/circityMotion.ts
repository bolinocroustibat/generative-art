import p5 from "p5"

import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

type Mark =
	| { kind: 0 | 1 | 2; color: p5.Color }
	| { kind: 3; color: p5.Color; ia: number }
	| { kind: 4; color: p5.Color; count: number; size: number }

type Tile = {
	x: number
	y: number
	ss: number
	man: number
	marks: Mark[]
	spin: number
}

// Moving version of circity: the same tiles, with the inner marks slowly turning
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let ready = false
	let base: p5.Graphics | null = null
	let tiles: Tile[] = []

	p.setup = async (): Promise<void> => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.P2D)
		p.smooth()
		p.pixelDensity(1)
		p.frameRate(30)
		seed = p.floor(p.random(999999))
		colors = await getColorPalette()
		build()
	}

	const build = (): void => {
		ready = false
		p.randomSeed(seed)
		if (base) base.remove()

		const { columns, rows, ss, originX, originY } = squareGrid()
		const ver = p.random(0.8, 0.9)
		const man = ver - p.random(0.05, 0.1)
		const rnd = p.int(p.random(5))

		base = p.createGraphics(p.width, p.height)
		base.pixelDensity(1)
		base.background(30)
		base.noStroke()
		base.rectMode(p.CENTER)

		for (let j = 0; j <= rows; j++) {
			for (let i = 0; i <= columns; i++) {
				const xx = originX + i * ss
				const yy = originY + j * ss
				if (rnd === 0 || rnd === 2) {
					base.fill(rcol())
					diamond(base, xx, yy, ss)
				}
				if (rnd === 1 || rnd === 3) {
					base.fill(rcol())
					base.ellipse(xx, yy, ss, ss)
				}
				if (rnd === 2) {
					base.fill(rcol())
					base.beginShape()
					base.vertex(xx - ss * 0.25, yy - ss * 0.25)
					base.vertex(xx - ss * 0.25, yy + ss * 0.25)
					base.vertex(xx + ss * 0.25, yy + ss * 0.25)
					base.vertex(xx + ss * 0.25, yy - ss * 0.25)
					base.endShape()
				}
				if (rnd === 3) {
					base.fill(rcol())
					base.ellipse(xx, yy, ss * 0.5, ss * 0.5)
				}
			}
		}

		base.stroke(160)
		for (let i = 0; i <= columns; i++) {
			const xx = originX + i * ss
			linee(base, xx, originY, xx, originY + rows * ss, columns * 10, 0.4)
		}
		for (let j = 0; j <= rows; j++) {
			const yy = originY + j * ss
			linee(base, originX, yy, originX + columns * ss, yy, rows * 10, 0.4)
		}

		base.noStroke()
		const next: Tile[] = []
		for (let j = 0; j < rows; j++) {
			for (let i = 0; i < columns; i++) {
				const xx = originX + (i + 0.5) * ss
				const yy = originY + (j + 0.5) * ss
				base.fill(rcol())
				base.ellipse(xx - ss * 0.5, yy - ss * 0.5, ss * 0.07, ss * 0.07)
				base.fill(60)
				base.ellipse(xx - ss * 0.5, yy - ss * 0.5, ss * 0.06, ss * 0.06)

				base.fill(240)
				base.rect(xx, yy, ss * ver, ss * ver, 2)
				base.fill(250)
				base.beginShape()
				base.vertex(xx - ss * ver * 0.5, yy - ss * ver * 0.5)
				base.vertex(xx + ss * ver * 0.5, yy - ss * ver * 0.5)
				base.vertex(xx + ss * ver * 0.5, yy + ss * ver * 0.5)
				base.vertex(xx + ss * ver * 0.49, yy - ss * ver * 0.49)
				base.endShape(p.CLOSE)
				base.fill(rcol())
				base.rect(xx, yy, ss * man, ss * man, 2)

				const wash = rcol()
				base.fill(p.red(wash), p.green(wash), p.blue(wash), p.random(10))
				base.ellipse(xx, yy, ss * 2, ss * 2)

				next.push({
					x: xx,
					y: yy,
					ss,
					man,
					marks: makeMarks(ss, man),
					spin: ((i + j * columns) % 5) - 2,
				})
			}
		}

		base.fill(255, 20)
		for (let j = 0; j < rows * 2; j++) {
			for (let i = 0; i < columns * 2; i++) {
				base.ellipse(originX + i * ss * 0.5, originY + j * ss * 0.5, 2, 2)
			}
		}

		tiles = next
		ready = true
	}

	const makeMarks = (ss: number, man: number): Mark[] => {
		const marks: Mark[] = []
		for (let k = 0; k < 4; k++) {
			const kind = p.int(p.random(6))
			if (kind === 0 || kind === 1 || kind === 2) {
				marks.push({ kind, color: rcol() })
			}
			if (kind === 3) {
				marks.push({
					kind: 3,
					color: rcol(),
					ia: p.int(p.random(4)) + 0.5,
				})
			}
			if (kind === 4) {
				const count = p.int(p.random(2, 10))
				const sss = (ss * man) / count
				marks.push({
					kind: 4,
					color: rcol(),
					count,
					size: p.int(sss * p.random(0.1, 0.9)),
				})
			}
		}
		return marks
	}

	const drawMarks = (tile: Tile): void => {
		const { ss, man } = tile
		for (const mark of tile.marks) {
			p.fill(mark.color)
			if (mark.kind === 0) {
				p.ellipse(0, 0, ss * 0.5, ss * 0.5)
			}
			if (mark.kind === 1) diamond(p, 0, 0, ss)
			if (mark.kind === 2) diamond(p, 0, 0, ss * man)
			if (mark.kind === 3) {
				const r = Math.sqrt(2) * ss * 0.5 * man
				p.beginShape()
				for (let l = 0; l < 3; l++) {
					p.vertex(
						p.cos(p.HALF_PI * (l + mark.ia)) * r,
						p.sin(p.HALF_PI * (l + mark.ia)) * r,
					)
				}
				p.endShape(p.CLOSE)
			}
			if (mark.kind === 4) {
				const sss = (ss * man) / mark.count
				for (let m = 0; m < mark.count; m++) {
					for (let l = 0; l < mark.count; l++) {
						p.rect(
							sss * (l + 0.5 - mark.count * 0.5),
							sss * (m + 0.5 - mark.count * 0.5),
							mark.size,
							mark.size,
						)
					}
				}
			}
		}
	}

	const diamond = (
		g: p5 | p5.Graphics,
		xx: number,
		yy: number,
		ss: number,
	): void => {
		g.beginShape()
		g.vertex(xx, yy - ss * 0.5)
		g.vertex(xx - ss * 0.5, yy)
		g.vertex(xx, yy + ss * 0.5)
		g.vertex(xx + ss * 0.5, yy)
		g.endShape()
	}

	const linee = (
		g: p5.Graphics,
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
			g.line(
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

	p.draw = (): void => {
		if (!ready || !base) return
		const time = p.millis() / 1000
		p.image(base, 0, 0)
		p.noStroke()
		p.rectMode(p.CENTER)
		for (const tile of tiles) {
			p.push()
			p.translate(tile.x, tile.y)
			p.rotate(time * tile.spin * 0.3)
			drawMarks(tile)
			p.pop()
		}
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			build()
		},
		algorithmName: "circityMotion",
	})
}

new p5(sketch)
