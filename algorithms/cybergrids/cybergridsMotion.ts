import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

type Grid = {
	x: number
	y: number
	cw: number
	ch: number
	sw: number
	sh: number
	ic: number
	dcw: number
	dch: number
}

// Moving version of cybergrids: the same cells, with color drifting across them
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let ready = false
	let backgroundColor: p5.Color
	let unit = 1
	let grids: Grid[] = []

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
		const rects: { x: number; y: number; w: number; h: number }[] = [
			{ x: 0, y: 0, w: p.width, h: p.height },
		]
		const sub = p.int(p.random(200) * p.random(1))
		for (let i = 0; i < sub; i++) {
			const ind = p.int(p.random(rects.length * p.random(1)))
			const block = rects[ind]
			const nw = block.w * p.random(0.1, 0.9)
			const nh = block.h * p.random(0.1, 0.9)
			rects.push({ x: block.x, y: block.y, w: nw, h: nh })
			rects.push({ x: block.x + nw, y: block.y, w: block.w - nw, h: nh })
			rects.push({
				x: block.x + nw,
				y: block.y + nh,
				w: block.w - nw,
				h: block.h - nh,
			})
			rects.push({ x: block.x, y: block.y + nh, w: nw, h: block.h - nh })
			rects.splice(ind, 1)
		}

		grids = rects.map((block) => {
			const cw = cellCount(block.w)
			const ch = cellCount(block.h)
			const ang = p.random(p.TWO_PI)
			const des =
				p.random(colors.length * p.random(1) * p.random(8)) * p.random(0.1, 1)
			return {
				x: block.x,
				y: block.y,
				cw,
				ch,
				sw: block.w / cw,
				sh: block.h / ch,
				ic: p.random(colors.length),
				dcw: p.cos(ang) * des,
				dch: p.sin(ang) * des,
			}
		})
		ready = true
	}

	const cellCount = (span: number): number => {
		return Math.max(2, p.int(p.random((span / unit) * p.random(0.1, 0.4))))
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const getColor = (v: number): p5.Color => {
		let value = v % colors.length
		if (value < 0) value += colors.length
		const c1 = p.color(colors[p.floor(value) % colors.length])
		const c2 = p.color(colors[p.floor(value + 1) % colors.length])
		return p.lerpColor(c1, c2, value % 1)
	}

	p.draw = (): void => {
		if (!ready) return
		const shift = (p.millis() / 1000) * 0.45
		p.background(backgroundColor)
		p.stroke(0)
		p.strokeWeight(unit)
		for (const grid of grids) {
			for (let j = 0; j < grid.ch; j++) {
				for (let i = 0; i < grid.cw; i++) {
					p.fill(getColor(grid.ic + grid.dcw * i + grid.dch * j + shift))
					p.rect(grid.x + grid.sw * i, grid.y + grid.sh * j, grid.sw, grid.sh)
				}
			}
		}
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			build()
		},
		algorithmName: "cybergridsMotion",
	})
}

new p5(sketch)
