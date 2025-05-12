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

	p.setup = async (): Promise<void> => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height)
		p.pixelDensity(2)
		p.smooth()
		colors = await getColorPalette()
		seed = p.floor(p.random(999999))
		generate()
	}

	const generate = (): void => {
		p.randomSeed(seed)
		p.background(255)
		p.stroke(0, 20)
		for (let i = 0; i < 100; i++) {
			p.line(p.random(p.width), p.random(p.height), p.random(p.width), p.random(p.height))
		}
		for (let i = 0; i < 20; i++) {
			helado1(p.random(p.width), p.random(p.height), p.random(20, 40))
		}
		p.fill(0)
		p.textAlign(p.CENTER, p.BOTTOM)
		p.text("糖凍結された液体 - 2014 - manoloide.", p.width / 2, p.height - 10)
	}

	const helado1 = (x: number, y: number, s: number): void => {
		const style = p.floor(p.random(3))
		const col = getRandomColor(p, colors)
		p.push()
		p.translate(x, y)
		p.rotate(p.random(p.TWO_PI))
		p.noStroke()
		switch (style) {
			case 0:
				p.fill(col)
				p.ellipse(0, 0, s, s * 1.2)
				p.fill(255)
				p.ellipse(0, -s * 0.2, s * 0.6, s * 0.6)
				break
			case 1:
				p.fill(col)
				p.ellipse(0, 0, s, s * 1.2)
				p.fill(255)
				p.ellipse(0, -s * 0.2, s * 0.6, s * 0.6)
				p.fill(col)
				p.ellipse(0, s * 0.2, s * 0.4, s * 0.4)
				break
			case 2:
				p.fill(col)
				p.ellipse(0, 0, s, s * 1.2)
				p.fill(255)
				p.ellipse(0, -s * 0.2, s * 0.6, s * 0.6)
				p.fill(col)
				p.ellipse(0, s * 0.2, s * 0.4, s * 0.4)
				p.fill(255)
				p.ellipse(0, s * 0.4, s * 0.2, s * 0.2)
				break
		}
		p.pop()
	}

	// Set up keyboard controls
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "helados",
	})
}

export default sketch 