import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	getRandomColor,
	setupKeyboardControls,
} from "../../helpers"

class Cube {
	private x: number
	private y: number
	private z: number
	private faces: p5.Graphics[]

	constructor(p: p5, x: number, y: number, z: number, colors: string[]) {
		this.x = x
		this.y = y
		this.z = z
		this.faces = new Array(6)
		for (let i = 0; i < 6; i++) {
			this.faces[i] = createSquare(p, 200, 200, colors)
		}
	}

	draw(p: p5) {
		p.push()
		p.translate(this.x/90, this.y/90, this.z/90)
		
		// Front face
		p.beginShape(p.QUADS)
		p.texture(this.faces[0])
		p.vertex(-1, -1, 1, 0, 0)
		p.vertex(1, -1, 1, 1, 0)
		p.vertex(1, 1, 1, 1, 1)
		p.vertex(-1, 1, 1, 0, 1)
		p.endShape()

		// Back face
		p.beginShape(p.QUADS)
		p.texture(this.faces[1])
		p.vertex(1, -1, -1, 0, 0)
		p.vertex(-1, -1, -1, 1, 0)
		p.vertex(-1, 1, -1, 1, 1)
		p.vertex(1, 1, -1, 0, 1)
		p.endShape()

		// Top face
		p.beginShape(p.QUADS)
		p.texture(this.faces[2])
		p.vertex(-1, 1, 1, 0, 0)
		p.vertex(1, 1, 1, 1, 0)
		p.vertex(1, 1, -1, 1, 1)
		p.vertex(-1, 1, -1, 0, 1)
		p.endShape()

		// Bottom face
		p.beginShape(p.QUADS)
		p.texture(this.faces[3])
		p.vertex(-1, -1, -1, 0, 0)
		p.vertex(1, -1, -1, 1, 0)
		p.vertex(1, -1, 1, 1, 1)
		p.vertex(-1, -1, 1, 0, 1)
		p.endShape()

		// Right face
		p.beginShape(p.QUADS)
		p.texture(this.faces[4])
		p.vertex(1, -1, 1, 0, 0)
		p.vertex(1, -1, -1, 1, 0)
		p.vertex(1, 1, -1, 1, 1)
		p.vertex(1, 1, 1, 0, 1)
		p.endShape()

		// Left face
		p.beginShape(p.QUADS)
		p.texture(this.faces[5])
		p.vertex(-1, -1, -1, 0, 0)
		p.vertex(-1, -1, 1, 1, 0)
		p.vertex(-1, 1, 1, 1, 1)
		p.vertex(-1, 1, -1, 0, 1)
		p.endShape()

		p.pop()
	}
}

const createTexture = (p: p5, w: number, h: number, col: p5.Color): p5.Image => {
	const aux = p.createImage(w, h)
	aux.loadPixels()
	for (let i = 0; i < aux.pixels.length; i++) {
		const c = p.lerpColor(col, p.color(p.random(80, 256)), 0.03)
		aux.set(i % w, Math.floor(i / w), c)
	}
	aux.updatePixels()
	return aux
}

const createSquare = (p: p5, w: number, h: number, colors: string[]): p5.Graphics => {
	const f = createTexture(p, w, h, p.color("#F2F2EB"))
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

const sketch = (p: p5) => {
	let seed: number
	let colors: string[]
	let cubes: Cube[]
	let rotX = p.PI/4
	let rotY = p.PI/4

	p.setup = async () => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.WEBGL)
		p.smooth()
		p.pixelDensity(2)
		colors = await getColorPalette()
		seed = p.floor(p.random(999999))
		p.textureMode(p.NORMAL)
		cubes = []
		for (let i = 0; i < 40; i++) {
			cubes.push(new Cube(p, p.random(p.width), p.random(p.height), p.random(1000), colors))
		}
	}

	p.draw = () => {
		p.background(p.color(colors[2]))
		p.noStroke()
		p.translate(0, 0, -100)
		p.rotateX(rotX)
		p.rotateY(rotY)
		p.scale(90)
		for (const cube of cubes) {
			cube.draw(p)
		}
	}

	p.mouseDragged = () => {
		const rate = 0.01
		rotX += (p.pmouseY - p.mouseY) * rate
		rotY += (p.mouseX - p.pmouseX) * rate
	}

	// Set up keyboard controls
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			cubes = []
			for (let i = 0; i < 40; i++) {
				cubes.push(new Cube(p, p.random(p.width), p.random(p.height), p.random(1000), colors))
			}
		},
		algorithmName: "circulos2",
	})
}

new p5(sketch)
