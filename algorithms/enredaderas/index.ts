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
		p.background(190)

		const unit = p.width / 960
		p.rectMode(p.CENTER)
		const cc = 40
		const dd = p.width / cc
		p.noStroke()
		p.fill(200)
		for (let j = 0; j < cc; j++) {
			for (let i = 0; i < cc; i++) {
				p.rect(i * dd, j * dd, 4 * unit, 4 * unit)
			}
		}

		for (let i = 0; i < 8; i++) {
			let xx = p.random(p.width + dd)
			let yy = p.random(p.width + dd)
			xx -= xx % dd
			yy -= yy % dd
			const ss = p.int(p.random(1, 3)) * dd
			p.fill(rcol())
			p.ellipse(xx, yy, ss, ss)
		}

		for (let j = 0; j < 40; j++) {
			const points: { x: number; y: number }[] = []
			let dir = 3
			let xx = p.int(p.random(1, cc))
			let yy = cc
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

			p.noFill()
			p.strokeWeight(3 * unit)
			rcol()
			for (let i = 0; i < points.length; i++) {
				const color = rcol()
				const point = points[i]
				if (i === 0) continue
				const previous = points[i - 1]
				p.stroke(color)
				p.line(previous.x * dd, previous.y * dd, point.x * dd, point.y * dd)
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
		algorithmName: "enredaderas",
	})
}

new p5(sketch)
