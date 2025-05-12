import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let backgroundColor: p5.Color

	p.setup = async (): Promise<void> => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height)
		p.smooth()
		p.pixelDensity(2)
		seed = p.floor(p.random(999999))
		colors = await getColorPalette()
		generate()
	}

	const generate = (): void => {
		p.randomSeed(seed)
		backgroundColor = rcol()
		p.background(backgroundColor)

		const desc = p.random(10000)
		const detc = p.random(0.001, 0.005) // More variation in noise detail
		const particleCount = 100000 // Increased particle count

		// Draw background particles
		p.noStroke()
		for (let i = 0; i < particleCount; i++) {
			const x = p.random(p.width)
			const y = p.random(p.height)
			
			// Use noise to create clusters of points
			const noiseVal = p.noise(x * detc + desc, y * detc + desc)
			
			// Size varies with noise
			const s = p.width * p.map(noiseVal, 0, 1, 0.001, 0.008)
			
			// Color based on noise value
			const col = getColor(noiseVal * colors.length * 4)
			
			// Opacity varies with position and noise
			const alpha = p.map(noiseVal, 0, 1, 20, 180)
			p.fill(p.red(col), p.green(col), p.blue(col), alpha)
			
			p.ellipse(x, y, s, s)
		}
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const getColor = (v: number): p5.Color => {
		const value = Math.abs(v)
		const normalizedValue = value % colors.length
		const c1 = p.color(colors[p.floor(normalizedValue % colors.length)])
		const c2 = p.color(colors[p.floor((normalizedValue + 1) % colors.length)])
		return p.lerpColor(c1, c2, normalizedValue % 1)
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "nippon-flower/variation1",
	})
}

new p5(sketch)
