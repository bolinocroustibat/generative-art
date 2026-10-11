import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"
import {
	buildCluster,
	type CandyCluster,
	circleCenter,
	cssColor,
	packCircles,
	paintCluster,
	paintSpecks,
	sameColor,
} from "./circles.ts"

type Sprite = {
	canvas: HTMLCanvasElement
	pivot: number
	cx: number
	cy: number
	rot: number
	spin: number
}

// Moving version of candy: the same circles, with speckles turning inside them
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let ready = false
	let base: HTMLCanvasElement | null = null
	let sprites: Sprite[] = []

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
		const backgroundColor = rcol()
		let colo = rcol()
		let guard = 0
		while (sameColor(colo, backgroundColor) && guard < 12) {
			colo = rcol()
			guard++
		}
		const shadow = cssColor(
			p,
			p.lerpColor(backgroundColor, p.color(0), 0.05),
			120,
		)
		const density = p.pixelDensity()
		const layer = document.createElement("canvas")
		layer.width = Math.floor(p.width * density)
		layer.height = Math.floor(p.height * density)
		const layerCtx = layer.getContext("2d")
		if (!layerCtx) return
		layerCtx.setTransform(density, 0, 0, density, 0, 0)
		layerCtx.fillStyle = cssColor(p, backgroundColor)
		layerCtx.fillRect(0, 0, p.width, p.height)

		const minSpin = Math.max(14, p.width * 0.014)
		const nextSprites: Sprite[] = []
		const placed = packCircles(p)
		for (let i = 0; i < placed.length; i++) {
			const cluster = buildCluster(p, placed[i], rcol)
			const spins = cluster.s >= minSpin && cluster.specks.length > 0
			paintCluster(layerCtx, cluster, shadow, !spins)
			if (spins) {
				const sprite = bakeSpecks(cluster, i)
				if (sprite) nextSprites.push(sprite)
			}
		}
		base = layer
		sprites = nextSprites
		ready = true
	}

	const bakeSpecks = (cluster: CandyCluster, index: number): Sprite | null => {
		let reach = 1
		for (const speck of cluster.specks) {
			const radius = speck.des + speck.ss * 0.55
			if (radius > reach) reach = radius
		}
		const size = Math.ceil(reach * 2 + 2)
		const canvas = document.createElement("canvas")
		canvas.width = size
		canvas.height = size
		const ctx = canvas.getContext("2d")
		if (!ctx) return null
		const pivot = size / 2
		ctx.translate(pivot, pivot)
		paintSpecks(ctx, cluster)
		const center = circleCenter(cluster)
		return {
			canvas,
			pivot,
			cx: center.x,
			cy: center.y,
			rot: cluster.rot,
			spin: (index % 2 === 0 ? 1 : -1) * (0.35 + (index % 5) * 0.1),
		}
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	p.draw = (): void => {
		if (!ready || !base) return
		const time = p.millis() / 1000
		const ctx = p.drawingContext as CanvasRenderingContext2D
		const density = p.pixelDensity()
		ctx.save()
		ctx.setTransform(density, 0, 0, density, 0, 0)
		ctx.drawImage(base, 0, 0, p.width, p.height)
		for (const sprite of sprites) {
			ctx.save()
			ctx.translate(sprite.cx, sprite.cy)
			ctx.rotate(sprite.rot + time * sprite.spin)
			ctx.drawImage(sprite.canvas, -sprite.pivot, -sprite.pivot)
			ctx.restore()
		}
		ctx.restore()
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			build()
		},
		algorithmName: "candyMotion",
	})
}

new p5(sketch)
