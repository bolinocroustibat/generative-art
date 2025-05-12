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
		p.background(250)
		const arbol = new Arbol(p.width/2, p.height/3*2, p.height/3)
		arbol.init()
	}

	class Arbol {
		private struc: boolean
		private seed: number
		private x: number
		private y: number
		private w: number
		private h: number
		private cantRamas: number = 0
		private maxRami: number = 0
		private desang: number = 0
		private probRami: number = 0

		constructor(x: number, y: number, h: number) {
			this.x = x
			this.y = y
			this.h = h
			this.w = h * p.random(0.18, 0.95)
			this.struc = true
			this.seed = p.floor(p.random(999999999))
		}

		init(): void {
			p.randomSeed(this.seed)
			this.desang = p.random(-0.02, 0.02)
			this.cantRamas = p.floor(p.random(2, 9))
			this.maxRami = p.floor(p.random(1, 4))
			this.probRami = 0
			if (this.maxRami > 1) {
				this.probRami = p.random(1)
			}
			p.stroke(0)
			const des = this.h * p.map(this.cantRamas, 2, 8, 0.5, 0.20)
			const ang = p.TWO_PI - p.PI/2 + this.desang
			this.rama(this.x, this.y, this.cantRamas, ang, des)

			if (this.struc) this.drawStruc()
		}

		private rama(px: number, py: number, rama: number, ang: number, des: number): void {
			const x = px + p.cos(ang) * des
			const y = py + p.sin(ang) * des
			p.strokeWeight(p.map(rama, 0, this.cantRamas-1, 1, 5))
			p.line(px, py, x, y)
			des *= p.map(rama, 2, 8, 1, 0.70)
			ang += this.desang
			rama -= 1
			if (rama < 0) return

			let cant = 0
			if (p.random(1) > this.probRami) {
				cant = p.floor(p.random(this.maxRami) + 1)
			}
			for (let i = 0; i < cant; i++) {
				const auxang = ang + this.desang * (i - cant/2 + (p.random(1) < 0.5 ? 0 : 0.5)) * 80
				this.rama(x, y, rama, auxang, des)
			}
		}

		private drawStruc(): void {
			p.strokeWeight(1)
			p.stroke(75, 158, 255, 80) // #4B9EFF with alpha
			p.noFill()
			p.line(this.x, this.y - this.h, this.x, this.y)
			p.line(this.x - this.w/2, this.y - this.h, this.x + this.w/2, this.y)
			p.line(this.x - this.w/2, this.y, this.x + this.w/2, this.y - this.h)
			p.rect(this.x - this.w/2, this.y - this.h, this.w, this.h)
		}
	}

	// Set up keyboard controls
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "arboles",
	})
}

new p5(sketch) 