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
		const cant = p.floor(p.random(3, 200))
		const tam_max = p.dist(0, 0, p.width, p.height)
		const incremento = tam_max / cant
		const x = p.width/2
		const y = p.height/2
		const col = p.color(p.random(255), p.random(255), p.random(255))

		for (let i = 0; i < cant; i++) {
			const tam = tam_max - (incremento * i)
			const cc = 2 * p.floor(p.random(1, 10))
			const c = desplazar(col, 1/p.floor(p.random(2, 5)))
			circulo(x, y, tam, tam, cc, c)
		}
	}

	const circulo = (x: number, y: number, w: number, h: number, cant: number, col: p5.Color): void => {
		p.noStroke()
		const da = p.TWO_PI / cant
		for (let i = 0; i < cant; i++) {
			p.fill(luz(col, p.random(-20, 20)))
			p.arc(x, y, w, h, da * i, da * (i + 1))
		}
	}

	const luz = (col: p5.Color, c: number): p5.Color => {
		return p.color(
			p.red(col) + c,
			p.green(col) + c,
			p.blue(col) + c
		)
	}

	const desplazar = (ori: p5.Color, d: number): p5.Color => {
		p.push()
		p.colorMode(p.HSB, 256, 256, 256)
		const aux = p.color(
			(p.hue(ori) + 256 * d) % 256,
			p.saturation(ori),
			p.brightness(ori)
		)
		p.pop()
		return aux
	}

	// Set up keyboard controls
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "arcos",
	})
}

new p5(sketch) 