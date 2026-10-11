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
		p.background(0)

		const unit = p.min(p.width, p.height)
		for (let i = 0; i < 100; i++) {
			const x = p.random(p.width)
			const y = p.random(p.height)
			const s = unit * p.random(0.4)
			p.stroke(0)
			p.fill(rcol())
			p.ellipse(x, y, s, s)
			arc2(x, y, s, s * 1.8, 0, p.TWO_PI, rcol(), 80, 0)
		}

		const sub = p.int(p.random(1, 3))
		const div = p.int(p.random(50))
		for (let j = 0; j < div; j++) {
			const ang = p.map(j, 0, div, 0, p.TWO_PI)
			for (let i = 0; i < sub; i++) {
				const dis = p.map(i, 0, sub, 0.1, 0.8) * unit
				circulo(
					p.width * 0.5 + p.cos(ang) * dis,
					p.height * 0.5 + p.sin(ang) * dis,
					p.random(0.05, 0.33) * unit,
				)
			}
		}
	}

	const circulo = (x: number, y: number, s: number): void => {
		const cs = p.int(p.random(0, 50))
		const amp = p.random(1)
		const ia = p.random(p.TWO_PI)
		const sub = p.int(p.random(10))
		const div = p.int(p.random(30))
		for (let j = 0; j < div; j++) {
			const ang = ia + p.map(j, 0, div, 0, p.TWO_PI)
			for (let i = 0; i < sub; i++) {
				const dis = p.map(i, 0, sub, 0.1, p.cos(ang * cs) * (0.2 + amp)) * s
				const ss = p.random(4) * p.random(1)
				const a2 = p.random(60) * p.random(1)
				const xx = x + p.cos(ang) * dis
				const yy = y + p.sin(ang) * dis
				arc2(xx, yy, ss * a2, ss * a2 * 1.8, 0, p.TWO_PI, rcol(), 80, 0)
				const fill = rcol()
				p.stroke(0)
				p.fill(p.red(fill), p.green(fill), p.blue(fill), p.random(250))
				p.ellipse(xx, yy, ss, ss)
				p.ellipse(xx, yy, ss * a2, ss * a2)
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
		shd1: number,
		shd2: number,
	): void => {
		const r1 = s1 * 0.5
		const r2 = s2 * 0.5
		const amp = a2 - a1
		if (amp <= 0) return
		const outer = Math.max(Math.abs(r1), Math.abs(r2))
		if (outer < 0.4) return
		const cover = Math.min(1, amp / p.TWO_PI)
		const angular = Math.max(1, Math.min(36, Math.ceil(outer * cover * 0.28)))
		const radial = Math.max(1, Math.min(5, Math.ceil(Math.abs(r2 - r1) / 10)))
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
		algorithmName: "gotas",
	})
}

new p5(sketch)
