import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

type Ring = {
	x: number
	y: number
	a: number
	s: number
	amp: number
	color: p5.Color
	spin: number
}

// Moving version of rayos: the same triangle rings, turning in place
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let ready = false
	let backgroundColor: p5.Color
	let rings: Ring[] = []

	p.setup = async (): Promise<void> => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.P2D)
		p.smooth()
		p.pixelDensity(1)
		p.frameRate(30)
		seed = p.floor(p.random(999999))
		colors = await getColorPalette()
		build()
	}

	const build = (): void => {
		backgroundColor = rcol()
		p.randomSeed(seed)
		rings = []
		for (let i = 0; i < 1000; i++) {
			rings.push({
				x: p.random(p.width),
				y: p.random(p.height),
				a: p.random(p.TWO_PI),
				s: p.width * p.random(0.6) * p.random(0.1, 1),
				amp: p.random(0.7, 0.9),
				color: rcol(),
				spin: (i % 2 === 0 ? 1 : -1) * (0.15 + (i % 5) * 0.05),
			})
		}
		ready = true
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const drawRing = (
		ring: Ring,
		ox: number,
		oy: number,
		angle: number,
	): void => {
		const da = p.TWO_PI / 3
		const r = ring.s * 0.5
		p.fill(ring.color)
		for (let i = 0; i < 3; i++) {
			const a0 = angle + da * i
			const a1 = angle + da * ((i + 1) % 3)
			p.beginShape()
			p.vertex(ox + ring.x + p.cos(a0) * r, oy + ring.y + p.sin(a0) * r)
			p.vertex(ox + ring.x + p.cos(a1) * r, oy + ring.y + p.sin(a1) * r)
			p.vertex(
				ox + ring.x + p.cos(a1) * r * ring.amp,
				oy + ring.y + p.sin(a1) * r * ring.amp,
			)
			p.vertex(
				ox + ring.x + p.cos(a0) * r * ring.amp,
				oy + ring.y + p.sin(a0) * r * ring.amp,
			)
			p.endShape(p.CLOSE)
		}
	}

	p.draw = (): void => {
		if (!ready) return
		const time = p.millis() / 1000
		p.background(backgroundColor)
		p.stroke(0)
		p.strokeWeight(p.width / 960)
		for (const ring of rings) {
			const angle = ring.a + time * ring.spin
			for (let yy = -1; yy <= 1; yy++) {
				for (let xx = -1; xx <= 1; xx++) {
					drawRing(ring, xx * p.width, yy * p.height, angle)
				}
			}
		}
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			build()
		},
		algorithmName: "rayosMotion",
	})
}

new p5(sketch)
