import p5 from "p5"
import { getColorPalette, getCanvasDimensions, setupKeyboardControls } from "../../helpers/index.ts"

// Create a p5.js sketch in instance mode
const sketch = (p: p5) => {
	let seed: number
	const colors: string[] = getColorPalette()

	p.setup = (): void => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height)
		p.smooth()
		p.pixelDensity(2)
		seed = p.floor(p.random(999999)) // Initialize seed
		generate()
	}

	p.draw = (): void => {
		// This is intentionally empty as we're using generate() for drawing
	}

	const generate = (): void => {
		p.randomSeed(seed)
		p.background(rcol())
		p.background(0)

		// Create rects array (using p5.Vector)
		const rects: p5.Vector[] = []
		rects.push(p.createVector(0, 0, p.width))

		const sub = p.floor(p.random(1, 8))
		for (let i = 0; i < sub; i++) {
			const ind = p.floor(p.random(rects.length * p.random(1)))
			const r = rects[ind]
			const div = p.floor(p.random(2, 6))
			const ss = r.z * 1.0 / div
			
			for (let y = 0; y < div; y++) {
				for (let x = 0; x < div; x++) {
					rects.push(p.createVector(r.x + x * ss, r.y + y * ss, ss))
				}
			}
			
			rects.splice(ind, 1)
		}

		p.noStroke()
		for (let i = 0; i < rects.length; i++) {
			const r = rects[i]
			const x = r.x
			const y = r.y
			const s = r.z
			const col = getColor()
			
			if (p.random(1) < 0.5) {
				p.beginShape()
				p.fill(p.lerpColor(col, getColor(), p.random(0.5)))
				p.vertex(x, y)
				p.vertex(x + s, y)
				p.fill(p.lerpColor(col, getColor(), p.random(0.5)))
				p.vertex(x + s, y + s)
				p.vertex(x, y + s)
				p.endShape(p.CLOSE)
			} else {
				p.beginShape()
				p.fill(p.lerpColor(col, getColor(), p.random(0.5)))
				p.vertex(x, y + s)
				p.vertex(x, y)
				p.fill(p.lerpColor(col, getColor(), p.random(0.5)))
				p.vertex(x + s, y)
				p.vertex(x + s, y + s)
				p.endShape(p.CLOSE)
			}
			
			// Original comment: //rect(x, y, r.z, r.z);
			const div = p.floor(p.random(2, 16))
			const ss = r.z / div
			
			for (let jj = 0; jj < div; jj++) {
				for (let ii = 0; ii < div; ii++) {
					const xx = x + ii * ss
					const yy = y + jj * ss
					p.fill(getColor(undefined, 90))
					p.rect(xx, yy, ss, ss)
				}
			}
		}
	}

	// Color utility functions
	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const getColor = (v?: number, alpha?: number): p5.Color => {
		if (v === undefined) {
			v = p.random(colors.length)
		}
		
		const value = p.abs(v)
		const normalizedValue = value % colors.length
		const c1 = p.color(colors[p.floor(normalizedValue % colors.length)])
		const c2 = p.color(colors[p.floor((normalizedValue + 1) % colors.length)])
		const result = p.lerpColor(c1, c2, normalizedValue % 1)
		
		if (alpha !== undefined) {
			result.setAlpha(alpha)
		}
		
		return result
	}

	// Set up keyboard controls
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "arabe"
	})
}

// Create a new p5 instance with the sketch
new p5(sketch)
