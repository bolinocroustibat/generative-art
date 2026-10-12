import p5 from "p5"

import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

type Ring = {
	sprite: p5.Graphics
	spin: number
}

// Moving version of oleone: the same oil trails, with each ring turning at its own pace
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let ready = false
	let rings: Ring[] = []

	p.setup = async (): Promise<void> => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.P2D)
		p.smooth()
		p.pixelDensity(1)
		p.frameRate(30)
		seed = p.floor(p.random(999999))
		colors = await getColorPalette()
		build()
	}

	const build = (): void => {
		ready = false
		p.randomSeed(seed)
		p.noiseSeed(seed)
		for (const ring of rings) ring.sprite.remove()

		const det = p.random(0.01)
		const des = p.random(1000)
		const cc = p.floor(p.random(20, 99))
		const da = p.TWO_PI / cc
		const max = p.floor(p.random(1, p.random(20)))
		const side = Math.ceil(Math.hypot(p.width, p.height))
		const ox = (side - p.width) / 2
		const oy = (side - p.height) / 2
		const next: Ring[] = []

		for (let k = 1; k < 8; k++) {
			const sprite = p.createGraphics(side, side)
			sprite.pixelDensity(1)
			sprite.clear()
			sprite.stroke(0)
			const ss = p.width * k * 0.1
			for (let i = 0; i < cc; i++) {
				const ang = da * i
				const xx = ox + p.width * 0.5 + p.cos(ang) * ss
				const yy = oy + p.height * 0.5 + p.sin(ang) * ss
				sprite.ellipse(xx, yy, ss * 0.02, ss * 0.02)

				let x = xx
				let y = yy
				const dif =
					ang - ((p.noise(des + x * det, des + y * det) * max) % p.TWO_PI)
				const pathColor = rcol()
				sprite.fill(p.red(pathColor), p.green(pathColor), p.blue(pathColor), 40)
				sprite.beginShape()
				for (let j = 0; j < 1200; j++) {
					const dd = dif * (1 - p.constrain(j * 0.01, 0, 1))
					const na = dd + p.noise(des + x * det, des + y * det) * max
					sprite.vertex(x, y)
					x += p.cos(na)
					y += p.sin(na)
				}
				sprite.endShape()
			}
			next.push({
				sprite,
				spin: (k - 4) * 0.08,
			})
		}

		rings = next
		ready = true
	}

	const rcol = (): p5.Color => {
		const pick = colors[p.floor(p.random(colors.length))]
		return p.color(pick ?? "#000000")
	}

	p.draw = (): void => {
		if (!ready) return
		const time = p.millis() / 1000
		p.background(255)
		p.imageMode(p.CENTER)
		p.push()
		p.translate(p.width / 2, p.height / 2)
		for (const ring of rings) {
			p.push()
			p.rotate(time * ring.spin)
			p.image(ring.sprite, 0, 0)
			p.pop()
		}
		p.pop()
		p.imageMode(p.CORNER)
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			build()
		},
		algorithmName: "oleoneMotion",
	})
}

new p5(sketch)
