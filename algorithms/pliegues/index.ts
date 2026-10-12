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
}

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
		p.background("#B2B2B2")

		const unit = p.min(p.width, p.height) / 960
		const gap = p.random(10, 24) * unit
		const ink = p.lerpColor(
			p.color(255),
			p.color("#B2B2B2"),
			p.random(0.4, 0.6),
		)
		p.strokeWeight(1.2 * unit)
		p.stroke(ink)
		for (let i = -gap * 0.5; i < p.width + gap; i += gap) {
			const jx = p.random(-1, 1) * unit
			const jy = p.random(-1, 1) * unit
			p.line(i + jx, 0, i + p.random(-1, 1) * unit, p.height)
			p.line(0, i + jy, p.width, i + p.random(-1, 1) * unit)
		}

		const panels: Panel[] = [
			{ x: gap, y: gap, w: p.width - gap * 2, h: p.height - gap * 2 },
		]
		const splits = p.int(p.random(4, 37))
		for (let i = 0; i < splits; i++) {
			const index = p.int(p.random(panels.length))
			const panel = panels[index]
			if (!panel) continue
			const nw = panel.w * p.random(0.35, 0.65)
			const nh = panel.h * p.random(0.35, 0.65)
			panels.push(
				{ x: panel.x, y: panel.y, w: nw, h: nh },
				{ x: panel.x + nw, y: panel.y, w: panel.w - nw, h: nh },
				{ x: panel.x + nw, y: panel.y + nh, w: panel.w - nw, h: panel.h - nh },
				{ x: panel.x, y: panel.y + nh, w: nw, h: panel.h - nh },
			)
			panels.splice(index, 1)
		}

		p.noStroke()
		const dot = 4 * unit
		for (const panel of panels) {
			p.fill(rcol())
			p.rect(
				panel.x + unit,
				panel.y + unit,
				panel.w - unit * 2,
				panel.h - unit * 2,
			)
			p.fill(255)
			p.ellipse(
				panel.x + p.random(panel.w),
				panel.y + p.random(panel.h),
				dot,
				dot,
			)
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
		algorithmName: "pliegues",
	})
}

new p5(sketch)
