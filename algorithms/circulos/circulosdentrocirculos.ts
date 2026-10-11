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
		p.smooth()
		p.pixelDensity(2)
		colors = await getColorPalette()
		seed = p.floor(p.random(999999))
		generate()
	}

	const generate = () => {
		p.randomSeed(seed)
		p.background(0)
		let cant = 0
		let tam = p.dist(0, 0, p.width, p.height)
		while (tam > 0) {
			const x = p.width/2
			const y = p.height/2
			const t = p.floor(p.random(10) + 1) * 10
			const dim = tam
			const ang = p.random(p.TWO_PI)
			const r = p.floor(p.random(5)) + 1
			switch(r) {
				case 1:
					circulo1(x, y, dim, ang, t, p.floor(p.random(3, 72)), p.floor(p.random(8)))
					break
				case 2:
					circulo2(x, y, dim, ang, t, p.floor(p.random(72)))
					break
				case 3:
					circulo3(x, y, dim, ang, t, p.floor(p.random(8)), p.random(p.TWO_PI), p.floor(p.random(3, 8)))
					break
				case 4:
					circulo4(x, y, dim, ang, t, p.floor(p.random(4, 73)))
					break
				case 5:
					circulo5(x, y, dim, ang, t, p.floor(p.random(72)), p.floor(p.random(8)))
					break
			}
			tam -= t
			cant++
		}
	}

	const circulo1 = (x: number, y: number, dim: number, anc: number, ang: number, cant: number, cant2: number): void => {
		p.strokeWeight(anc)
		p.stroke(255)
		p.noFill()
		p.ellipse(x, y, dim, dim)
		const da = p.TWO_PI/cant
		p.strokeWeight(1)
		p.stroke(0)
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

	const circulo2 = (x: number, y: number, dim: number, anc: number, ang: number, cant: number): void => {
		p.strokeWeight(anc)
		p.stroke(0)
		p.noFill()
		p.ellipse(x, y, dim, dim)
		const da = p.TWO_PI/cant
		p.strokeWeight(1)
		p.noStroke()
		p.fill(255)
		for (let i = 0; i < cant; i++) {
			const xx = p.cos(ang+da*i)*dim/2
			const yy = p.sin(ang+da*i)*dim/2
			p.ellipse(x+xx, y+yy, anc, anc)
		}
	}

	const circulo3 = (x: number, y: number, dim: number, anc: number, ang: number, cant: number, ang2: number, cant2: number): void => {
		const tam = anc*0.6
		p.strokeWeight(anc)
		p.stroke(255)
		p.noFill()
		p.ellipse(x, y, dim, dim)
		const da = p.TWO_PI/cant
		p.strokeWeight(1)
		p.noStroke()
		p.fill(0)
		for (let i = 0; i < cant; i++) {
			const xx = p.cos(ang+da*i)*dim/2
			const yy = p.sin(ang+da*i)*dim/2
			figura(x+xx, y+yy, tam, ang2+da*i, cant2)
		}
	}

	const circulo4 = (x: number, y: number, dim: number, anc: number, ang: number, cant: number): void => {
		p.strokeWeight(anc/2)
		p.stroke(0)
		p.noFill()
		p.ellipse(x, y, dim+anc/2, dim+anc/2)
		p.stroke(255)
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
			p.fill(0)
			p.beginShape()
			p.vertex(x1, y1)
			p.vertex(x2, y2)
			p.vertex(x3, y3)
			p.endShape(p.CLOSE)
			p.fill(255)
			p.beginShape()
			p.vertex(x2, y2)
			p.vertex(x3, y3)
			p.vertex(x4, y4)
			p.endShape(p.CLOSE)
		}
	}

	const circulo5 = (x: number, y: number, dim: number, anc: number, ang: number, cant: number, tam: number): void => {
		p.strokeWeight(anc)
		p.stroke(0)
		p.noFill()
		p.ellipse(x, y, dim-anc/2, dim-anc/2)
		const da = p.TWO_PI/cant
		p.strokeWeight(1)
		p.noStroke()
		p.fill(255)
		for (let i = 0; i < cant; i++) {
			const xx = x+p.cos(ang+da*i)*(dim/2)
			const yy = y+p.sin(ang+da*i)*(dim/2)
			for (let t = tam; t > 0; t-=5) {
				if (t%(10) === 0) p.fill(0)
				else p.fill(255)
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
		algorithmName: "circulosdentrocirculos",
	})
}

new p5(sketch)
