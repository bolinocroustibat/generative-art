import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	getRandomColor,
	setupKeyboardControls,
} from "../../helpers"

let seed: number
let colors: string[]

// Create a p5.js sketch in instance mode
const sketch = (p: p5) => {
	p.setup = async () => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.WEBGL)
		p.smooth()
		p.pixelDensity(2)
		colors = await getColorPalette()
		seed = p.floor(p.random(999999))
		generate()
	}

	p.draw = () => {
		// Empty draw function as in original
	}

	// Set up keyboard controls with our custom generate function
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "order4",
	})

	const generate = () => {
		p.background(getRandomColor(p, colors))
		p.randomSeed(seed)

		// Setup lights and camera
		p.ambientLight(240, 240, 240)
		p.directionalLight(20, 20, 20, 0, 1, 0)
		p.directionalLight(10, 10, 20, -1, 0, 0)
		p.noStroke()

		// Set up orthographic projection with explicit parameters to control the view
		const zoom = 1.2
		p.ortho(
			(-p.width / 2) * zoom, // left
			(p.width / 2) * zoom, // right
			(-p.height / 2) * zoom, // bottom
			(p.height / 2) * zoom, // top
			0, // near
			p.max(p.width, p.height) * 4, // far
		)

		// Scale camera distance with canvas size
		const cameraDistance = p.max(p.width, p.height) * 1.5

		// Move the camera up to compensate for WEBGL's Y-axis direction
		p.translate(0, -p.height * 0.25, -cameraDistance)

		// Rotate to match Processing's view, but adjust for WEBGL's Y-axis
		p.rotateX(p.HALF_PI - p.atan(1 / p.sqrt(2)))
		p.rotateZ(-p.HALF_PI * p.random(0.5))

		// Generate rectangles - adjust for WEBGL's centered origin
		const rects: p5.Vector[] = []
		// Scale initial rectangle size with canvas size
		const initialSize = p.max(p.width, p.height) * 1.5
		rects.push(p.createVector(-initialSize, -initialSize, initialSize * 2))

		for (let i = 0; i < 50; i++) {
			const ind = p.floor(p.random(rects.length))
			const r = rects[ind]
			const ms = r.z * 0.5
			// Increased minimum size threshold
			if (ms < p.max(p.width, p.height) * 0.15) continue

			rects.push(p.createVector(r.x, r.y, ms))
			rects.push(p.createVector(r.x + ms, r.y, ms))
			rects.push(p.createVector(r.x + ms, r.y + ms, ms))
			rects.push(p.createVector(r.x, r.y + ms, ms))
			rects.splice(ind, 1)
		}

		// Draw rectangles
		for (let i = 0; i < rects.length; i++) {
			const r = rects[i]

			p.push()
			p.translate(r.x, r.y)

			const rnd = p.floor(p.random(1))
			if (rnd === 0) {
				const sub = p.floor(p.random(2, 8))
				const sss = r.z / sub

				for (let j = 0; j < sub; j++) {
					// Create 1-3 buildings per subdivision
					const numBuildings = p.floor(p.random(1, 3))
					const spacing = sss / numBuildings

					for (let b = 0; b < numBuildings; b++) {
						const hh = sss * p.random(1.5, 3.0)
						const width = spacing * p.random(0.5, 0.8)
						const depth = sss * p.random(0.4, 0.7)
						const col = getRandomColor(p, colors)
						const hor = p.random(1) < 0.5
						const isCylinder = p.random(1) < 0.2 // 20% chance for cylinder

						p.push()
						const hhh = hh * p.random(0.7, 1.0)

						if (isCylinder) {
							// Cylinders are always upright
							const radius = p.min(width, depth) * 0.5 // Use smaller dimension for radius
							if (hor) {
								p.translate(
									(j + (b + 0.5) / numBuildings) * sss,
									r.z * 0.5,
									hhh * 0.5,
								)
							} else {
								p.translate(
									r.z * 0.5,
									(j + (b + 0.5) / numBuildings) * sss,
									hhh * 0.5,
								)
							}
							p.rotateX(-p.HALF_PI) // Rotate to make cylinder stand upright
							p.noStroke()
							p.fill(col)
							p.cylinder(radius, hhh, 24) // 24 segments for smooth cylinder
						} else {
							if (hor) {
								p.translate(
									(j + (b + 0.5) / numBuildings) * sss,
									r.z * 0.5,
									hhh * 0.5,
								)
								p.rotateX(p.HALF_PI)
								p.noStroke()
								p.fill(col)
								p.box(width, hhh, depth)
							} else {
								p.translate(
									r.z * 0.5,
									(j + (b + 0.5) / numBuildings) * sss,
									hhh * 0.5,
								)
								p.rotateX(p.HALF_PI)
								p.noStroke()
								p.fill(col)
								p.box(depth, hhh, width)
							}
						}
						p.pop()
					}
				}
			}
			p.pop()
		}
	}
}

// Create a new p5 instance with the sketch
new p5(sketch)
