import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

type Block = {
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
		p.background(rcol())

		const unit = p.width / 960
		const rects: Block[] = [{ x: 0, y: 0, w: p.width, h: p.height }]
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

		p.stroke(0)
		p.strokeWeight(unit)
		for (const block of rects) {
			const cw = cellCount(block.w, unit)
			const ch = cellCount(block.h, unit)
			const sw = block.w / cw
			const sh = block.h / ch
			const ic = p.random(colors.length)
			const ang = p.random(p.TWO_PI)
			const des =
				p.random(colors.length * p.random(1) * p.random(8)) * p.random(0.1, 1)
			const dcw = p.cos(ang) * des
			const dch = p.sin(ang) * des
			for (let j = 0; j < ch; j++) {
				for (let i = 0; i < cw; i++) {
					p.fill(getColor(ic + dcw * i + dch * j))
					p.rect(block.x + sw * i, block.y + sh * j, sw, sh)
				}
			}
		}
	}

	const cellCount = (span: number, unit: number): number => {
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

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "cybergrids",
	})
}

new p5(sketch)
