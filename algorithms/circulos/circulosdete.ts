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
		const bordes = p.floor(p.random(4, 12)) * 2
		const tam = p.floor(p.random(4, 10))
		const cx = (p.width - bordes * 2) / tam
		const sw = ((p.width - bordes * 2) - cx * tam) / (cx - 1)
		const cy = (p.height - bordes * 2) / tam
		const sh = ((p.height - bordes * 2) - cy * tam) / (cy - 1)
		p.noStroke()
		for (let j = 0; j < cy; j++) {
			for (let i = 0; i < cx; i++) {
				const x = bordes + tam/2 + (tam + sw) * i
				const y = bordes + tam/2 + (tam + sh) * j
				const ang = p.random(p.TWO_PI)
				const cant = p.floor(p.random(2, 12))
				const da = p.TWO_PI/cant
				for (let k = 0; k < cant; k++) {
					p.fill(getRandomColor(p, colors))
					p.arc(x, y, tam, tam, ang + da * k, ang + da * (k + 1))
				}
			}
		}
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
		algorithmName: "circulosdete",
	})
}

new p5(sketch)
