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
		const cc = p.floor(p.random(10, 200))
		const ic = p.random(colors.length)
		const dc = p.random(10) * p.random(1)
		const ss = p.random(50, 260)
		const rot = p.random(-p.PI, p.PI)

		for (let i = 0; i < cc; i++) {
			const s = p.map(i, 0, cc, p.width * 1.5, ss)
			
			p.push()
			p.translate(p.width / 2, p.height / 2)
			p.rotate(p.map(i, 0, cc, rot, 0))
			drawLeaf(x, y, s, getColor(ic + dc * i))
			p.pop()
		}

		// Draw central leaf
		p.push()
		p.translate(p.width / 2, p.height / 2)
		drawLeaf(0, 0, ss, rcol())
		p.pop()
	}

	const drawLeaf = (x: number, y: number, s: number, color: p5.Color): void => {
		p.push()
		p.translate(x, y)
		
		const leafWidth = s * p.random(0.4, 0.6)
		
		// Main leaf shape
		p.fill(color)
		p.beginShape()
		p.vertex(0, -s)  // Tip
		p.bezierVertex(
			-leafWidth, -s * 0.7,  // control point 1
			-leafWidth, s * 0.3,   // control point 2
			0, s                   // bottom point
		)
		p.bezierVertex(
			leafWidth, s * 0.3,    // control point 3
			leafWidth, -s * 0.7,   // control point 4
			0, -s                  // back to tip
		)
		p.endShape()

		// Vein pattern
		p.stroke(p.color(0, 40))
		p.strokeWeight(s * 0.01)
		p.noFill()
		const numVeins = 5
		for(let i = 0; i < numVeins; i++) {
			const t = i / (numVeins - 1)
			const yPos = p.lerp(-s * 0.8, s * 0.8, t)
			const xWidth = leafWidth * 0.8 * p.sin(t * p.PI)
			p.bezier(0, yPos, xWidth * 0.5, yPos, xWidth * 0.8, yPos, xWidth, yPos)
			p.bezier(0, yPos, -xWidth * 0.5, yPos, -xWidth * 0.8, yPos, -xWidth, yPos)
		}
		p.pop()
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
		algorithmName: "eyes001/leaf",
	})
}

new p5(sketch) 