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
		p.noiseSeed(seed)
		p.background(80)

		const unit = p.width / 960
		const sub = p.int(p.random(8, 30))
		const ps = [0, 1]
		for (let i = 2; i < sub; i++) {
			ps.push(p.random(1))
		}
		ps.sort((a, b) => a - b)

		for (let i = 1; i < ps.length; i++) {
			const x = ps[i - 1] * p.width
			const w = p.width * (ps[i] - ps[i - 1])
			const hh: number[] = []
			const cc = p.int(p.random(8, p.random(40, 120)))
			for (let j = 2; j < cc; j++) {
				hh.push(p.random(1))
			}
			hh.push(0, 1)
			hh.sort((a, b) => a - b)
			for (let j = 1; j < hh.length; j++) {
				const y = p.height * hh[j - 1]
				const h = p.height * (hh[j] - hh[j - 1])
				const top = getMix()
				const bottom = getMix()
				p.noStroke()
				gradientRect(x, y, w, h, top, bottom)
				p.stroke(0)
				p.strokeWeight(unit)
				p.noFill()
				p.rect(x, y, w, h)
			}
		}

		const des = p.random(1000)
		const det = p.random(0.006)
		const pwr = p.random(0.8, 1.2)
		p.noStroke()
		p.noiseDetail(2)
		const div = p.int(p.random(1, 100))
		const dh = p.height / div
		const step = Math.max(2, p.int(p.width / 480))

		const ridge = (x: number, y: number): number => {
			return p.map(
				p.pow(p.noise(des + x * det, y * det), pwr),
				0,
				1,
				p.height * 0.2,
				p.height * 0.7,
			)
		}

		for (let j = 0; j < div; j++) {
			const y1 = dh * j
			const y2 = dh * (j + 1)
			const top = getMix()
			const bottom = getMix()
			const xs: number[] = []
			for (let i = 0; i <= p.width; i += step) xs.push(i)
			if (xs[xs.length - 1] !== p.width) xs.push(p.width)

			const topY = (x: number): number => ridge(x, y1) + y1
			const botY = (x: number): number => ridge(x, y2) + y2
			const bands = 8
			for (let s = 0; s < bands; s++) {
				const t0 = s / bands
				const t1 = (s + 1) / bands
				p.fill(p.lerpColor(top, bottom, (t0 + t1) / 2))
				p.beginShape()
				for (const x of xs) {
					p.vertex(x, p.lerp(topY(x), botY(x), t0))
				}
				for (let i = xs.length - 1; i >= 0; i--) {
					const x = xs[i]
					p.vertex(x, p.lerp(topY(x), botY(x), t1))
				}
				p.endShape(p.CLOSE)
			}
		}
	}

	const gradientRect = (
		x: number,
		y: number,
		w: number,
		h: number,
		top: p5.Color,
		bottom: p5.Color,
	): void => {
		const steps = Math.max(1, Math.min(24, Math.ceil(Math.abs(h) / 8)))
		for (let i = 0; i < steps; i++) {
			const t = (i + 0.5) / steps
			p.fill(p.lerpColor(top, bottom, t))
			p.rect(x, y + (h * i) / steps, w, Math.abs(h) / steps + 0.5)
		}
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const getMix = (): p5.Color => {
		return p.lerpColor(rcol(), rcol(), p.random(1))
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "montains",
	})
}

new p5(sketch)
