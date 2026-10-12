import p5 from "p5"

import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"
import { Form } from "./form.ts"

// Moving version of tris: the same shards, with the dark wash sliding around each face
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let ready = false
	let forms: Form[] = []

	p.setup = async (): Promise<void> => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.P2D)
		p.smooth()
		p.pixelDensity(1)
		p.frameRate(30)
		p.noiseDetail(1, 0.5)
		seed = p.floor(p.random(999999))
		colors = await getColorPalette()
		build()
	}

	const build = (): void => {
		ready = false
		p.randomSeed(seed)
		p.noiseSeed(seed)
		const time = seed * 0.001

		const next: Form[] = []
		const root = new Form(p, rcol())
		root.addPoint(p.createVector(0, 0))
		root.addPoint(p.createVector(p.width, 0))
		root.addPoint(p.createVector(p.width, p.height))
		root.addPoint(p.createVector(0, p.height))
		next.push(root)

		const sub1 = p.int(p.random(10))
		for (let i = 0; i < sub1; i++) {
			const ind = p.int(p.random(next.length * p.random(0.5)))
			const current = next[ind]
			if (!current) continue
			next.push(...current.subRect(time, rcol))
			next.splice(ind, 1)
		}

		const sub2 = p.int(p.random(p.random(200)))
		for (let i = 0; i < sub2; i++) {
			const ind = p.int(p.random(next.length * p.random(0.5)))
			const current = next[ind]
			if (!current) continue
			next.push(...current.sub(time, rcol))
			next.splice(ind, 1)
		}

		forms = next
		ready = true
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	p.draw = (): void => {
		if (!ready) return
		const time = p.millis() * 0.001
		p.background(20)
		p.stroke(80, 5)
		for (const form of forms) {
			form.show(time)
		}
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			build()
		},
		algorithmName: "trisMotion",
	})
}

new p5(sketch)
