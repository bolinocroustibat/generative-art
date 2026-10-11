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

		const cx = p.width * 0.5
		const cy = p.height * 0.5
		const diag = p.width * 1.8
		const res = p.int(3 + p.random(60) * p.random(1) * p.random(1))
		const da = p.TWO_PI / res
		const sub = p.int(p.random(2, 200))
		p.noStroke()
		const turn = da * p.int(p.random(-30, 30))

		for (let j = 0; j < sub; j++) {
			const r1 = p.map(j, 0, sub, 0, diag)
			const r2 = p.map(j + 4, 0, sub, 0, diag)
			const ang = p.map(j, 0, sub - 1, 0, turn)
			for (let i = 0; i < res; i++) {
				const a1 = ang + da * i
				const a2 = ang + da * i + da
				drawWedge(cx, cy, r1, r2, a1, a2, rcol(), rcol())
			}
		}
	}

	const drawWedge = (
		cx: number,
		cy: number,
		r1: number,
		r2: number,
		a1: number,
		a2: number,
		c1: p5.Color,
		c2: p5.Color,
	): void => {
		const steps = 6
		for (let s = 0; s < steps; s++) {
			const t0 = s / steps
			const t1 = (s + 1) / steps
			const aa1 = p.lerp(a1, a2, t0)
			const aa2 = p.lerp(a1, a2, t1)
			p.fill(p.lerpColor(c1, c2, (t0 + t1) / 2))
			p.beginShape()
			p.vertex(cx + p.cos(aa1) * r1, cy + p.sin(aa1) * r1)
			p.vertex(cx + p.cos(aa1) * r2, cy + p.sin(aa1) * r2)
			p.vertex(cx + p.cos(aa2) * r2, cy + p.sin(aa2) * r2)
			p.vertex(cx + p.cos(aa2) * r1, cy + p.sin(aa2) * r1)
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
		algorithmName: "spiral",
	})
}

new p5(sketch)
