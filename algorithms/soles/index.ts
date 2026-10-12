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
		p.background(250)

		const grid = squareGrid()
		const { columns, rows, ss, originX, originY } = grid
		const ds1 = p.random(10000)
		const dt1 = p.random(0.01)
		const ds2 = p.random(10000)
		const dt2 = p.random(0.01)
		const nudge = p.min(p.width, p.height) / 960
		const corner = 2 * nudge

		p.rectMode(p.CENTER)
		p.noStroke()

		for (let j = 0; j < rows; j++) {
			for (let i = 0; i < columns; i++) {
				const xx = originX + (i + 0.5) * ss
				const yy = originY + (j + 0.5) * ss
				const gx = xx
				const gy = yy

				p.fill(rcol())
				p.rect(xx + nudge, yy + nudge, ss - nudge * 2, ss - nudge * 2, corner)
				arc2(xx, yy, ss * 0.4, ss * 0.8, 0, p.TWO_PI, rcol(), 40, 0)
				arc2(xx, yy, ss * 0.4, ss * 0.6, 0, p.TWO_PI, rcol(), 40, 0)
				p.noStroke()
				p.fill(rcol())
				p.ellipse(xx, yy, ss * 0.4, ss * 0.4)

				const div = p.int(p.random(8, 32))
				const aa = p.random(0.1, 0.8)
				const an = p.random(p.TWO_PI)
				const ray = rcol()
				const da = p.TWO_PI / div
				for (let k = 0; k < div; k++) {
					arc2(
						xx,
						yy,
						ss * 0.4,
						ss * 0.7,
						an + da * k,
						an + da * (k + aa),
						ray,
						0,
						200,
					)
				}

				p.noStroke()
				p.fill(rcol())
				p.ellipse(xx, yy, ss * 0.4, ss * 0.4)
				p.fill(rcol())
				const amp = p.pow(p.noise(ds2 + gx * dt2, ds2 + gy * dt2), 0.8) * 0.4
				p.ellipse(xx, yy, ss * amp, ss * amp)

				const ang = p.int(p.noise(ds1 + gx * dt1, ds1 + gy * dt1) * 4)
				p.fill(rcol())
				p.arc(
					xx,
					yy,
					ss * 0.8,
					ss * 0.8,
					p.HALF_PI * ang,
					p.HALF_PI * (ang + 1),
					p.PIE,
				)

				const dd = ss / 4
				p.fill(rcol())
				const prob = p.random(1)
				for (let jj = -1; jj <= 1; jj++) {
					for (let ii = -1; ii <= 1; ii++) {
						if (p.random(1) < prob) continue
						p.rect(xx + ii * dd, yy + jj * dd, dd * 0.4, dd * 0.4, corner)
					}
				}
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

	const arc2 = (
		x: number,
		y: number,
		s1: number,
		s2: number,
		a1: number,
		a2: number,
		col: p5.Color,
		shd1: number,
		shd2: number,
	): void => {
		const r1 = s1 * 0.5
		const r2 = s2 * 0.5
		const amp = a2 - a1
		if (amp <= 0) return
		const outer = Math.max(r1, r2)
		const cover = Math.min(1, amp / p.TWO_PI)
		const angular = Math.max(1, Math.min(40, Math.ceil(outer * cover * 0.4)))
		const radial = Math.max(1, Math.min(6, Math.ceil(Math.abs(r2 - r1) / 8)))
		const da = amp / angular
		const red = p.red(col)
		const green = p.green(col)
		const blue = p.blue(col)
		p.noStroke()
		for (let band = 0; band < radial; band++) {
			const t0 = band / radial
			const t1 = (band + 1) / radial
			p.fill(red, green, blue, p.lerp(shd1, shd2, (t0 + t1) / 2))
			const ra = p.lerp(r1, r2, t0)
			const rb = p.lerp(r1, r2, t1)
			for (let i = 0; i < angular; i++) {
				const ang = a1 + da * i
				const c0 = p.cos(ang)
				const s0 = p.sin(ang)
				const c1 = p.cos(ang + da)
				const s1 = p.sin(ang + da)
				p.beginShape()
				p.vertex(x + c0 * ra, y + s0 * ra)
				p.vertex(x + c1 * ra, y + s1 * ra)
				p.vertex(x + c1 * rb, y + s1 * rb)
				p.vertex(x + c0 * rb, y + s0 * rb)
				p.endShape(p.CLOSE)
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
		algorithmName: "soles",
	})
}

new p5(sketch)
