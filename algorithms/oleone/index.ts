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
		p.createCanvas(dimensions.width, dimensions.height, p.P2D)
		p.smooth()
		p.pixelDensity(2)
		seed = p.floor(p.random(999999))
		colors = await getColorPalette()
		generate()
	}

	const generate = (): void => {
		p.randomSeed(seed)
		p.noiseSeed(seed)
		p.background(255)

		p.stroke(0)

		const det = p.random(0.01)
		const des = p.random(1000)

		const cc = p.floor(p.random(20, 99))
		const da = p.TWO_PI / cc
		const max = p.floor(p.random(1, p.random(20)))

		// Draw concentric circles with trailing paths
		for (let k = 1; k < 8; k++) {
			const ss = p.width * k * 0.1
			for (let i = 0; i < cc; i++) {
				const ang = da * i
				const xx = p.width * 0.5 + p.cos(ang) * ss
				const yy = p.height * 0.5 + p.sin(ang) * ss
				p.ellipse(xx, yy, ss * 0.02, ss * 0.02)

				let x = xx
				let y = yy
				const dif = ang - (p.noise(des + x * det, des + y * det) * max) % p.TWO_PI

				const pathColor = rcol()
				p.fill(p.red(pathColor), p.green(pathColor), p.blue(pathColor), 40)
				p.beginShape()
				for (let j = 0; j < 1200; j++) {
					const dd = dif * (1 - p.constrain(j * 0.01, 0, 1))
					const na = dd + p.noise(des + x * det, des + y * det) * max
					p.vertex(x, y)
					x += p.cos(na)
					y += p.sin(na)
				}
				p.endShape()
			}
		}
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
		algorithmName: "oleone",
	})
}

new p5(sketch)
