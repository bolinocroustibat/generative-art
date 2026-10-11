import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"
import {
	buildCluster,
	type CandyCluster,
	cssColor,
	packCircles,
	paintCluster,
	sameColor,
} from "./circles.ts"

const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let clusters: CandyCluster[] = []
	let shadow = ""
	let cursor = 0

	p.setup = async (): Promise<void> => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.P2D)
		p.smooth()
		p.pixelDensity(2)
		seed = p.floor(p.random(999999))
		colors = await getColorPalette()
		prepare()
	}

	p.draw = (): void => {
		if (cursor >= clusters.length) return
		p.resetMatrix()
		const ctx = p.drawingContext as CanvasRenderingContext2D
		const end = Math.min(clusters.length, cursor + 350)
		for (let i = cursor; i < end; i++) {
			paintCluster(ctx, clusters[i], shadow, true)
		}
		cursor = end
	}

	const prepare = (): void => {
		p.randomSeed(seed)
		const back = rcol()
		let colo = rcol()
		let guard = 0
		while (sameColor(colo, back) && guard < 12) {
			colo = rcol()
			guard++
		}
		shadow = cssColor(p, p.lerpColor(back, p.color(0), 0.05), 120)
		p.background(back)
		clusters = packCircles(p).map((circle) => buildCluster(p, circle, rcol))
		cursor = 0
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			prepare()
		},
		algorithmName: "candy",
	})
}

new p5(sketch)
