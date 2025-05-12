import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let backgroundColor: p5.Color

	p.setup = async (): Promise<void> => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height)
		p.smooth()
		p.pixelDensity(2)
		seed = p.floor(p.random(999999))
		colors = await getColorPalette()
		generate()
	}

	const generate = (): void => {
		p.randomSeed(seed)
		backgroundColor = rcol()
		p.background(backgroundColor)

		const desc = p.random(10000)
		const detc = p.random(0.01)
		const particleCount = 20000

		p.noStroke()
		for (let i = 0; i < particleCount; i++) {
			const x = p.random(p.width)
			const dy = Math.pow(p.map(i, 0, particleCount, 0.2, 1), 8)
			const y = p.height * p.map(dy, 0, 1, 0, 1)
			const s = p.width * (0.01 + p.random(0.01) * dy)

			p.fill(getColor(p.noise(desc + x * detc, desc + y * detc) * colors.length * 4))
			p.ellipse(x, y, s, s)
		}
	}

	const flower = (x: number, y: number, s: number): void => {
		let c1 = rcol()
		while (p.red(c1) === p.red(backgroundColor) && 
				p.green(c1) === p.green(backgroundColor) && 
				p.blue(c1) === p.blue(backgroundColor)) {
			c1 = rcol()
		}

		let c2 = rcol()
		while ((p.red(c2) === p.red(backgroundColor) && 
				p.green(c2) === p.green(backgroundColor) && 
				p.blue(c2) === p.blue(backgroundColor)) || 
				(p.red(c2) === p.red(c1) && 
				p.green(c2) === p.green(c1) && 
				p.blue(c2) === p.blue(c1))) {
			c2 = rcol()
		}

		const petalCount = p.floor(p.random(3, 20))
		const angleStep = p.TWO_PI / petalCount
		const angle = p.random(p.TWO_PI)
		const direction = p.floor(p.random(2)) * 2 - 1

		p.push()
		p.translate(x, y)
		p.fill(c1)

		const size1 = s * p.random(0.3, 0.45)
		const size2 = size1 * p.random(0.4, 0.8)
		const power1 = p.random(0.5, 1.9)
		const power2 = p.random(0.5, 1.9)
		const dc1 = p.random(colors.length)
		const dc2 = dc1 + p.random(-1, 1) * p.random(0.5)

		for (let j = 0; j < petalCount; j++) {
			p.push()
			p.rotate(angle + angleStep * j * direction)
			p.translate(size1 * 0.5, 0)
			p.rotate(angleStep * p.random(-0.04, 0.04))
			p.rotateX(0.3)

			const ep1 = p.random(0.95, 1.05)
			const ep2 = p.random(0.95, 1.05)
			p.fill(c1)
			petal(size1, size2, power1 * ep1, power2 * ep2, dc1, dc2)
			p.pop()
		}

		p.fill(c2)
		p.translate(0, 0, s * 0.5)
		const size3 = s * p.random(0.18, 0.3)
		p.ellipse(0, 0, size3, size3)
		p.pop()
	}

	const petal = (s1: number, s2: number, pwr1: number, pwr2: number, dc1: number, dc2: number): void => {
		const r1 = s1 * 0.5
		const r2 = s2 * 0.5
		const vertexCount = p.floor(p.TWO_PI * p.sqrt(((r1 * r1) + (r2 * r2)) / 2))
		const angleStep = p.TWO_PI / vertexCount

		p.beginShape()
		for (let i = 0; i < vertexCount; i++) {
			const ang = angleStep * i
			let dx = p.cos(ang)
			let dy = p.sin(ang)
			dx = sign(dx) * Math.pow(Math.abs(dx), pwr1)
			dy = sign(dy) * Math.pow(Math.abs(dy), pwr2)
			p.vertex(dx * r1, dy * r2)
		}
		p.endShape(p.CLOSE)
	}

	const sign = (v: number): number => {
		if (v > 0) return 1
		if (v < 0) return -1
		return 0
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const getColor = (v: number): p5.Color => {
		const value = Math.abs(v)
		const normalizedValue = value % colors.length
		const c1 = p.color(colors[p.floor(normalizedValue % colors.length)])
		const c2 = p.color(colors[p.floor((normalizedValue + 1) % colors.length)])
		return p.lerpColor(c1, c2, normalizedValue % 1)
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "nippon-flower",
	})
}

new p5(sketch)
