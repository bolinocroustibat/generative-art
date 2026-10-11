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
}

const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []

	p.setup = async (): Promise<void> => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.P2D)
		p.smooth()
		p.pixelDensity(2)
		seed = p.floor(p.random(999999))
		colors = await getColorPalette()
		generate()
	}

	p.draw = (): void => {}

	const generate = (): void => {
		const back = rcol()
		p.randomSeed(seed)
		p.background(back)
		p.stroke(0)
		p.strokeWeight(p.width / 960)

		const rings: Ring[] = []
		for (let i = 0; i < 1000; i++) {
			rings.push({
				x: p.random(p.width),
				y: p.random(p.height),
				a: p.random(p.TWO_PI),
				s: p.width * p.random(0.6) * p.random(0.1, 1),
				amp: p.random(0.7, 0.9),
				color: rcol(),
			})
		}

		for (const ring of rings) {
			for (let yy = -1; yy <= 1; yy++) {
				for (let xx = -1; xx <= 1; xx++) {
					drawRing(ring, xx * p.width, yy * p.height)
				}
			}
		}
	}

	const drawRing = (ring: Ring, ox: number, oy: number): void => {
		const da = p.TWO_PI / 3
		const r = ring.s * 0.5
		p.fill(ring.color)
		for (let i = 0; i < 3; i++) {
			const a0 = ring.a + da * i
			const a1 = ring.a + da * ((i + 1) % 3)
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

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "rayos",
	})
}

new p5(sketch)
