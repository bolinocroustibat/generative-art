import p5 from "p5"
import { colorPalettes } from "../../data/colorsPalettes.ts"
import { getCanvasDimensions } from "../../helpers/canvasDimensions.ts"
import { setupKeyboardControls } from "../../helpers/keyboardControls.ts"

// Create a p5.js sketch in instance mode
const sketch = (p: p5) => {
	let seed: number
	const colors: string[] = colorPalettes.circo

	p.setup = (): void => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.WEBGL)
		p.smooth(8)
		p.pixelDensity(2)
		p.rectMode(p.CENTER)
		seed = p.floor(p.random(999999)) // Initialize seed
		generate()
	}

	p.draw = (): void => {
		// This is intentionally empty as we're using generate() for drawing
		// Original comment: //if (frameCount%30 == 0) generate();
	}

	const generate = (): void => {
		p.randomSeed(seed)
		p.background(10) // Original comment: //getColor(random(colors.length)));

		const fov = p.PI / p.random(1.01, p.random(1, 2.6))
		const cameraZ = (p.height / 2.0) / p.tan(fov / 2.0)
		p.perspective(fov, p.width / p.height, cameraZ / 100.0, cameraZ * 100.0)
		p.translate(p.width / 2, p.height / 2, 0)

		const hh = p.width * p.random(3, 6)
		const radius = p.width * p.random(1.0, 1.8)
		const hr = 128
		const res = 128
		const da = p.TWO_PI / res

		// Original comment: //for (int k = 0; k < 3; k++) {
		p.rotateZ(p.random(p.TWO_PI))
		p.rotateX(p.random(p.TWO_PI))
		p.rotateY(p.random(p.TWO_PI))

		// Create a list to store height segments
		const hs: number[] = []
		hs.push(hr * 2)
		
		const div = p.floor(p.random(80))
		for (let i = 0; i < div; i++) {
			const ind = p.floor(p.random(hs.length * p.random(1)))
			const val = hs[ind] / 2
			if (val >= 1) {
				hs.splice(ind, 1)
				hs.push(val)
				hs.push(val)
			}
		}

		p.stroke(255, 10)
		// Original comment: //noStroke();
		let h1 = -hr / 2
		
		for (let j = 0; j < hs.length; j++) {
			const h2 = h1 + hs[j]
			const ic = p.random(colors.length)
			let dc = 3 + (colors.length * 1.0 / res) * p.floor(p.random(7)) // Original comment: //random(100)*random(1)*random(1);
			
			if (p.random(1) < 0.5) {
				// Original comment: //dc = 3+random(0.03);
			}
			
			for (let i = 0; i < res; i++) {
				const x1 = p.cos(da * i) * radius
				const y1 = p.sin(da * i) * radius
				const x2 = p.cos(da * i + da) * radius
				const y2 = p.sin(da * i + da) * radius
				const hh1 = hh * p.map(h1, 0, hr, -0.5, 0.5)
				const hh2 = hh * p.map(h2, 0, hr, -0.5, 0.5)

				// Original comment: //fill(getColor(random(colors.length)));
				p.noStroke()
				p.fill(getColor(dc * i + ic))
				p.beginShape()
				p.vertex(x1, y1, hh1)
				p.vertex(x1, y1, hh2)
				p.vertex(x2, y2, hh2)
				p.vertex(x2, y2, hh1)
				p.endShape(p.CLOSE)

				let s1 = 0
				let s2 = 20
				if (i % 2 === 0) {
					s1 = s2
					s2 = 0
				}
				
				p.stroke(255, 40)
				p.beginShape()
				p.fill(0, s1)
				p.vertex(x2, y2, hh1)
				p.vertex(x1, y1, hh1)
				p.fill(0, s2)
				p.vertex(x1, y1, hh2)
				p.vertex(x2, y2, hh2)
				p.endShape(p.CLOSE)
			}
			h1 = h2
		}
		// Original comment: //}
	}

	// Color utility functions
	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const getColor = (v: number): p5.Color => {
		const normalizedValue = v % colors.length
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
		algorithmName: "circo"
	})
}

// Create a new p5 instance with the sketch
new p5(sketch) 