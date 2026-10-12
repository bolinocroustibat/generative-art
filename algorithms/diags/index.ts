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
		p.noiseSeed(seed)
		p.background("#BAB9B6")

		const { columns, rows, ss, originX, originY } = squareGrid()
		const gap = ss * 0.04
		const inner = ss - gap

		p.rectMode(p.CENTER)
		p.noStroke()
		for (let j = 0; j < rows; j++) {
			for (let i = 0; i < columns; i++) {
				const cx = originX + (i + 0.5) * ss
				const cy = originY + (j + 0.5) * ss
				p.fill(240)
				p.rect(cx, cy, inner, inner)

				const x = cx - inner / 2
				const y = cy - inner / 2
				if (p.random(1) < 0.4) {
					wash(x, y, inner, ss * p.random(0.4, 1) - gap, rcol())
				}
				if (p.random(1) < 0.4) {
					corner(x, y, inner, inner, p.int(p.random(4)), rcol())
				}
				if (p.random(1) < 0.4) {
					corner(x, y, inner, inner, p.int(p.random(4)), rcol())
				}

				p.fill(rcol())
				if (p.random(1) < 0.3) p.rect(cx, cy, ss * 0.5, ss * 0.5)
				if (p.random(1) < 0.3) p.ellipse(cx, cy, ss * 0.5, ss * 0.5)
			}
		}
	}

	const squareGrid = (): {
		columns: number
		rows: number
		ss: number
		originX: number
		originY: number
	} => {
		const count = Math.max(1, p.int(p.random(4, p.random(30))))
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

	const wash = (
		x: number,
		y: number,
		w: number,
		h: number,
		col: p5.Color,
	): void => {
		if (w <= 1 || h <= 1) return
		const red = p.red(col)
		const green = p.green(col)
		const blue = p.blue(col)
		const bands = Math.max(2, Math.min(14, Math.ceil(Math.abs(h) / 6)))
		p.noStroke()
		for (let band = 0; band < bands; band++) {
			const t0 = band / bands
			const t1 = (band + 1) / bands
			p.fill(red, green, blue, p.lerp(160, 0, (t0 + t1) / 2))
			const y0 = y + h * t0
			const y1 = y + h * t1
			p.beginShape()
			p.vertex(x, y0)
			p.vertex(x + w, y0)
			p.vertex(x + w, y1)
			p.vertex(x, y1)
			p.endShape(p.CLOSE)
		}
	}

	const corner = (
		x: number,
		y: number,
		w: number,
		h: number,
		missing: number,
		col: p5.Color,
	): void => {
		const points = [
			{ x, y },
			{ x: x + w, y },
			{ x: x + w, y: y + h },
			{ x, y: y + h },
		]
		let alpha = 0
		let count = 0
		for (let i = 0; i < points.length; i++) {
			const shade = p.random(256)
			if (i === missing) continue
			alpha += shade
			count++
		}
		p.noStroke()
		p.fill(p.red(col), p.green(col), p.blue(col), alpha / Math.max(1, count))
		p.beginShape()
		for (let i = 0; i < points.length; i++) {
			if (i === missing) continue
			const point = points[i]
			if (!point) continue
			p.vertex(point.x, point.y)
		}
		p.endShape(p.CLOSE)
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "diags",
	})
}

new p5(sketch)
