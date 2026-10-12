import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

type Panel = {
	x: number
	y: number
	w: number
	h: number
	color: p5.Color
	dotX: number
	dotY: number
	vx: number
	vy: number
}

type LineMark = {
	x1: number
	y1: number
	x2: number
	y2: number
}

// Moving version of pliegues: the same folds, with dots wandering inside them
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let ready = false
	let ink: p5.Color
	let weight = 1
	let dot = 4
	let lines: LineMark[] = []
	let panels: Panel[] = []

	p.setup = async (): Promise<void> => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.P2D)
		ink = p.color(255)
		p.smooth()
		p.pixelDensity(1)
		p.frameRate(30)
		seed = p.floor(p.random(999999))
		colors = await getColorPalette()
		build()
	}

	const build = (): void => {
		p.randomSeed(seed)
		const unit = p.min(p.width, p.height) / 960
		const gap = p.random(10, 24) * unit
		ink = p.lerpColor(p.color(255), p.color("#B2B2B2"), p.random(0.4, 0.6))
		weight = 1.2 * unit
		dot = 4 * unit
		lines = []
		for (let i = -gap * 0.5; i < p.width + gap; i += gap) {
			const jx = p.random(-1, 1) * unit
			const jy = p.random(-1, 1) * unit
			lines.push({
				x1: i + jx,
				y1: 0,
				x2: i + p.random(-1, 1) * unit,
				y2: p.height,
			})
			lines.push({
				x1: 0,
				y1: i + jy,
				x2: p.width,
				y2: i + p.random(-1, 1) * unit,
			})
		}

		const next: Panel[] = [
			{
				x: gap,
				y: gap,
				w: p.width - gap * 2,
				h: p.height - gap * 2,
				color: p.color(0),
				dotX: 0,
				dotY: 0,
				vx: 0,
				vy: 0,
			},
		]
		const splits = p.int(p.random(4, 37))
		for (let i = 0; i < splits; i++) {
			const index = p.int(p.random(next.length))
			const panel = next[index]
			if (!panel) continue
			const nw = panel.w * p.random(0.35, 0.65)
			const nh = panel.h * p.random(0.35, 0.65)
			const blank = {
				color: p.color(0),
				dotX: 0,
				dotY: 0,
				vx: 0,
				vy: 0,
			}
			next.push(
				{ x: panel.x, y: panel.y, w: nw, h: nh, ...blank },
				{ x: panel.x + nw, y: panel.y, w: panel.w - nw, h: nh, ...blank },
				{
					x: panel.x + nw,
					y: panel.y + nh,
					w: panel.w - nw,
					h: panel.h - nh,
					...blank,
				},
				{ x: panel.x, y: panel.y + nh, w: nw, h: panel.h - nh, ...blank },
			)
			next.splice(index, 1)
		}

		for (let i = 0; i < next.length; i++) {
			const panel = next[i]
			if (!panel) continue
			panel.color = rcol()
			panel.dotX = panel.x + p.random(panel.w)
			panel.dotY = panel.y + p.random(panel.h)
			const heading = i * 1.7
			const speed = 18 + (i % 4) * 10
			panel.vx = p.cos(heading) * speed
			panel.vy = p.sin(heading) * speed
		}
		panels = next
		ready = true
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	p.draw = (): void => {
		if (!ready) return
		const dt = Math.min(0.05, p.deltaTime / 1000)
		const pad = dot
		p.background("#B2B2B2")
		p.stroke(ink)
		p.strokeWeight(weight)
		for (const line of lines) p.line(line.x1, line.y1, line.x2, line.y2)

		p.noStroke()
		for (const panel of panels) {
			p.fill(panel.color)
			p.rect(panel.x + 1, panel.y + 1, panel.w - 2, panel.h - 2)
			panel.dotX += panel.vx * dt
			panel.dotY += panel.vy * dt
			if (panel.w > pad * 2) {
				if (
					panel.dotX < panel.x + pad ||
					panel.dotX > panel.x + panel.w - pad
				) {
					panel.vx *= -1
					panel.dotX = p.constrain(
						panel.dotX,
						panel.x + pad,
						panel.x + panel.w - pad,
					)
				}
			}
			if (panel.h > pad * 2) {
				if (
					panel.dotY < panel.y + pad ||
					panel.dotY > panel.y + panel.h - pad
				) {
					panel.vy *= -1
					panel.dotY = p.constrain(
						panel.dotY,
						panel.y + pad,
						panel.y + panel.h - pad,
					)
				}
			}
			p.fill(255)
			p.ellipse(panel.dotX, panel.dotY, dot, dot)
		}
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			build()
		},
		algorithmName: "plieguesMotion",
	})
}

new p5(sketch)
