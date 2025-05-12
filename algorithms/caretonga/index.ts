import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	getRandomColor,
	getInterpolatedColor,
	setupKeyboardControls,
} from "../../helpers"

const sketch = (p: p5) => {
	let seed: number
	let colors: string[]

	p.setup = async () => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height)
		p.smooth(4)
		p.pixelDensity(2)
		colors = await getColorPalette()
		seed = p.floor(p.random(999999))
		generate()
	}

	const generate = () => {
		p.randomSeed(seed)
		const c = p.floor(p.random(2))
		p.background(getRandomColor(p, colors))
		p.noStroke()

		p.fill(getRandomColor(p, colors), 1)
		for (let i = 0; i < 200000; i++) {
			const x = p.random(p.width)
			const y = p.random(p.height)
			const tam = p.map(y, 0, p.height, 1, 3)
			p.ellipse(x, y, tam, tam)
		}

		p.fill(getRandomColor(p, colors), 20)
		p.rect(0, 0, p.width, p.height)

		const bordes = 20
		p.noFill()
		const cant = 3
		const des = 6
		p.strokeWeight(0.5)
		for (let i = 0; i < cant; i++) {
			const x = bordes + (cant - i) * des
			const y = bordes + i * des
			const w = p.width - (bordes + (cant - i) * des) * 2
			const h = p.height - (bordes + i * des) * 2
			p.stroke(getRandomColor(p, colors), 40)
			p.rect(x - 1, y - 1, w, h)
			p.stroke(getRandomColor(p, colors), 240)
			p.rect(x, y, w, h)
		}

		const cw = p.floor(p.random(1, 7))
		const ch = p.floor(p.random(1, 7))
		let dim = (p.width - 180) / cw
		if (cw / p.width > ch / p.height) {
			dim = (p.height - 180) / ch
		}

		for (let jj = 0; jj < ch; jj++) {
			for (let ii = 0; ii < cw; ii++) {
				p.strokeWeight(0.5)
				p.noFill()
				p.stroke(getRandomColor(p, colors), 40)
				const x = p.width/2 + dim * (ii - cw/2 + 0.5)
				const y = p.height/2 + dim * (jj - ch/2 + 0.5)

				const cant = p.floor(p.random(1, 5))
				for (let j = -cant/2; j < cant/2 + cant%2; j++) {
					for (let i = -cant/2; i < cant/2 + cant%2; i++) {
						const tam = dim/cant
						let dd = 0
						if (cant%2 === 0) dd = tam/2
						const xx = x + (i - j) * tam/2
						const yy = y + (i + j) * tam/2 + dd
					}
				}

				p.noStroke()
				for (let j = -cant/2; j < cant/2 + cant%2; j++) {
					for (let i = -cant/2; i < cant/2 + cant%2; i++) {
						const tam = dim/cant
						let dd = 0
						if (cant%2 === 0) dd = tam/2
						const xx = x + (i - j) * tam/2
						const yy = y + (i + j) * tam/2 + dd
						for (let k = 0; k < 4; k++) {
							const cc = p.floor(p.random(4))
							p.fill(getRandomColor(p, colors), 200)
							p.stroke(getRandomColor(p, colors), 200)
							figura(xx, yy, tam, 0)
						}
					}
				}
			}
		}

		p.noStroke()
		for (let i = 0; i < 2000; i++) {
			const x = p.random(p.width)
			const y = p.random(p.height)
			const tam = p.map(y, 0, p.height, 1, 3)
			p.fill(getRandomColor(p, colors), p.random(1, 20))
			p.ellipse(x, y, tam, tam)
		}
	}

	const rector = (x: number, y: number, tam: number, cant: number): void => {
		p.beginShape()
		const ang = p.PI/2
		for (let i = 0; i < 4; i++) {
			p.vertex(x + p.cos(ang * i) * tam/2, y + p.sin(ang * i) * tam/2)
		}
		p.endShape(p.CLOSE)
	}

	const figura = (x: number, y: number, tam: number, cant: number): void => {
		p.beginShape()
		const ang = p.PI/2
		const da = p.floor(p.random(4))
		const c = 2 + p.floor(p.random(4))
		if (c === 2) return
		for (let i = 0; i < c; i++) {
			if (i === 4) {
				p.vertex(x, y)
				continue
			}
			p.vertex(x + p.cos(ang * (da + i)) * tam/2, y + p.sin(ang * (da + i)) * tam/2)
		}
		p.endShape(p.CLOSE)
	}

	// Set up keyboard controls
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "caretonga",
	})
}

new p5(sketch) 