import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

type Wash = {
	h: number
	color: p5.Color
	phase: number
}

type Wedge = {
	missing: number
	color: p5.Color
	alpha: number
	spin: number
}

type Cell = {
	cx: number
	cy: number
	x: number
	y: number
	inner: number
	mark: number
	wash?: Wash
	wedges: Wedge[]
	box: boolean
	disk: boolean
	markColor: p5.Color
	phase: number
}

// Moving version of diags: the same tiles, with washes, wedges, and marks breathing
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let ready = false
	let cells: Cell[] = []
	let cell = 1

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
		p.randomSeed(seed)
		p.noiseSeed(seed)
		const span = p.min(p.width, p.height)
		const unit = span / 960
		const margin = 50 * unit
		const gap = 4 * unit
		const inset = 2 * unit
		const board = span - margin * 2
		const columns = 8
		cell = board / columns
		const originX = (p.width - span) / 2 + margin
		const originY = (p.height - span) / 2 + margin
		const next: Cell[] = []

		for (let j = 0; j < columns; j++) {
			for (let i = 0; i < columns; i++) {
				const tile: Cell = {
					cx: originX + (i + 0.5) * cell,
					cy: originY + (j + 0.5) * cell,
					x: originX + inset + i * cell,
					y: originY + inset + j * cell,
					inner: cell - gap,
					mark: cell * 0.5,
					wedges: [],
					box: false,
					disk: false,
					markColor: p.color(0),
					phase: (i * 3 + j * 5) * 0.65,
				}
				if (p.random(1) < 0.4) {
					tile.wash = {
						h: cell * p.random(0.4, 1) - gap,
						color: rcol(),
						phase: tile.phase,
					}
				}
				if (p.random(1) < 0.4) tile.wedges.push(makeWedge(tile.phase))
				if (p.random(1) < 0.4) tile.wedges.push(makeWedge(tile.phase + 1.7))
				tile.markColor = rcol()
				tile.box = p.random(1) < 0.3
				tile.disk = p.random(1) < 0.3
				next.push(tile)
			}
		}
		cells = next
		ready = true
	}

	const makeWedge = (phase: number): Wedge => {
		const missing = p.int(p.random(4))
		const col = rcol()
		let alpha = 0
		let count = 0
		for (let i = 0; i < 4; i++) {
			const shade = p.random(256)
			if (i === missing) continue
			alpha += shade
			count++
		}
		return {
			missing,
			color: col,
			alpha: alpha / Math.max(1, count),
			spin: ((p.floor(phase) % 5) - 2) * 0.35,
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

	const wedge = (
		cx: number,
		cy: number,
		w: number,
		h: number,
		missing: number,
		col: p5.Color,
		alpha: number,
		angle: number,
	): void => {
		const points = [
			{ x: -w / 2, y: -h / 2 },
			{ x: w / 2, y: -h / 2 },
			{ x: w / 2, y: h / 2 },
			{ x: -w / 2, y: h / 2 },
		]
		const cos = p.cos(angle)
		const sin = p.sin(angle)
		p.noStroke()
		p.fill(p.red(col), p.green(col), p.blue(col), alpha)
		p.beginShape()
		for (let i = 0; i < points.length; i++) {
			if (i === missing) continue
			const point = points[i]
			if (!point) continue
			p.vertex(
				cx + point.x * cos - point.y * sin,
				cy + point.x * sin + point.y * cos,
			)
		}
		p.endShape(p.CLOSE)
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	p.draw = (): void => {
		if (!ready) return
		const time = p.millis() / 1000
		p.background("#BAB9B6")
		p.rectMode(p.CENTER)
		p.noStroke()
		for (const tile of cells) {
			p.fill(240)
			p.rect(tile.cx, tile.cy, tile.inner, tile.inner)
			if (tile.wash) {
				const pulse = 0.62 + 0.38 * Math.sin(time * 0.8 + tile.wash.phase)
				wash(tile.x, tile.y, tile.inner, tile.wash.h * pulse, tile.wash.color)
			}
			for (const shape of tile.wedges) {
				wedge(
					tile.cx,
					tile.cy,
					tile.inner,
					tile.inner,
					shape.missing,
					shape.color,
					shape.alpha,
					time * shape.spin,
				)
			}
			const scale = 0.82 + 0.22 * Math.sin(time * 1.1 + tile.phase)
			p.fill(tile.markColor)
			if (tile.box)
				p.rect(tile.cx, tile.cy, tile.mark * scale, tile.mark * scale)
			if (tile.disk)
				p.ellipse(tile.cx, tile.cy, tile.mark * scale, tile.mark * scale)
		}
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			build()
		},
		algorithmName: "diagsMotion",
	})
}

new p5(sketch)
