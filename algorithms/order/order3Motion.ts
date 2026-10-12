import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	getRandomColor,
	setupKeyboardControls,
} from "../../helpers"

type Slab = {
	shape: "box" | "cylinder"
	horizontal: boolean
	x: number
	y: number
	size: number
	along: number
	maxHeight: number
	thickness: number
	color: p5.Color
	phase: number
}

// Moving version of order3: the same blocks, with solid heights that rise and fall
const sketch = (p: p5) => {
	let seed: number
	let colors: string[]
	let backgroundColor: p5.Color
	let baseYaw = 0
	let slabs: Slab[] = []

	p.setup = async () => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height, p.WEBGL)
		p.smooth()
		// Print-sized canvases stay playable if each pixel is drawn once
		p.pixelDensity(1)
		p.frameRate(30)
		colors = await getColorPalette()
		seed = p.floor(p.random(999999))
		build()
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			build()
		},
		algorithmName: "order3Motion",
	})

	const build = (): void => {
		backgroundColor = getRandomColor(p, colors)
		p.randomSeed(seed)
		baseYaw = -p.HALF_PI * p.random(0.5)
		slabs = []

		const rects: p5.Vector[] = []
		const initialSize = p.max(p.width, p.height) * 1.5
		rects.push(p.createVector(-initialSize, -initialSize, initialSize * 2))

		for (let i = 0; i < 100; i++) {
			const ind = p.floor(p.random(rects.length))
			const r = rects[ind]
			const ms = r.z * 0.5
			if (ms < p.max(p.width, p.height) * 0.1) continue

			rects.push(p.createVector(r.x, r.y, ms))
			rects.push(p.createVector(r.x + ms, r.y, ms))
			rects.push(p.createVector(r.x + ms, r.y + ms, ms))
			rects.push(p.createVector(r.x, r.y + ms, ms))
			rects.splice(ind, 1)
		}

		for (let i = 0; i < rects.length; i++) {
			const r = rects[i]
			const useCylinders = p.floor(p.random(4)) === 0
			if (useCylinders) {
				addRow(r, "cylinder", p.random(0.1, 1.2), p.random(0.1, 0.4))
			} else {
				addRow(r, "box", p.random(0.1, 2.5), p.random(0.1, 0.8))
			}
		}
	}

	const addRow = (
		cell: p5.Vector,
		shape: Slab["shape"],
		heightScale: number,
		thicknessScale: number,
	): void => {
		const sub = p.floor(p.random(3, 13))
		const step = cell.z / sub
		const maxHeight = step * heightScale
		const thickness = step * thicknessScale
		const horizontal = p.random(1) < 0.5

		for (let j = 0; j < sub; j++) {
			slabs.push({
				shape,
				horizontal,
				x: cell.x,
				y: cell.y,
				size: cell.z,
				along: (j + 0.5) * step,
				maxHeight,
				thickness,
				color: getRandomColor(p, colors),
				phase: p.random(p.TWO_PI),
			})
		}
	}

	const drawSlab = (slab: Slab, height: number, filled: boolean): void => {
		p.push()
		p.translate(slab.x, slab.y)
		if (slab.horizontal) {
			p.translate(slab.along, slab.size * 0.5, height * 0.5)
		} else {
			p.translate(slab.size * 0.5, slab.along, height * 0.5)
		}

		if (slab.shape === "cylinder") {
			p.rotateX(p.HALF_PI)
		}

		if (filled) {
			p.noStroke()
			p.fill(slab.color)
		} else {
			p.stroke(slab.color)
			p.noFill()
		}

		if (slab.shape === "cylinder") {
			p.cylinder(slab.thickness, height, 16)
		} else if (slab.horizontal) {
			p.box(slab.thickness, slab.size, height)
		} else {
			p.box(slab.size, slab.thickness, height)
		}
		p.pop()
	}

	p.draw = (): void => {
		if (!backgroundColor) return

		const time = p.millis() / 1000

		p.background(backgroundColor)
		p.ambientLight(240, 240, 240)
		p.directionalLight(20, 20, 20, 0, 1, 0)
		p.directionalLight(10, 10, 20, -1, 0, 0)
		p.noStroke()

		const zoom = 1.2
		p.ortho(
			(-p.width / 2) * zoom,
			(p.width / 2) * zoom,
			(-p.height / 2) * zoom,
			(p.height / 2) * zoom,
			0,
			p.max(p.width, p.height) * 4,
		)

		const cameraDistance = p.max(p.width, p.height) * 1.5
		p.translate(0, -p.height * 0.25, -cameraDistance)
		p.rotateX(p.HALF_PI - p.atan(1 / p.sqrt(2)))
		p.rotateZ(baseYaw + Math.sin(time * 0.22) * 0.2)

		for (let i = 0; i < slabs.length; i++) {
			const slab = slabs[i]
			const wave = Math.sin(
				time * 0.7 + slab.phase + (slab.x + slab.y) * 0.00035,
			)
			const amount = 0.06 + 0.94 * (0.5 + 0.5 * wave)
			drawSlab(slab, slab.maxHeight * amount, true)
			drawSlab(slab, slab.maxHeight, false)
		}
	}
}

new p5(sketch)
