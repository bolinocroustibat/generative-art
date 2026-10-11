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

	p.draw = (): void => {
		// This is intentionally empty as we're using generate() for drawing
	}

	const generate = (): void => {
		p.randomSeed(seed)
		p.background(0)
		p.noStroke()

		// Reset the coordinate system - Processing uses top-left as origin, WEBGL uses center
		p.translate(-p.width / 2, -p.height / 2, 0)

		const centerX = p.width / 2
		const centerY = p.height / 2
		const maxRadius = p.min(p.width, p.height) * 0.4
		const numLayers = p.floor(p.random(8, 12))
		const shapesPerLayer = p.floor(p.random(6, 12))

		// Create central focal point
		const centralSize = maxRadius * 0.15
		p.fill(rcol())
		p.circle(centerX, centerY, centralSize)

		// Generate radial pattern
		for (let layer = 0; layer < numLayers; layer++) {
			const layerRadius = (maxRadius * (layer + 1)) / numLayers
			const layerSize = centralSize * (1 - layer / numLayers) * 0.8

			for (let i = 0; i < shapesPerLayer; i++) {
				const angle = (p.TWO_PI * i) / shapesPerLayer
				const x = centerX + p.cos(angle) * layerRadius
				const y = centerY + p.sin(angle) * layerRadius

				// Add some randomness to position
				const jitter = layerRadius * 0.1
				const jitterX = p.random(-jitter, jitter)
				const jitterY = p.random(-jitter, jitter)

				// Create shape with connecting lines
				p.fill(rcol())
				p.circle(x + jitterX, y + jitterY, layerSize)

				// Add connecting lines with gradient
				p.stroke(255, 20)
				p.strokeWeight(1)
				p.line(centerX, centerY, x + jitterX, y + jitterY)
				p.noStroke()

				// Add inner details
				const innerSize = layerSize * 0.6
				p.fill(rcol())
				p.circle(x + jitterX, y + jitterY, innerSize)

				// Add outer ring
				const outerSize = layerSize * 1.2
				p.noFill()
				p.stroke(255, 10)
				p.strokeWeight(0.5)
				p.circle(x + jitterX, y + jitterY, outerSize)
				p.noStroke()
			}
		}

		// Add some floating elements
		const numFloaters = p.floor(p.random(20, 30))
		for (let i = 0; i < numFloaters; i++) {
			const angle = p.random(p.TWO_PI)
			const distance = p.random(maxRadius * 0.3, maxRadius * 1.2)
			const x = centerX + p.cos(angle) * distance
			const y = centerY + p.sin(angle) * distance
			const size = p.random(5, 15)

			p.fill(255, p.random(20, 40))
			p.circle(x, y, size)
		}
	}

	// Color utility functions
	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const getColor = (v?: number): p5.Color => {
		if (v === undefined) {
			return getColor(p.random(colors.length))
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
		algorithmName: "III/radial",
	})
}

// Create a new p5 instance with the sketch
new p5(sketch) 