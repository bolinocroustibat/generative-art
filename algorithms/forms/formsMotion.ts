import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

type LineMark = {
	kind: "line"
	x: number
	y: number
	s: number
	a: number
	strokeColor: p5.Color
	fillColor: p5.Color
	spin: number
	phase: number
}

type ArcMark = {
	kind: "arc"
	x: number
	y: number
	s: number
	a: number
	c1: p5.Color
	c2: p5.Color
	spin: number
	phase: number
}

type GridMark = {
	kind: "grid"
	x: number
	y: number
	rot: number
	diamonds: boolean
	d: number
	des: number
	dx: number
	dy: number
	count: number
	fillColor: p5.Color
	spin: number
	phase: number
}

type Mark = LineMark | ArcMark | GridMark

// Moving version of forms: the same marks, spinning and drifting in place
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let ready = false
	let backgroundColor: p5.Color
	let unit = 1
	let diag = 1
	let marks: Mark[] = []

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
		unit = p.width / 960
		diag = p.dist(0, 0, p.width, p.height)
		marks = []

		let lastFill = p.color(255)
		const cc = p.int(p.random(8, p.random(8, 30)))
		for (let c = 0; c < cc; c++) {
			const x = p.random(p.width)
			const y = p.random(p.height)
			const s = p.random(60, 260) * unit
			const a = p.random(p.TWO_PI)
			const rnd = p.int(p.random(3))
			const spin = p.random(0.15, 0.55) * (p.random(1) < 0.5 ? -1 : 1)
			const phase = p.random(p.TWO_PI)
			if (rnd === 0) {
				const strokeColor = rcol()
				const fillColor = rcol()
				lastFill = fillColor
				marks.push({
					kind: "line",
					x,
					y,
					s,
					a,
					strokeColor,
					fillColor,
					spin,
					phase,
				})
			} else if (rnd === 1) {
				const c1 = rcol()
				let c2 = rcol()
				while (c1.toString() === c2.toString()) c2 = rcol()
				lastFill = c2
				marks.push({ kind: "arc", x, y, s, a, c1, c2, spin, phase })
			} else {
				const ccc = p.int(p.random(2, 16))
				const ss = p.random(80, p.random(200, 500)) * unit
				const d = (ss / ccc) * p.random(0.1, 0.4)
				const des = ss / ccc
				marks.push({
					kind: "grid",
					x,
					y,
					rot: p.HALF_PI * 0.5 * p.int(p.random(4)),
					diamonds: p.random(1) < 0.5,
					d,
					des,
					dx: -ss * 0.5,
					dy: -ss * 0.5,
					count: cc,
					fillColor: lastFill,
					spin,
					phase,
				})
			}
		}
		ready = true
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const drift = (time: number, phase: number): { x: number; y: number } => {
		return {
			x: Math.sin(time * 0.35 + phase) * unit * 18,
			y: Math.cos(time * 0.28 + phase) * unit * 18,
		}
	}

	p.draw = (): void => {
		if (!ready) return

		const time = p.millis() / 1000
		p.background(backgroundColor)
		p.rectMode(p.CORNER)

		for (const mark of marks) {
			const offset = drift(time, mark.phase)
			if (mark.kind === "line") {
				const a = mark.a + time * mark.spin
				p.stroke(mark.strokeColor)
				p.strokeWeight(mark.s)
				p.strokeCap(p.SQUARE)
				p.line(
					mark.x + offset.x,
					mark.y + offset.y,
					mark.x + offset.x + p.cos(a) * diag,
					mark.y + offset.y + p.sin(a) * diag,
				)
				p.noStroke()
				p.fill(mark.fillColor)
				p.ellipse(mark.x + offset.x, mark.y + offset.y, mark.s, mark.s)
			} else if (mark.kind === "arc") {
				const a = mark.a + time * mark.spin
				p.noStroke()
				p.fill(mark.c1)
				p.arc(
					mark.x + offset.x,
					mark.y + offset.y,
					mark.s,
					mark.s,
					a - 0.01,
					a + p.PI + 0.01,
					p.OPEN,
				)
				p.fill(mark.c2)
				p.arc(
					mark.x + offset.x,
					mark.y + offset.y,
					mark.s,
					mark.s,
					a + p.PI,
					a + p.PI * 2,
					p.OPEN,
				)
			} else {
				p.noStroke()
				p.fill(mark.fillColor)
				p.push()
				p.translate(mark.x + offset.x, mark.y + offset.y)
				p.rotate(mark.rot + time * mark.spin)
				for (let j = 0; j < mark.count; j++) {
					for (let i = 0; i < mark.count; i++) {
						if (mark.diamonds) {
							p.push()
							p.translate(mark.dx + i * mark.des, mark.dy + j * mark.des)
							p.rotate(p.PI * 0.25)
							p.rect(0, 0, mark.d, mark.d)
							p.pop()
						} else {
							p.ellipse(
								mark.dx + i * mark.des,
								mark.dy + j * mark.des,
								mark.d,
								mark.d,
							)
						}
					}
				}
				p.pop()
			}
		}
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			build()
		},
		algorithmName: "formsMotion",
	})
}

new p5(sketch)
