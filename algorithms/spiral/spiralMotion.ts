import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

type Wedge = {
	r1: number
	r2: number
	a1: number
	a2: number
	c1: p5.Color
	c2: p5.Color
	ring: number
}

// Moving version of spiral: the same wedges, with outer rings turning faster
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let ready = false
	let backgroundColor: p5.Color
	let wedges: Wedge[] = []

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
		backgroundColor = rcol()
		wedges = []

		const diag = p.width * 1.8
		const res = p.int(3 + p.random(60) * p.random(1) * p.random(1))
		const da = p.TWO_PI / res
		const sub = p.int(p.random(2, 200))
		const turn = da * p.int(p.random(-30, 30))

		for (let j = 0; j < sub; j++) {
			const r1 = p.map(j, 0, sub, 0, diag)
			const r2 = p.map(j + 4, 0, sub, 0, diag)
			const ang = p.map(j, 0, sub - 1, 0, turn)
			for (let i = 0; i < res; i++) {
				wedges.push({
					r1,
					r2,
					a1: ang + da * i,
					a2: ang + da * i + da,
					c1: rcol(),
					c2: rcol(),
					ring: j,
				})
			}
		}
		ready = true
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const quad = (
		cx: number,
		cy: number,
		r1: number,
		r2: number,
		a1: number,
		a2: number,
		color: p5.Color,
	): void => {
		p.fill(color)
		p.beginShape()
		p.vertex(cx + p.cos(a1) * r1, cy + p.sin(a1) * r1)
		p.vertex(cx + p.cos(a1) * r2, cy + p.sin(a1) * r2)
		p.vertex(cx + p.cos(a2) * r2, cy + p.sin(a2) * r2)
		p.vertex(cx + p.cos(a2) * r1, cy + p.sin(a2) * r1)
		p.endShape(p.CLOSE)
	}

	p.draw = (): void => {
		if (!ready) return

		const time = p.millis() / 1000
		const cx = p.width * 0.5
		const cy = p.height * 0.5
		p.background(backgroundColor)
		p.noStroke()

		for (const wedge of wedges) {
			const spin = time * (0.18 + wedge.ring * 0.004)
			const a1 = wedge.a1 + spin
			const a2 = wedge.a2 + spin
			const mid = (a1 + a2) / 2
			quad(cx, cy, wedge.r1, wedge.r2, a1, mid, wedge.c1)
			quad(cx, cy, wedge.r1, wedge.r2, mid, a2, wedge.c2)
		}
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			build()
		},
		algorithmName: "spiralMotion",
	})
}

new p5(sketch)
