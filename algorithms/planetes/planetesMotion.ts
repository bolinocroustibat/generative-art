import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

type Ring = {
	z: number
	d: number
	color: p5.Color
}

type Planet = {
	x: number
	y: number
	z: number
	rx: number
	ry: number
	rz: number
	spin: number
	rings: Ring[]
}

// Moving version of planetes: the same wire spheres, tumbling as a cloud
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let ready = false
	let planets: Planet[] = []
	let backgroundColor: p5.Color

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
		backgroundColor = p.lerpColor(p.color(240), rcol(), 0.2)
		const span = p.min(p.width, p.height)
		const drafts: { x: number; y: number; z: number; s: number }[] = []
		for (let i = 0; i < 1800; i++) {
			const draft = {
				x: span * p.random(-1, 1),
				y: span * p.random(-1, 1),
				z: span * p.random(-1, 1),
				s: span * p.random(0.8) * p.random(0.5, 1),
			}
			let blocked = false
			for (const other of drafts) {
				const gap = p.dist(draft.x, draft.y, draft.z, other.x, other.y, other.z)
				if (gap < draft.s + other.s) {
					blocked = true
					break
				}
			}
			if (!blocked) drafts.push(draft)
		}

		planets = drafts.map((draft, index) => ({
			x: draft.x,
			y: draft.y,
			z: draft.z,
			rx: p.random(p.TWO_PI),
			ry: p.random(p.TWO_PI),
			rz: p.random(p.TWO_PI),
			spin: (index % 5) - 2,
			rings: lathe(draft.s),
		}))
		ready = true
	}

	const lathe = (size: number): Ring[] => {
		const step = Math.max(4, size / 56)
		const rings: Ring[] = []
		let z = -size * 0.5
		for (let j = 0; j < size; j += step) {
			const diameter = size * p.sin(p.map(j, 0, size, 0, p.PI))
			z += step
			rings.push({ z, d: diameter, color: rcol() })
		}
		return rings
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	p.draw = (): void => {
		if (!ready) return
		const time = p.millis() / 1000
		p.background(backgroundColor)
		const span = p.min(p.width, p.height)
		const zoom = 2.4
		p.ortho(
			(-p.width / 2) * zoom,
			(p.width / 2) * zoom,
			(-p.height / 2) * zoom,
			(p.height / 2) * zoom,
			-span * 8,
			span * 8,
		)
		p.rotateX(Math.sin(time * 0.28) * 0.22)
		p.rotateY(time * 0.16)
		p.noFill()
		p.strokeWeight(1.4)
		for (const planet of planets) {
			p.push()
			p.translate(planet.x, planet.y, planet.z)
			p.rotateX(planet.rx + time * planet.spin * 0.15)
			p.rotateY(planet.ry)
			p.rotateZ(planet.rz)
			for (const ring of planet.rings) {
				p.stroke(ring.color)
				p.push()
				p.translate(0, 0, ring.z)
				p.ellipse(0, 0, ring.d, ring.d)
				p.pop()
			}
			p.pop()
		}
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			build()
		},
		algorithmName: "planetesMotion",
	})
}

new p5(sketch)
