import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []

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
		p.background(rcol())
		p.noStroke()

		const x = 0
		const y = 0
		const screenCount = p.floor(p.random(10, 200))
		const mdx = p.random(0.3, 0.4)    // narrower horizontally
		const mdy = p.random(0.2, 0.3)    // taller vertically
		const ic = p.random(colors.length)
		const dc = p.random(10) * p.random(1)
		const minScreenSize = p.random(50, 260)
		const rot = p.random(-p.PI * 0.1, p.PI * 0.1)  // Reduced rotation range for more upright screens

		for (let i = 0; i < screenCount; i++) {
			const screenSize = p.map(i, 0, screenCount, p.width * 1.5, minScreenSize)
			const mx = screenSize * mdx
			const my = screenSize * mdy

			p.push()
			p.translate(p.width / 2, p.height / 2)
			p.rotate(p.map(i, 0, screenCount, rot, 0))
			p.fill(getColor(ic + dc * i))

			// Draw TV screen shape
			drawCRTScreen(x, y, screenSize, mx, my)
			p.pop()
		}

		// Draw central screen
		p.push()
		p.translate(p.width / 2, p.height / 2)
		drawCenterScreen(0, 0, minScreenSize)
		p.pop()
	}

	const drawCRTScreen = (x: number, y: number, s: number, mx: number, my: number): void => {
		p.beginShape()
		
		// Left side (curved outward)
		p.vertex(x - s * 1.2, y - s * 0.7)
		p.bezierVertex(
			x - s * 1.23, y - s * 0.7,  // control point 1
			x - s * 1.23, y + s * 0.7,  // control point 2
			x - s * 1.2, y + s * 0.7   // end point
		)

		// Bottom left corner
		p.bezierVertex(
			x - s * 1.2, y + s * 0.8,  // control point 1
			x - s * 1.1, y + s * 0.9,  // control point 2
			x - s * 0.9, y + s * 0.9   // end point
		)

		// Bottom side (curved outward)
		p.bezierVertex(
			x - s * 0.9, y + s * 0.93,  // control point 1
			x + s * 0.9, y + s * 0.93,  // control point 2
			x + s * 0.9, y + s * 0.9   // end point
		)

		// Bottom right corner
		p.bezierVertex(
			x + s * 1.1, y + s * 0.9,  // control point 1
			x + s * 1.2, y + s * 0.8,  // control point 2
			x + s * 1.2, y + s * 0.7   // end point
		)

		// Right side (curved outward)
		p.bezierVertex(
			x + s * 1.23, y + s * 0.7,  // control point 1
			x + s * 1.23, y - s * 0.7,  // control point 2
			x + s * 1.2, y - s * 0.7   // end point
		)

		// Top right corner
		p.bezierVertex(
			x + s * 1.2, y - s * 0.8,  // control point 1
			x + s * 1.1, y - s * 0.9,  // control point 2
			x + s * 0.9, y - s * 0.9   // end point
		)

		// Top side (curved outward)
		p.bezierVertex(
			x + s * 0.9, y - s * 0.93,  // control point 1
			x - s * 0.9, y - s * 0.93,  // control point 2
			x - s * 0.9, y - s * 0.9   // end point
		)

		// Top left corner
		p.bezierVertex(
			x - s * 1.1, y - s * 0.9,  // control point 1
			x - s * 1.2, y - s * 0.8,  // control point 2
			x - s * 1.2, y - s * 0.7   // end point
		)

		p.endShape(p.CLOSE)
	}

	const drawCenterScreen = (x: number, y: number, s: number): void => {
		p.fill(p.color("#EADBC6"))
		drawCRTScreen(x, y, s * 0.6, s * 0.3, s * 0.2)  // Reduced size to 60% of original
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const getColor = (v: number): p5.Color => {
		const value = p.abs(v)
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
		algorithmName: "eyes001/crt-screens",
	})
}

new p5(sketch) 