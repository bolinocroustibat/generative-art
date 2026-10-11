import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

type Segment = {
	x1: number
	y1: number
	x2: number
	y2: number
	color: p5.Color
}

type Vine = {
	segments: Segment[]
	speed: number
	phase: number
}

type Dot = {
	x: number
	y: number
	s: number
	color: p5.Color
	phase: number
}

// Moving version of enredaderas: the same vines, with a light running along each path
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let ready = false
	let unit = 1
	let cell = 1
	let columns = 40
	let vines: Vine[] = []
	let dots: Dot[] = []

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
		unit = p.width / 960
		columns = 40
		cell = p.width / columns
		dots = []
		vines = []

		for (let i = 0; i < 8; i++) {
			let xx = p.random(p.width + cell)
			let yy = p.random(p.width + cell)
			xx -= xx % cell
			yy -= yy % cell
			dots.push({
				x: xx,
				y: yy,
				s: p.int(p.random(1, 3)) * cell,
				color: rcol(),
				phase: p.random(p.TWO_PI),
			})
		}

		for (let j = 0; j < 40; j++) {
			const points: { x: number; y: number }[] = []
			let dir = 3
			let xx = p.int(p.random(1, columns))
			let yy = columns
			const vel = p.int(p.random(1, p.random(1, 8)))

			for (let i = 0; i < 100; i++) {
				xx += p.int(p.cos(dir * p.HALF_PI) * vel)
				yy += p.int(p.sin(dir * p.HALF_PI) * vel)
				points.push({ x: xx, y: yy })
				const branch = p.random(1)
				if (branch < 0.5) {
					const turn = p.random(1)
					if (turn < 0.5) {
						dir++
						dir %= 4
					} else {
						dir--
						if (dir < 0) dir += 4
					}
				} else if (dir === 1) {
					const turn = p.random(1)
					dir += turn < 0.5 ? -1 : 1
				} else {
					const turn = p.random(1)
					if (turn < 0.5) dir = 3
				}
			}

			rcol()
			const segments: Segment[] = []
			for (let i = 1; i < points.length; i++) {
				const previous = points[i - 1]
				const point = points[i]
				segments.push({
					x1: previous.x * cell,
					y1: previous.y * cell,
					x2: point.x * cell,
					y2: point.y * cell,
					color: rcol(),
				})
			}
			vines.push({
				segments,
				speed: p.random(12, 32),
				phase: p.random(segments.length),
			})
		}

		ready = true
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	p.draw = (): void => {
		if (!ready) return

		const time = p.millis() / 1000
		p.background(190)
		p.rectMode(p.CENTER)
		p.noStroke()
		p.fill(200)
		for (let j = 0; j < columns; j++) {
			for (let i = 0; i < columns; i++) {
				p.rect(i * cell, j * cell, 4 * unit, 4 * unit)
			}
		}

		for (const dot of dots) {
			const pulse = 0.82 + 0.18 * Math.sin(time * 1.6 + dot.phase)
			p.fill(dot.color)
			p.ellipse(dot.x, dot.y, dot.s * pulse, dot.s * pulse)
		}

		p.noFill()
		p.strokeWeight(3 * unit)
		for (const vine of vines) {
			const count = vine.segments.length
			const head = (time * vine.speed + vine.phase) % count
			for (let i = 0; i < count; i++) {
				const segment = vine.segments[i]
				const behind = (head - i + count) % count
				const trail = 22
				const alpha = behind < trail ? p.map(behind, 0, trail, 255, 28) : 28
				p.stroke(
					p.red(segment.color),
					p.green(segment.color),
					p.blue(segment.color),
					alpha,
				)
				p.line(segment.x1, segment.y1, segment.x2, segment.y2)
			}
		}
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			build()
		},
		algorithmName: "enredaderasMotion",
	})
}

new p5(sketch)
