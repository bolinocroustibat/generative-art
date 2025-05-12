import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	getRandomColor,
	setupKeyboardControls,
} from "../../helpers"

const sketch = (p: p5) => {
	let seed: number
	let colors: string[]
	let backgroundImage: p5.Image

	p.setup = async () => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height)
		p.smooth()
		p.pixelDensity(2)
		colors = await getColorPalette()
		seed = p.floor(p.random(999999))
		generate()
	}

	const generate = () => {
		p.randomSeed(seed)
		backgroundImage = createTexture(p.width, p.height, p.color(colors[2]))
		p.image(backgroundImage, 0, 0)

		for (let j = 0; j < 4; j++) {
			for (let i = 0; i < 3; i++) {
				const aux = createSquare(160, 160)
				p.stroke(0, 12)
				p.noFill()
				p.rect(40.5 + i * 180, 40.5 + j * 180, 160, 160)
				p.image(aux, 40 + i * 180, 40 + j * 180)
			}
		}
		p.noFill()
	}

	const createTexture = (w: number, h: number, col: p5.Color): p5.Image => {
		const aux = p.createImage(w, h)
		aux.loadPixels()
		for (let i = 0; i < aux.pixels.length; i++) {
			const c = p.lerpColor(col, p.color(p.random(80, 256)), 0.03)
			aux.set(i % w, Math.floor(i / w), c)
		}
		aux.updatePixels()
		return aux
	}

	const createSquare = (w: number, h: number): p5.Renderer => {
		const f = createTexture(w, h, p.color("#F2F2EB"))
		const aux = p.createGraphics(w, h)
		let ang: number, dist: number, tam: number

		aux.push()
		aux.smooth()
		aux.image(f, 0, 0)
		aux.noStroke()

		// Draw small circles
		for (let i = 0; i < 22; i++) {
			tam = p.random(0.5, 2)
			aux.fill(p.color(colors[p.floor(p.random(colors.length))]))
			aux.ellipse(p.random(w), p.random(h), tam, tam)
		}

		// Draw large circles
		aux.noFill()
		for (let i = 0; i < 8; i++) {
			ang = p.random(p.TWO_PI)
			dist = p.random(30, 120)
			tam = p.random(30, 160)
			aux.strokeWeight(p.random(3, 8))
			aux.stroke(p.color(colors[p.floor(p.random(colors.length))]))
			aux.ellipse(80 + p.cos(ang) * dist, 80 + p.sin(ang) * dist, tam, tam)
		}

		aux.pop()
		return aux
	}

	// Set up keyboard controls
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "circulos",
	})
}

new p5(sketch)
