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
	speed: number
}

// Moving version of cintas: the same ribbons, tumbling, with a light running along them
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let ready = false
	let ribbons: Ribbon[] = []
	let tiltX = 0
	let tiltY = 0

	p.setup = async (): Promise<void> => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.WEBGL)
		p.smooth()
		p.pixelDensity(1)
		p.frameRate(30)
		seed = p.floor(p.random(999999))
		colors = await getColorPalette()
		build()
	}

	const build = (): void => {
		ready = false
		p.randomSeed(seed)
		p.noiseSeed(seed)
		p.noiseDetail(1)

		tiltX = p.random(-1.2, 1.2)
		tiltY = p.random(-1.2, 1.2)
		const unit = p.min(p.width, p.height) / 960
		const vel = 5 * unit
		const thickness = 100 * unit
		const det = (p.random(0.001, 0.02) * p.random(1)) / unit
		const next: Ribbon[] = []

		for (let i = 0; i < 10; i++) {
			const ang = p.random(p.TWO_PI)
			const des = p.random(100)
			const points: Point[] = []
			let x = 0
			let y = 0
			for (let j = 0; j < 1000; j++) {
				const a = p.noise(des + x * det, des + y * det) * p.TWO_PI - ang
				points.push({ x, y })
				x += p.cos(a) * vel
				y += p.sin(a) * vel
			}
			points.reverse()

			x = 0
			y = 0
			for (let j = 0; j < 1000; j++) {
				const a = p.noise(des + x * det, des + y * det) * p.TWO_PI - ang
				points.push({ x, y })
				x -= p.cos(a) * vel
				y -= p.sin(a) * vel
			}

			next.push({
				points,
				color: rcol(),
				thickness,
				speed: 40 + i * 8,
			})
		}

		ribbons = next
		ready = true
	}

	const strip = (
		points: Point[],
		from: number,
		to: number,
		z0: number,
		z1: number,
	): void => {
		p.beginShape(p.TRIANGLE_STRIP)
		for (let i = from; i < to; i++) {
			const pt = points[i]
			if (!pt) continue
			p.vertex(pt.x, pt.y, z0)
			p.vertex(pt.x, pt.y, z1)
		}
		p.endShape()
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	p.draw = (): void => {
		if (!ready) return
		const time = p.millis() / 1000
		p.background("#181818")
		p.ortho(
			-p.width / 2,
			p.width / 2,
			-p.height / 2,
			p.height / 2,
			-p.max(p.width, p.height) * 4,
			p.max(p.width, p.height) * 8,
		)
		p.rotateX(tiltX + Math.sin(time * 0.35) * 0.28)
		p.rotateY(tiltY + Math.sin(time * 0.22) * 0.45)
		p.noStroke()
		const gl = p.drawingContext as WebGLRenderingContext
		gl.disable(gl.CULL_FACE)

		for (const ribbon of ribbons) {
			const count = ribbon.points.length
			p.fill(ribbon.color)
			strip(ribbon.points, 0, count, 0, ribbon.thickness)

			const window = 140
			const span = Math.max(1, count - window)
			const cycle = (time * ribbon.speed) % (span * 2)
			const start = Math.floor(cycle < span ? cycle : span * 2 - cycle)
			p.fill(p.lerpColor(ribbon.color, p.color(255), 0.55))
			strip(
				ribbon.points,
				start,
				Math.min(count, start + window),
				-2,
				ribbon.thickness + 2,
			)
		}
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			build()
		},
		algorithmName: "cintasMotion",
	})
}

new p5(sketch)
