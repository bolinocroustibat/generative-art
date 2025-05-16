import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []

	p.setup = async (): Promise<void> => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height)
		p.smooth()
		p.pixelDensity(2)
		seed = p.floor(p.random(999999))
		colors = await getColorPalette()
		generate()
	}

	p.draw = (): void => {}

	const generate = (): void => {
		p.randomSeed(seed)
		p.background(rcol())
		p.noStroke()

		const cc = p.floor(p.random(10, 200))
		const ic = p.random(colors.length)
		const dc = p.random(10) * p.random(1)
		const ss = p.random(50, 260)
		const rot = p.random(-p.PI, p.PI)

		// Draw background spirals
		for (let i = 0; i < cc; i++) {
			const s = p.map(i, 0, cc, p.width * 1.5, ss)
			
			p.push()
			p.translate(p.width / 2, p.height / 2)
			p.rotate(p.map(i, 0, cc, rot, 0))
			drawSpiral(0, 0, s, getColor(ic + dc * i))
			p.pop()
		}

		// Draw central spiral
		p.push()
		p.translate(p.width / 2, p.height / 2)
		drawSpiral(0, 0, ss, rcol())
		p.pop()
	}

	const drawSpiral = (x: number, y: number, s: number, color: p5.Color): void => {
		p.push()
		p.translate(x, y)
		
		const numArms = p.floor(p.random(3, 7))
		const rotations = p.random(1, 3)
		const points = 50
		
		for(let arm = 0; arm < numArms; arm++) {
			p.fill(color)
			p.beginShape()
			
			// Start at center
			p.vertex(0, 0)
			
			for(let i = 0; i <= points; i++) {
				const t = i / points
				const angle = p.TWO_PI * rotations * t + (p.TWO_PI / numArms) * arm
				const radius = s * (1 - t)
				const px = p.cos(angle) * radius
				const py = p.sin(angle) * radius
				
				if(i === 0) {
					p.vertex(0, 0)
				} else {
					p.curveVertex(px, py)
				}
			}
			p.endShape()
		}

		// Add some detail to the spiral
		p.noFill()
		p.stroke(p.color(0, 40))
		p.strokeWeight(s * 0.01)
		for(let arm = 0; arm < numArms; arm++) {
			p.beginShape()
			for(let i = 0; i <= points; i++) {
				const t = i / points
				const angle = p.TWO_PI * rotations * t + (p.TWO_PI / numArms) * arm
				const radius = s * (1 - t) * 0.8
				const px = p.cos(angle) * radius
				const py = p.sin(angle) * radius
				p.curveVertex(px, py)
			}
			p.endShape()
		}
		p.pop()
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const getColor = (v: number): p5.Color => {
		const value = p.abs(v)
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
		algorithmName: "eyes001/spiral",
	})
}

new p5(sketch) 