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
		p.background(20)

		// Reset the coordinate system - Processing uses top-left as origin, WEBGL uses center
		p.translate(-p.width / 2, -p.height / 2, 0)

		const ss = 40
		/* Original grid code commented out
		stroke(30);
		strokeWeight(1);
		for (int i = 0; i <= width; i+=ss) {
			line(i, 0, i, height);
			line(0, i, width, i);
		}
		
		stroke(20);
		fill(30);
		strokeWeight(2);
		rectMode(CENTER);
		for (int j = 0; j <= height; j+=ss) {
			for (int i = 0; i <= width; i+=ss) {
				rect(i, j, 4, 4);
			}
		}
		*/

		p.fill("#C6AD6C")
		p.lights()
		p.noStroke()

		p.specularMaterial("#C6AD6C")
		p.shininess(10.0)
		//circles(width/2, height/2, width*random(0.1, 0.4), int(random(8, 361)));

		const ccc = p.floor(p.random(3, 9))
		for (let j = 0; j < 20; j++) {
			const cc = ccc * p.floor(p.random(1, 5))
			const r = p.width * p.random(0.4)
			const da = p.TWO_PI / cc
			const cx = p.width / 2
			const cy = p.height / 2
			const c = p.floor(p.random(8, 220))
			const s2 = r * p.random(0.8)

			const rnd = p.floor(p.random(2))

			if (rnd === 0) {
				for (let i = 0; i < cc; i++) {
					const ang = p.PI * 1.5 + da * i
					const x = cx + p.cos(ang) * r
					const y = cy + p.sin(ang) * r
					circles(x, y, s2, c)
				}
			}
			if (rnd === 1) {
				const ss1 = s2 * p.random(1)
				const ss2 = s2 * p.random(1)
				for (let i = 0; i < cc; i++) {
					const ang = p.PI * 1.5 + da * i
					const x = cx + p.cos(ang) * r
					const y = cy + p.sin(ang) * r
					p.push()
					p.translate(x, y)
					p.rotateZ(ang)
					crystal(ss1, ss2)
					p.pop()
				}
			}
		}
	}

	const crystal = (w: number, h: number): void => {
		const mw = w * 0.5
		const mh = h * 0.5
		const d = 10 // max(w, h)*0.6;

		// Front face
		p.beginShape()
		p.vertex(-mw, 0, 0)
		p.vertex(0, -mh, 0)
		p.vertex(0, 0, d)
		p.endShape(p.CLOSE)

		// Right face
		p.beginShape()
		p.vertex(+mw, 0, 0)
		p.vertex(0, -mh, 0)
		p.vertex(0, 0, d)
		p.endShape(p.CLOSE)

		// Back face
		p.beginShape()
		p.vertex(+mw, 0, 0)
		p.vertex(0, +mh, 0)
		p.vertex(0, 0, d)
		p.endShape(p.CLOSE)

		// Left face
		p.beginShape()
		p.vertex(-mw, 0, 0)
		p.vertex(0, +mh, 0)
		p.vertex(0, 0, d)
		p.endShape(p.CLOSE)
	}

	const circles = (x: number, y: number, s: number, c: number): void => {
		const r = s * 0.5
		const da = p.TWO_PI / c
		const size = (p.PI * r) / c
		for (let i = 0; i < c; i++) {
			const ang = da * i
			p.push()
			p.translate(x + p.cos(ang) * r, y + p.sin(ang) * r)
			p.sphere(size)
			p.pop()
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
		algorithmName: "golden",
	})
}

// Create a new p5 instance with the sketch
new p5(sketch)
