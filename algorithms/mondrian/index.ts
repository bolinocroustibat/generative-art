import p5 from "p5"
import { getColorPalette, getCanvasDimensions, setupKeyboardControls } from "../../helpers/index.ts"

// Create a p5.js sketch in instance mode
const sketch = (p: p5) => {
	let seed: number
	let weightedColors: { value: p5.Color; weight: number }[]
	const colors: string[] = getColorPalette()

	p.setup = (): void => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height)
		p.noLoop()
		seed = p.floor(p.random(999999)) // Initialize seed
		generate()
	}

	p.draw = (): void => {
		// This is intentionally empty as we're using generate() for drawing
		// and only calling redraw() to trigger it
	}

	const generate = (): void => {
		p.background(0, 255, 255)
		p.randomSeed(seed)

		// Create weighted colors from the imported palette
		weightedColors = [
			{ value: p.color(colors[0]), weight: 3 }, // White with higher weight
			{ value: p.color(colors[1]), weight: 1 }, // Red
			{ value: p.color(colors[2]), weight: 1 }, // Blue
			{ value: p.color(colors[3]), weight: 1 }, // Yellow
		]

		const strokeWidth = 10

		const canvasWidth = p.width
		const canvasHeight = p.height
		const rectWidths = [
			canvasWidth / 8,
			canvasWidth / 4,
			(canvasWidth / 4) * 3,
			canvasWidth / 2,
		]
		const rectHeights = [
			canvasHeight / 8,
			canvasHeight / 4,
			(canvasHeight / 4) * 3,
			canvasHeight / 2,
		]

		let y = 0
		let x = 0

		while (y < canvasHeight) {
			x = 0
			let rectHeight = p.random(rectHeights)
			while (rectHeight + y === p.height) {
				// we want the rectangle height to be BIGGER than the lasting canvas, in order to cut off the last rectangle
				rectHeight = p.random(rectHeights)
			}
			while (x < canvasWidth) {
				let rectWidth = p.random(rectWidths)
				while (rectWidth + x === p.width) {
					// we want the rectangle width to be BIGGER than the lasting canvas, in order to cut off the last rectangle
					rectWidth = p.random(rectWidths)
				}
				rectangle(x, y, rectWidth, rectHeight, strokeWidth, weightedColors)
				x = x + rectWidth
			}
			y = y + rectHeight
		}
	}

	const rectangle = (
		x: number,
		y: number,
		width: number,
		height: number,
		strokeWidth: number,
		weightedColors: { value: p5.Color; weight: number }[],
	): void => {
		p.stroke("black")
		p.strokeWeight(strokeWidth)
		p.fill(pickRandomWeightedItem(weightedColors))
		p.rect(x - strokeWidth / 2, y - strokeWidth / 2, width, height)
	}

	const pickRandomWeightedItem = (
		weightedColors: { value: p5.Color; weight: number }[],
	): p5.Color => {
		const allItems: p5.Color[] = []
		for (let i = 0; i < weightedColors.length; i++) {
			for (let j = 0; j < weightedColors[i].weight; j++) {
				allItems.push(weightedColors[i].value)
			}
		}
		return p.random(allItems)
	}

	// Set up keyboard controls
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
	})
}

// Create a new p5 instance with the sketch
new p5(sketch)
