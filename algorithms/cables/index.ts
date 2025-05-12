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
		p.background(30)
		crucez()

		const amount = p.floor(p.random(2, 8))
		for (let i = 0; i < amount; ++i) {
			const x = p.width/2
			const y = p.height/2
			let px = x
			let py = y
			let ang = p.random(p.PI + p.PI/2, p.TWO_PI - p.PI/2)
			p.stroke(90)
			p.strokeWeight(0.6)
			p.strokeCap(p.ROUND)
			p.noStroke()
			for (let j = 0; j < 500; ++j) {
				p.fill(getRandomColor(p, colors))
				p.push()
				ang += p.random(-0.2, 0.2)
				const newX = x + p.cos(ang) * j
				const newY = y + p.sin(ang) * j
				p.translate(newX, newY)
				p.rotate(ang)
				p.arc(0, 0, 60, 2, 0, p.PI)
				px = newX
				py = newY
				p.pop()
			}
		}

		p.stroke(80)
		p.strokeWeight(14)
		p.noFill()
		p.rect(0, 0, p.width, p.height)
	}

	const crucez = () => {
		const des = 14
		const tt = des * p.random(0.2, 0.48)
		const tt2 = tt * p.random(0.3, 0.95)
		p.strokeWeight(des/8)
		const desx = -p.random(des)
		const desy = -p.random(des)
		p.strokeCap(p.SQUARE)
		for (let j = 0; j < p.height/des + 1; j++) {
			const yy = desy + des * j
			p.stroke(p.map(j, 0, p.height, 40, 50))
			for (let i = 0; i < p.width/des + 1; i++) {
				const xx = desx + des * i
				const t = (i + j) % 2 === 0 ? tt2 : tt
				p.line(xx - t, yy - t, xx + t, yy + t)
				p.line(xx - t, yy + t, xx + t, yy - t)
			}
		}
	}

	// Set up keyboard controls
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "cables",
	})
}

new p5(sketch) 