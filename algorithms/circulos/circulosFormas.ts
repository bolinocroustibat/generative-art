import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers"

const sketch = (p: p5) => {
	let seed: number
	let colors: string[]

	p.setup = async () => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height)
		colors = await getColorPalette()
		seed = p.floor(p.random(999999))
		generate()
	}

	const generate = () => {
		p.randomSeed(seed)
		p.background(getRandomColor(p, colors))
		const cantplanos = 8
		for (let j = 0; j < cantplanos; j++) {
			const cx = p.width/2
			const cy = p.height/2
			const tam = p.map(j, 0, cantplanos, -10, p.width)
			const t = p.map(j, 0, cantplanos, 10, 160)
			const cant = p.floor(p.map(j, 0, cantplanos, 1000, 300) * p.map(j, 0, cantplanos, 2, 0.6))
			for (let i = 0; i < cant; i++) {
				const x = p.random(p.width)
				const y = p.random(p.height)
				if (p.dist(x, y, cx, cy) > tam/2 + t/2) {
					const c = p.floor(p.random(3, 8))
					const ang = p.random(p.TWO_PI)
					const hun = p.random(0.5, 1)
					const isEstrella = p.random(1) < 0.5
					p.noFill()
					for (let s = 0; s < 10; s++) {
						p.strokeWeight(s)
						p.stroke(0, 4)
						if (isEstrella) {
							estrella(x, y, t, c, ang, hun)
						} else {
							forma(x, y, t, c, ang)
						}
					}
					p.noStroke()
					p.fill(getRandomColor(p, colors))
					if (isEstrella) {
						estrella(x, y, t, c, ang, hun)
					} else {
						forma(x, y, t, c, ang)
					}
				}
			}
		}
	}

	const forma = (x: number, y: number, d: number, c: number, ang: number): void => {
		const r = d/2
		const da = p.TWO_PI/c
		p.beginShape()
		for (let i = 0; i < c; i++) {
			p.vertex(x + p.cos(da * i + ang) * r, y + p.sin(da * i + ang) * r)
		}
		p.endShape(p.CLOSE)
	}

	const estrella = (x: number, y: number, d: number, c: number, ang: number, hun: number): void => {
		const r = d/2
		const da = p.TWO_PI/c
		p.beginShape()
		for (let i = 0; i < c; i += 0.5) {
			if (i % 1 === 0) {
				p.vertex(x + p.cos(da * i + ang) * r, y + p.sin(da * i + ang) * r)
			} else {
				p.vertex(x + p.cos(da * i + ang) * r * hun, y + p.sin(da * i + ang) * r * hun)
			}
		}
		p.endShape(p.CLOSE)
	}

	const getRandomColor = (p: p5, colors: string[]): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	// Set up keyboard controls
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "circulosFormas",
	})
}

new p5(sketch)
