import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

type Ribbon = {
	y1: number
	y2: number
	top: p5.Color
	bottom: p5.Color
}

// Moving version of montains: the same blocks, with ridges that drift sideways
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let ready = false
	let blocks: p5.Graphics | null = null
	let des = 0
	let det = 0.006
	let pwr = 1
	let step = 4
	let ribbons: Ribbon[] = []
	let samples: number[] = []

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
		p.noiseSeed(seed)
		ready = false
		if (blocks) blocks.remove()
		blocks = p.createGraphics(p.width, p.height)
		blocks.pixelDensity(1)
		paintBlocks(blocks)

		des = p.random(1000)
		det = p.random(0.006)
		pwr = p.random(0.8, 1.2)
		p.noiseDetail(2)
		const div = p.int(p.random(1, 100))
		const dh = p.height / div
		step = Math.max(4, p.int(p.width / 220))
		samples = []
		for (let x = 0; x <= p.width; x += step) samples.push(x)
		if (samples[samples.length - 1] !== p.width) samples.push(p.width)

		ribbons = []
		for (let j = 0; j < div; j++) {
			ribbons.push({
				y1: dh * j,
				y2: dh * (j + 1),
				top: getMix(),
				bottom: getMix(),
			})
		}
		ready = true
	}

	const paintBlocks = (g: p5.Graphics): void => {
		g.background(80)
		const unit = p.width / 960
		const sub = p.int(p.random(8, 30))
		const ps = [0, 1]
		for (let i = 2; i < sub; i++) ps.push(p.random(1))
		ps.sort((a, b) => a - b)

		for (let i = 1; i < ps.length; i++) {
			const x = ps[i - 1] * p.width
			const w = p.width * (ps[i] - ps[i - 1])
			const hh: number[] = []
			const cc = p.int(p.random(8, p.random(40, 120)))
			for (let j = 2; j < cc; j++) hh.push(p.random(1))
			hh.push(0, 1)
			hh.sort((a, b) => a - b)
			for (let j = 1; j < hh.length; j++) {
				const y = p.height * hh[j - 1]
				const h = p.height * (hh[j] - hh[j - 1])
				const top = getMix()
				const bottom = getMix()
				g.noStroke()
				const steps = Math.max(1, Math.min(12, Math.ceil(Math.abs(h) / 16)))
				for (let s = 0; s < steps; s++) {
					const t = (s + 0.5) / steps
					g.fill(p.lerpColor(top, bottom, t))
					g.rect(x, y + (h * s) / steps, w, Math.abs(h) / steps + 0.5)
				}
				g.stroke(0)
				g.strokeWeight(unit)
				g.noFill()
				g.rect(x, y, w, h)
			}
		}
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const getMix = (): p5.Color => {
		return p.lerpColor(rcol(), rcol(), p.random(1))
	}

	const ridge = (x: number, y: number, shift: number): number => {
		return p.map(
			p.pow(p.noise(des + (x + shift) * det, y * det), pwr),
			0,
			1,
			p.height * 0.2,
			p.height * 0.7,
		)
	}

	p.draw = (): void => {
		if (!ready || !blocks) return

		const shift = (p.millis() / 1000) * p.width * 0.03
		p.image(blocks, 0, 0)
		p.noStroke()
		const bands = 3
		for (const ribbon of ribbons) {
			for (let s = 0; s < bands; s++) {
				const t0 = s / bands
				const t1 = (s + 1) / bands
				p.fill(p.lerpColor(ribbon.top, ribbon.bottom, (t0 + t1) / 2))
				p.beginShape()
				for (const x of samples) {
					const top = ridge(x, ribbon.y1, shift) + ribbon.y1
					const bottom = ridge(x, ribbon.y2, shift) + ribbon.y2
					p.vertex(x, p.lerp(top, bottom, t0))
				}
				for (let i = samples.length - 1; i >= 0; i--) {
					const x = samples[i]
					const top = ridge(x, ribbon.y1, shift) + ribbon.y1
					const bottom = ridge(x, ribbon.y2, shift) + ribbon.y2
					p.vertex(x, p.lerp(top, bottom, t1))
				}
				p.endShape(p.CLOSE)
			}
		}
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			build()
		},
		algorithmName: "montainsMotion",
	})
}

new p5(sketch)
