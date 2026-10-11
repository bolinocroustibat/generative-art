import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

type Sun = {
	x: number
	y: number
	sprite: p5.Graphics
	spin: number
}

// Moving version of soles: the same suns, with each face slowly turning
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let ready = false
	let base: p5.Graphics | null = null
	let suns: Sun[] = []

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
		p.noiseSeed(seed)
		if (base) base.remove()
		for (const sun of suns) sun.sprite.remove()

		const span = p.min(p.width, p.height)
		const cc = p.int(p.random(4, p.random(30)))
		const ss = span / (cc + 1)
		const originX = (p.width - span) / 2
		const originY = (p.height - span) / 2
		const ds1 = p.random(10000)
		const dt1 = p.random(0.01)
		const ds2 = p.random(10000)
		const dt2 = p.random(0.01)
		const nudge = span / 960
		const corner = 2 * nudge

		base = p.createGraphics(p.width, p.height)
		base.pixelDensity(1)
		base.background(250)
		base.rectMode(p.CENTER)
		base.noStroke()

		const next: Sun[] = []
		for (let j = 0; j < cc; j++) {
			for (let i = 0; i < cc; i++) {
				const gx = (i + 1) * ss
				const gy = (j + 1) * ss
				const xx = originX + gx
				const yy = originY + gy

				base.fill(rcol())
				base.rect(
					xx + nudge,
					yy + nudge,
					ss - nudge * 2,
					ss - nudge * 2,
					corner,
				)
				arc2(base, xx, yy, ss * 0.4, ss * 0.8, 0, p.TWO_PI, rcol(), 40, 0)
				arc2(base, xx, yy, ss * 0.4, ss * 0.6, 0, p.TWO_PI, rcol(), 40, 0)

				const face = p.createGraphics(
					Math.max(2, Math.ceil(ss)),
					Math.max(2, Math.ceil(ss)),
				)
				face.pixelDensity(1)
				face.clear()
				face.rectMode(p.CENTER)
				const cx = face.width / 2
				const cy = face.height / 2

				face.noStroke()
				face.fill(rcol())
				face.ellipse(cx, cy, ss * 0.4, ss * 0.4)

				const div = p.int(p.random(8, 32))
				const aa = p.random(0.1, 0.8)
				const an = p.random(p.TWO_PI)
				const ray = rcol()
				const da = p.TWO_PI / div
				for (let k = 0; k < div; k++) {
					arc2(
						face,
						cx,
						cy,
						ss * 0.4,
						ss * 0.7,
						an + da * k,
						an + da * (k + aa),
						ray,
						0,
						200,
					)
				}

				face.noStroke()
				face.fill(rcol())
				face.ellipse(cx, cy, ss * 0.4, ss * 0.4)
				face.fill(rcol())
				const amp = p.pow(p.noise(ds2 + gx * dt2, ds2 + gy * dt2), 0.8) * 0.4
				face.ellipse(cx, cy, ss * amp, ss * amp)

				const ang = p.int(p.noise(ds1 + gx * dt1, ds1 + gy * dt1) * 4)
				face.fill(rcol())
				face.arc(
					cx,
					cy,
					ss * 0.8,
					ss * 0.8,
					p.HALF_PI * ang,
					p.HALF_PI * (ang + 1),
					p.PIE,
				)

				const dd = ss / 4
				face.fill(rcol())
				const prob = p.random(1)
				for (let jj = -1; jj <= 1; jj++) {
					for (let ii = -1; ii <= 1; ii++) {
						if (p.random(1) < prob) continue
						face.rect(cx + ii * dd, cy + jj * dd, dd * 0.4, dd * 0.4, corner)
					}
				}

				next.push({
					x: xx,
					y: yy,
					sprite: face,
					spin: ((i + j * Math.max(cc, 1)) % 5) - 2,
				})
			}
		}

		suns = next
		ready = true
	}

	const arc2 = (
		g: p5.Graphics,
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
		g.noStroke()
		for (let band = 0; band < radial; band++) {
			const t0 = band / radial
			const t1 = (band + 1) / radial
			g.fill(red, green, blue, p.lerp(shd1, shd2, (t0 + t1) / 2))
			const ra = p.lerp(r1, r2, t0)
			const rb = p.lerp(r1, r2, t1)
			for (let i = 0; i < angular; i++) {
				const ang = a1 + da * i
				const c0 = p.cos(ang)
				const s0 = p.sin(ang)
				const c1 = p.cos(ang + da)
				const s1 = p.sin(ang + da)
				g.beginShape()
				g.vertex(x + c0 * ra, y + s0 * ra)
				g.vertex(x + c1 * ra, y + s1 * ra)
				g.vertex(x + c1 * rb, y + s1 * rb)
				g.vertex(x + c0 * rb, y + s0 * rb)
				g.endShape(p.CLOSE)
			}
		}
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	p.draw = (): void => {
		if (!ready || !base) return
		const time = p.millis() / 1000
		p.image(base, 0, 0)
		p.imageMode(p.CENTER)
		for (const sun of suns) {
			p.push()
			p.translate(sun.x, sun.y)
			p.rotate(time * sun.spin * 0.35)
			p.image(sun.sprite, 0, 0)
			p.pop()
		}
		p.imageMode(p.CORNER)
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			build()
		},
		algorithmName: "solesMotion",
	})
}

new p5(sketch)
