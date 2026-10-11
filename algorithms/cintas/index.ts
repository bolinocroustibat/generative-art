import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

type Point = {
	x: number
	y: number
}

type Ribbon = {
	points: Point[]
	color: p5.Color
	thickness: number
}

const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let ribbons: Ribbon[] = []
	let tiltX = 0
	let tiltY = 0

	p.setup = async (): Promise<void> => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.WEBGL)
		p.smooth()
		p.pixelDensity(2)
		seed = p.floor(p.random(999999))
		colors = await getColorPalette()
		generate()
	}

	p.draw = (): void => {}

	const generate = (): void => {
		p.randomSeed(seed)
		p.noiseSeed(seed)
		p.noiseDetail(1)
		const built = buildRibbons()
		ribbons = built.ribbons
		tiltX = built.tiltX
		tiltY = built.tiltY
		paint(tiltX, tiltY)
	}

	const buildRibbons = (): {
		ribbons: Ribbon[]
		tiltX: number
		tiltY: number
	} => {
		const tiltX = p.random(-1.2, 1.2)
		const tiltY = p.random(-1.2, 1.2)
		const unit = p.min(p.width, p.height) / 960
		const vel = 5 * unit
		const thickness = 100 * unit
		const det = (p.random(0.001, 0.02) * p.random(1)) / unit
		const next: Ribbon[] = []

		for (let i = 0; i < 10; i++) {
			const ang = p.random(p.TWO_PI)
			const des = p.random(100)
			const forward: Point[] = []
			let x = 0
			let y = 0
			for (let j = 0; j < 1000; j++) {
				const a = p.noise(des + x * det, des + y * det) * p.TWO_PI - ang
				forward.push({ x, y })
				x += p.cos(a) * vel
				y += p.sin(a) * vel
			}
			forward.reverse()

			x = 0
			y = 0
			for (let j = 0; j < 1000; j++) {
				const a = p.noise(des + x * det, des + y * det) * p.TWO_PI - ang
				forward.push({ x, y })
				x -= p.cos(a) * vel
				y -= p.sin(a) * vel
			}

			next.push({ points: forward, color: rcol(), thickness })
		}

		return {
			ribbons: next,
			tiltX,
			tiltY,
		}
	}

	const paint = (rx: number, ry: number): void => {
		p.background("#181818")
		p.ortho(
			-p.width / 2,
			p.width / 2,
			-p.height / 2,
			p.height / 2,
			-p.max(p.width, p.height) * 4,
			p.max(p.width, p.height) * 8,
		)
		p.rotateX(rx)
		p.rotateY(ry)
		p.noStroke()
		const gl = p.drawingContext as WebGLRenderingContext
		gl.disable(gl.CULL_FACE)

		for (const ribbon of ribbons) {
			p.fill(ribbon.color)
			p.beginShape(p.TRIANGLE_STRIP)
			for (const pt of ribbon.points) {
				p.vertex(pt.x, pt.y, 0)
				p.vertex(pt.x, pt.y, ribbon.thickness)
			}
			p.endShape()
		}
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "cintas",
	})
}

new p5(sketch)
