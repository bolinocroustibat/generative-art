import p5 from "p5"
import { colorPalettes } from "../data/colors_palettes.ts"
import { setupKeyboardControls } from "../helpers/keyboardControls.ts"

// Create a p5.js sketch in instance mode
const sketch = (p: p5) => {
	let seed: number
	let rects: p5.Vector[] = []
	let colors: string[] // Variable to store the color palette

	p.setup = (): void => {
		p.createCanvas(960, 960, p.WEBGL)
		p.smooth(16)
		p.pixelDensity(2)
		// Initialize the colors from the imported palette
		colors = colorPalettes.royalTenenbaums
		seed = p.floor(p.random(999999)) // Initialize seed
		generate()
	}

	p.draw = (): void => {
		// if (frameCount % 60 == 0) generate();
		// generate();
	}

	const generate = (): void => {
		p.background(0)
		p.randomSeed(seed)

		const fov = p.PI / p.random(1.4, 4)
		const cameraZ = p.height / 2.0 / p.tan(fov / 2.0)
		p.perspective(fov, p.width / p.height, cameraZ / 100.0, cameraZ * 100.0)

		p.translate(p.width / 2, p.height / 2, -900)
		const ma = p.PI * 0.3
		p.rotateX(p.random(-ma, ma))
		p.rotateY(p.random(-ma, ma))
		p.rotateZ(p.random(-ma, ma))

		const size = 5
		rects = []
		rects.push(
			p.createVector(
				-p.width * size * 0.5,
				-p.height * size * 0.5,
				p.width * size,
			),
		)
		const sub = p.floor(p.random(20, 1000))
		for (let i = 0; i < sub; i++) {
			const ind = p.floor(p.random(rects.length * p.random(1)))
			const r = rects[ind]
			const md = r.z * 0.5
			rects.push(p.createVector(r.x, r.y, md))
			rects.push(p.createVector(r.x + md, r.y, md))
			rects.push(p.createVector(r.x + md, r.y + md, md))
			rects.push(p.createVector(r.x, r.y + md, md))
			rects.splice(ind, 1)
		}

		for (let i = 0; i < rects.length; i++) {
			const r = rects[i]
			p.rect(r.x, r.y, r.z, r.z)
			const hh = r.z * 1
			const cx = r.x + r.z * 0.5
			const cy = r.y + r.z * 0.5
			const div = p.floor(p.random(2, 12))

			const xs = [r.x, r.x + r.z, r.x + r.z, r.x]
			const ys = [r.y, r.y, r.y + r.z, r.y + r.z]

			p.fill(100)
			p.stroke(255)

			p.noStroke()
			for (let j = 0; j < div; j++) {
				const v1 = p.map(j, 0, div, 0, 1)
				const v2 = p.map(j + 1, 0, div, 0, 1)

				for (let k = 0; k < 4; k++) {
					const x1 = p.lerp(xs[k], xs[(k + 1) % 4], v1)
					const y1 = p.lerp(ys[k], ys[(k + 1) % 4], v1)
					const x2 = p.lerp(xs[k], xs[(k + 1) % 4], v2)
					const y2 = p.lerp(ys[k], ys[(k + 1) % 4], v2)

					p.beginShape()
					p.fill(getRandomColor())
					p.vertex(cx, cy, hh * 0.5)
					p.fill(getRandomColor())
					p.vertex(x1, y1, hh)
					p.vertex(x2, y2, hh)
					p.endShape()

					p.beginShape()
					p.fill(getRandomColor())
					p.vertex(x1, y1, 0)
					p.vertex(x2, y2, 0)
					p.fill(getRandomColor())
					p.vertex(x2, y2, hh)
					p.vertex(x1, y1, hh)
					p.endShape()
				}
			}
		}
	}

	/**
	 * Returns a random color from the palette
	 */
	const getRandomColor = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	/**
	 * Returns an interpolated color based on a random position in the palette
	 */
	const getInterpolatedRandomColor = (): p5.Color => {
		return getInterpolatedColor(p.random(colors.length))
	}

	/**
	 * Returns an interpolated color between two adjacent colors in the palette
	 * @param {number} position - Position in the color palette (can be fractional)
	 * @returns {p5.Color} Interpolated color
	 */
	const getInterpolatedColor = (position: number): p5.Color => {
		position = p.abs(position)
		position = position % colors.length
		const c1 = colors[p.floor(position % colors.length)]
		const c2 = colors[p.floor((position + 1) % colors.length)]
		return p.lerpColor(p.color(c1), p.color(c2), position % 1)
	}

	// Set up keyboard controls with our custom generate function
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
	})
}

// Create a new p5 instance with the sketch
new p5(sketch)
