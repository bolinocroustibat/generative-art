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

	// Set up keyboard controls for interaction
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "order",
	})

	const generate = () => {
		// Set up the scene
		p.background(getRandomColor(p, colors))
		p.randomSeed(seed)

		// Configure lighting for 3D rendering
		p.ambientLight(240, 240, 240)
		p.directionalLight(20, 20, 20, 0, 1, 0)  // Top light
		p.directionalLight(10, 10, 20, -1, 0, 0) // Side light
		p.noStroke()

		// Set up orthographic camera projection for isometric-style view
		const zoom = 1.2
		p.ortho(
			(-p.width / 2) * zoom,    // left
			(p.width / 2) * zoom,     // right
			(-p.height / 2) * zoom,   // bottom
			(p.height / 2) * zoom,    // top
			0,                        // near clipping plane
			p.max(p.width, p.height) * 4  // far clipping plane
		)

		// Position and orient the camera
		const cameraDistance = p.max(p.width, p.height) * 1.5
		p.translate(0, -p.height * 0.25, -cameraDistance)
		
		// Rotate the scene for isometric perspective
		p.rotateX(p.HALF_PI - p.atan(1 / p.sqrt(2)))
		p.rotateZ(-p.HALF_PI * p.random(0.5))

		// Initialize rectangle subdivision system
		const rects: p5.Vector[] = []
		const initialSize = p.max(p.width, p.height) * 1.5
		// Initial rectangle: x, y position and size (z)
		rects.push(p.createVector(-initialSize, -initialSize, initialSize * 2))

		// Recursive subdivision of rectangles
		for (let i = 0; i < 100; i++) {
			const ind = p.floor(p.random(rects.length))
			const r = rects[ind]
			const ms = r.z * 0.5  // New subdivision size

			// Stop subdividing if rectangles become too small
			if (ms < p.max(p.width, p.height) * 0.1) continue

			// Create four new smaller rectangles
			rects.push(p.createVector(r.x, r.y, ms))           // Top-left
			rects.push(p.createVector(r.x + ms, r.y, ms))      // Top-right
			rects.push(p.createVector(r.x + ms, r.y + ms, ms)) // Bottom-right
			rects.push(p.createVector(r.x, r.y + ms, ms))      // Bottom-left
			rects.splice(ind, 1)  // Remove the subdivided rectangle
		}

		// Draw the generated rectangles with 3D elements
		for (let i = 0; i < rects.length; i++) {
			const r = rects[i]

			p.push()
			p.translate(r.x, r.y)

			// Randomly decide whether to add 3D elements
			const rnd = p.floor(p.random(1))
			if (rnd === 0) {
				// Create a series of bars within each rectangle
				const sub = p.floor(p.random(3, 13))  // Number of subdivisions
				const sss = r.z / sub                 // Size of each subdivision
				const hh = sss * p.random(0.1, 2.5)   // Height of bars
				const dd = sss * p.random(0.1, 0.8)   // Depth of bars
				const hor = p.random(1) < 0.5         // Horizontal or vertical orientation

				// Generate bars with varying heights and colors
				for (let j = 0; j < sub; j++) {
					const col = getRandomColor(p, colors)
					p.push()

					if (hor) {
						// Draw horizontal bars
						p.push()
						const hhh = hh * p.random(1)
						p.translate((j + 0.5) * sss, r.z * 0.5, hhh * 0.5)
						p.noStroke()
						p.fill(col)
						p.box(dd, r.z, hhh)  // Solid bar
						p.pop()

						p.push()
						p.translate((j + 0.5) * sss, r.z * 0.5, hh * 0.5)
						p.stroke(col)
						p.noFill()
						p.box(dd, r.z, hh)   // Wireframe bar
						p.pop()
					} else {
						// Draw vertical bars
						const hhh = hh * p.random(1)
						p.push()
						p.translate(r.z * 0.5, (j + 0.5) * sss, hhh * 0.5)
						p.noStroke()
						p.fill(col)
						p.box(r.z, dd, hhh)  // Solid bar
						p.pop()

						p.push()
						p.translate(r.z * 0.5, (j + 0.5) * sss, hh * 0.5)
						p.stroke(col)
						p.noFill()
						p.box(r.z, dd, hh)   // Wireframe bar
						p.pop()
					}

					p.pop()
				}
			}
			p.pop()
		}
	}
}

// Initialize the p5.js sketch
new p5(sketch)
