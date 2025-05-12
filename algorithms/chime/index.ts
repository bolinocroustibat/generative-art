import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

// Create a p5.js sketch in instance mode
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []

	p.setup = async (): Promise<void> => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.WEBGL)
		p.smooth()
		p.pixelDensity(2)
		seed = p.floor(p.random(999999)) // Initialize seed
		colors = await getColorPalette()
		generate()
	}

	const generate = (): void => {
		p.randomSeed(seed)
		p.noiseSeed(seed)
		p.background(getColor(p.random(10)))

		const fov = p.PI / p.random(2.2, 3.0)
		const cameraZ = p.height / 2.0 / p.tan(fov / 2.0)
		p.perspective(fov, p.width / p.height, cameraZ / 10.0, cameraZ * 10.0)

		p.translate(p.width * 0.5, p.height * 0.5)
		p.rotateX(p.random(p.TAU))
		p.rotateY(p.random(p.TAU))
		p.rotateZ(p.random(p.TAU))

		const size = 500

		p.stroke(0, 20)
		p.strokeWeight(0.5)

		p.scale(1.2)

		for (let i = 0; i < 1200; i++) {
			p.push()
			p.rotateX((p.TAU / 8) * p.floor(p.random(8)))
			p.rotateY((p.TAU / 8) * p.floor(p.random(8)))
			p.rotateZ((p.TAU / 8) * p.floor(p.random(8)))
			p.translate(
				p.random(-size, size),
				p.random(-size, size),
				p.random(-size, size),
			)
			const w = p.random(200) * p.random(0.4, 1)
			const h = p.random(80) * p.random(0.4, 1)
			const d = p.random(2)
			p.fill(getColor())
			boxGrid(w, h, d, 1, 1, 1, 1) // Original comment: int(random(4, 19)), int(random(4, 19)), 1, 0.2
			p.pop()
		}
	}

	const boxGrid = (
		w: number,
		h: number,
		d: number,
		cw: number,
		ch: number,
		cd: number,
		bb: number,
	): void => {
		const sw = (w * 1.0) / cw
		const sh = (h * 1.0) / ch
		const sd = (d * 1.0) / cd
		const det = p.random(0.01)
		const des = p.random(1000)
		p.fill(getColor())

		for (let k = 0; k < cd; k++) {
			for (let j = 0; j < ch; j++) {
				for (let i = 0; i < cw; i++) {
					p.push()
					const dx = -w * 0.5 + (i + 0.5) * sw
					const dy = -h * 0.5 + (j + 0.5) * sh
					const dz = -d * 0.5 + (k + 0.5) * sd
					p.translate(dx, dy, dz)
					// Original comment: fill(getColor(noise(des+dx*det, des+dy*det)*colors.length));
					p.box(sw - bb, sh - bb, sd - bb)
					p.pop()
				}
			}
		}
	}

	// Color utility functions
	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const getColor = (v?: number): p5.Color => {
		if (v === undefined) {
			v = p.random(colors.length)
		}
		const value = p.abs(v)
		const normalizedValue = value % colors.length
		const c1 = p.color(colors[p.floor(normalizedValue % colors.length)])
		const c2 = p.color(colors[p.floor((normalizedValue + 1) % colors.length)])
		return p.lerpColor(c1, c2, normalizedValue % 1)
	}

	// Set up keyboard controls
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "chime",
	})
}

// Create a new p5 instance with the sketch
new p5(sketch)
