import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers"

class Cubito {
	private eliminar: boolean = false
	private s: p5.Color
	private f: p5.Color
	private dir: number
	private esp: number
	private min_esp: number
	private max_esp: number
	private vel: number
	private des: number = 0
	private x: number
	private y: number
	private w: number
	private h: number

	constructor(p: p5, x: number, y: number, w: number, h: number) {
		this.x = x
		this.y = y
		this.w = w
		this.h = h
		this.min_esp = p.floor(p.random(1, 20))
		this.max_esp = p.floor(p.random(20, 60))
		this.esp = p.random(this.min_esp, this.max_esp)
		this.vel = p.random(0.1, 0.4)
		this.dir = p.floor(p.random(4))
		if (p.random(10) < 5) {
			this.s = p.color(0)
			this.f = p.color(255)
		} else {
			this.s = p.color(255)
			this.f = p.color(0)
		}
	}

	act(p: p5): void {
		this.des += 0.01
		if (this.des > 1) this.des = 0
		this.esp += this.vel
		if (this.esp > this.max_esp) this.esp = this.min_esp
		this.dibujar(p)
	}

	private dibujar(p: p5): void {
		p.noStroke()
		p.fill(this.f)
		p.rect(this.x, this.y, this.w, this.h)
		p.stroke(this.s)
		rectLine(p, this.x, this.y, this.w, this.h, this.esp, this.des, this.dir)
	}
}

const rectLine = (p: p5, x: number, y: number, w: number, h: number, esp: number, des: number, dir: number): void => {
	p.strokeCap(p.SQUARE)
	if (dir === 0) {
		for (let i = p.floor(esp*des); i < h; i += esp) {
			p.line(x, y+i, x+w, y+i)
		}
	} else if (dir === 1) {
		for (let i = p.floor(esp*des); i < w+h; i += esp) {
			if (i < h) {
				if (x+i <= x+w) p.line(x, y+h-i, x+i, y+h)
				else p.line(x, y+h-i, x+w, y+h-i+w)
			} else {
				if (y-i+h+w <= y+h) p.line(x+i-h, y, x+w, y-i+h+w)
				else p.line(x+i-h, y, x+i, y+h)
			}
		}
	} else if (dir === 2) {
		for (let i = p.floor(esp*des); i < w; i += esp) {
			p.line(x+i, y, x+i, y+h)
		}
	} else if (dir === 3) {
		for (let i = p.floor(esp*des); i < w+h; i += esp) {
			if (i < h) {
				if (x+i <= x+w) p.line(x+w, y+h-i, x+w-i, y+h)
				else p.line(x, y+h-i+w, x+w, y+h-i)
			} else {
				if (y-i+h+w <= y+h) p.line(x, y+h-i+w, x-i+w+h, y)
				else p.line(x-i+w+h, y, x-i+w, y+h)
			}
		}
	}
}

const sketch = (p: p5) => {
	let cubitos: Cubito[] = []

	p.setup = async () => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height)
		p.smooth(8)
		cubitos = []
		generar(0, 0, p.width, p.height, 5)
	}

	p.draw = () => {
		p.background(255)
		for (let i = 0; i < cubitos.length; i++) {
			cubitos[i].act(p)
		}
	}

	const generar = (x: number, y: number, w: number, h: number, n: number): void => {
		cubitos.push(new Cubito(p, x, y, w, h))
		n--
		if (n > 0) {
			if (p.random(5) < n) generar(x, y, w/2, h/2, n)
			if (p.random(5) < n) generar(x+w/2, y, w/2, h/2, n)
			if (p.random(5) < n) generar(x, y+h/2, w/2, h/2, n)
			if (p.random(5) < n) generar(x+w/2, y+h/2, w/2, h/2, n)
		}
	}

	// Set up keyboard controls
	p.keyPressed = () => setupKeyboardControls(p, {
		generateFn: () => {
			cubitos = []
			generar(0, 0, p.width, p.height, 5)
		},
		algorithmName: "curdiculasdecuadrados",
	})()
}

new p5(sketch)
