import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers"

class Palette {
	private colors: p5.Color[]
	private p: p5

	constructor(p: p5, ...colors: p5.Color[]) {
		this.p = p
		this.colors = colors
	}

	getRandomColor(): p5.Color {
		return this.colors[this.p.floor(this.p.random(this.colors.length))]
	}
}

const sketch = (p: p5) => {
	let seed: number
	let colors: string[]
	let palette: Palette

	p.setup = async () => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height)
		p.smooth()
		p.pixelDensity(2)
		colors = await getColorPalette()
		palette = new Palette(
			p,
			p.color("#163440"),
			p.color("#28A199"),
			p.color("#70CCAD"),
			p.color("#CAFAC3"),
			p.color("#FFFACC")
		)
		seed = p.floor(p.random(999999))
		generate()
	}

	const generate = () => {
		p.randomSeed(seed)
		p.background(palette.getRandomColor())
		let cant = 0
		let tam = p.dist(0, 0, p.width, p.height)
		for (let i = 0; i < 100; i++) {
			const x = p.width/2
			const y = p.height/2
			const t = p.floor(p.random(10) + 1) * 10
			const dim = p.random(2, p.dist(0, 0, p.width, p.height))
			const ang = p.random(p.TWO_PI)
			const r = p.floor(p.random(5)) + 1
			const c1 = palette.getRandomColor()
			const c2 = palette.getRandomColor()
			switch(r) {
				case 1:
					circulo1(x, y, dim, t, ang, p.floor(p.random(3, 72)), p.floor(p.random(8)), c1, c2)
					break
				case 2:
					circulo2(x, y, dim, t, ang, p.floor(p.random(72)), c1, c2)
					break
				case 3:
					circulo3(x, y, dim, t, ang, p.floor(p.random(8)), p.random(p.TWO_PI), p.floor(p.random(3, 8)), c1, c2)
					break
				case 4:
					circulo4(x, y, dim, t, ang, p.floor(p.random(8, 65)), c1, c2)
					break
				case 5:
					circulo5(x, y, dim, t, ang, p.floor(p.random(10)), p.floor(p.random(80)), c1, c2)
					break
			}
		}
	}

	const circulo1 = (x: number, y: number, dim: number, anc: number, ang: number, cant: number, cant2: number, c1: p5.Color, c2: p5.Color): void => {
		anc /= 2
		dim -= anc
		p.strokeWeight(anc)
		p.stroke(c2)
		p.noFill()
		p.ellipse(x, y, dim, dim)
		const da = p.TWO_PI/cant
		p.strokeWeight(1)
		p.stroke(c1)
		for (let i = 1; i < cant2; i++) {
			const dd = (anc*2/cant2)*i
			p.ellipse(x, y, dim-anc+dd, dim-anc+dd)
		}
		for (let i = 0; i < cant; i++) {
			const xx = p.cos(ang+da*i)*dim/2
			const yy = p.sin(ang+da*i)*dim/2
			const dx = p.cos(ang+da*i)*anc/2
			const dy = p.sin(ang+da*i)*anc/2
			p.line(x+xx+dx, y+yy+dy, x+xx-dx, y+yy-dy)
		}
	}

	const circulo2 = (x: number, y: number, dim: number, anc: number, ang: number, cant: number, c1: p5.Color, c2: p5.Color): void => {
		anc /= 2
		dim -= anc
		p.strokeWeight(anc)
		p.stroke(c1)
		p.noFill()
		p.ellipse(x, y, dim, dim)
		const da = p.TWO_PI/cant
		p.strokeWeight(1)
		p.noStroke()
		p.fill(c2)
		for (let i = 0; i < cant; i++) {
			const xx = p.cos(ang+da*i)*dim/2
			const yy = p.sin(ang+da*i)*dim/2
			p.ellipse(x+xx, y+yy, anc, anc)
		}
	}

	const circulo3 = (x: number, y: number, dim: number, anc: number, ang: number, cant: number, ang2: number, cant2: number, c1: p5.Color, c2: p5.Color): void => {
		anc /= 2
		dim -= anc
		const tam = anc*0.6
		p.strokeWeight(anc)
		p.stroke(c2)
		p.noFill()
		p.ellipse(x, y, dim, dim)
		const da = p.TWO_PI/cant
		p.strokeWeight(1)
		p.noStroke()
		p.fill(c1)
		for (let i = 0; i < cant; i++) {
			const xx = p.cos(ang+da*i)*dim/2
			const yy = p.sin(ang+da*i)*dim/2
			figura(x+xx, y+yy, tam, ang2+da*i, cant2)
		}
	}

	const circulo4 = (x: number, y: number, dim: number, anc: number, ang: number, cant: number, c1: p5.Color, c2: p5.Color): void => {
		anc /= 2
		dim -= anc
		p.strokeWeight(anc/2)
		p.stroke(c1)
		p.noFill()
		p.ellipse(x, y, dim+anc/2, dim+anc/2)
		p.stroke(c2)
		p.ellipse(x, y, dim-anc/2, dim-anc/2)
		const da = p.TWO_PI/cant*2
		const da2 = da/2
		p.strokeWeight(1)
		p.noStroke()
		p.fill(255)
		for (let i = 0; i < cant; i++) {
			const x1 = x+p.cos(ang+da*i)*(dim/2+anc/2)
			const y1 = y+p.sin(ang+da*i)*(dim/2+anc/2)
			const x2 = x+p.cos(ang+da*(i+1))*(dim/2+anc/2)
			const y2 = y+p.sin(ang+da*(i+1))*(dim/2+anc/2)
			const x3 = x+p.cos(ang+da*i+da2)*(dim/2-anc/2)
			const y3 = y+p.sin(ang+da*i+da2)*(dim/2-anc/2)
			const x4 = x+p.cos(ang+da*(i+1)+da2)*(dim/2-anc/2)
			const y4 = y+p.sin(ang+da*(i+1)+da2)*(dim/2-anc/2)
			p.fill(c1)
			p.beginShape()
			p.vertex(x1, y1)
			p.vertex(x2, y2)
			p.vertex(x3, y3)
			p.endShape(p.CLOSE)
			p.fill(c2)
			p.beginShape()
			p.vertex(x2, y2)
			p.vertex(x3, y3)
			p.vertex(x4, y4)
			p.endShape(p.CLOSE)
		}
	}

	const circulo5 = (x: number, y: number, dim: number, anc: number, ang: number, cant: number, tam: number, c1: p5.Color, c2: p5.Color): void => {
		anc /= 2
		dim -= anc
		p.strokeWeight(anc)
		p.stroke(c1)
		p.noFill()
		p.ellipse(x, y, dim-anc/2, dim-anc/2)
		const da = p.TWO_PI/cant
		p.strokeWeight(1)
		p.noStroke()
		p.fill(c2)
		for (let i = 0; i < cant; i++) {
			const xx = x+p.cos(ang+da*i)*(dim/2)
			const yy = y+p.sin(ang+da*i)*(dim/2)
			for (let t = tam; t > 0; t-=5) {
				if (t%(10) === 0) p.fill(c1)
				else p.fill(c2)
				p.ellipse(xx, yy, t, t)
			}
		}
	}

	const figura = (x: number, y: number, dim: number, ang: number, cant: number): void => {
		const da = p.TWO_PI/cant
		const rad = dim/2
		p.beginShape()
		for (let i = 0; i < cant; i++) {
			p.vertex(x+p.cos(ang+da*i)*rad, y+p.sin(ang+da*i)*rad)
		}
		p.endShape(p.CLOSE)
	}

	// Set up keyboard controls
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "circulosdentrocirculos2",
	})
}

new p5(sketch) 