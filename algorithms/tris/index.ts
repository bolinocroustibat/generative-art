import p5 from "p5"

import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"
import { Form } from "./form.ts"

const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []

	p.setup = async (): Promise<void> => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.P2D)
		p.smooth()
		p.pixelDensity(2)
		p.noiseDetail(1, 0.5)
		seed = p.floor(p.random(999999))
		colors = await getColorPalette()
		generate()
	}

	p.draw = (): void => {}

	const generate = (): void => {
		const time = p.millis() * 0.001
		p.background(20)
		p.randomSeed(seed)
		p.noiseSeed(seed)

		const forms: Form[] = []
		const root = new Form(p, rcol())
		root.addPoint(p.createVector(0, 0))
		root.addPoint(p.createVector(p.width, 0))
		root.addPoint(p.createVector(p.width, p.height))
		root.addPoint(p.createVector(0, p.height))
		forms.push(root)

		const sub1 = p.int(p.random(10))
		for (let i = 0; i < sub1; i++) {
			const ind = p.int(p.random(forms.length * p.random(0.5)))
			const current = forms[ind]
			if (!current) continue
			forms.push(...current.subRect(time, rcol))
			forms.splice(ind, 1)
		}

		const sub2 = p.int(p.random(p.random(200)))
		for (let i = 0; i < sub2; i++) {
			const ind = p.int(p.random(forms.length * p.random(0.5)))
			const current = forms[ind]
			if (!current) continue
			forms.push(...current.sub(time, rcol))
			forms.splice(ind, 1)
		}

		p.stroke(80, 5)
		for (const form of forms) {
			form.show(time)
		}
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "tris",
	})
}

new p5(sketch)
