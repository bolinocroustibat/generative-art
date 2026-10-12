import p5 from "p5"

import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

type Nest = {
	s: number
	color: p5.Color
}

type Shade = {
	a0: number
	a1: number
	a2: number
}

type HexCell = {
	x: number
	y: number
	nest: Nest[]
	shades?: Shade[]
	spin: number
}

// Moving version of hexa: the same hex tiles, with each nest slowly turning
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let ready = false
	let cells: HexCell[] = []

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
		p.randomSeed(seed)
		const unit = p.min(p.width, p.height)
		const ss = p.random(unit * 0.08, unit * 0.33)
		const dx = ss * 2 * (3 / 4)
		const dy = (Math.sqrt(3) * ss) / 4
		const cw = p.int(p.width / dx) + 2
		const ch = p.int(p.height / dy) + 2
		const next: HexCell[] = []
		let index = 0
		for (let j = -p.int(ch / 2); j <= ch / 2; j++) {
			for (let i = -p.int(cw / 2); i <= cw / 2; i++) {
				const x = (j % 2 === 0 ? i : i + 0.5) * dx
				const y = j * dy
				next.push({
					x: x - dx * 0.5,
					y: y - dy,
					nest: makeNest(ss * p.random(0.6)),
					spin: (index % 5) - 2,
				})
				index++
				next.push({
					x,
					y,
					nest: makeNest(ss),
					shades: makeShades(),
					spin: (index % 5) - 2,
				})
				index++
			}
		}
		cells = next
		ready = true
	}

	const makeNest = (start: number): Nest[] => {
		const nest: Nest[] = []
		let s = start
		for (let k = 0; k < 100 && s > 1; k++) {
			nest.push({ s, color: rcol() })
			s *= p.random(p.random(0.95, 1))
		}
		return nest
	}

	const makeShades = (): Shade[] => {
		const shades: Shade[] = []
		for (let i = 0; i < 6; i++) {
			shades.push({
				a0: p.random(120),
				a1: p.random(120),
				a2: p.random(120),
			})
		}
		return shades
	}

	const hex = (x: number, y: number, s: number): void => {
		const r = s * 0.5
		const da = p.TWO_PI / 6
		p.beginShape()
		for (let i = 0; i < 6; i++) {
			const ang = da * i
			p.vertex(x + p.cos(ang) * r, y + p.sin(ang) * r)
		}
		p.endShape(p.CLOSE)
	}

	const hexTri = (x: number, y: number, s: number, shades: Shade[]): void => {
		const r = s * 0.5
		const da = p.TWO_PI / 6
		for (let i = 0; i < 6; i++) {
			const ang = da * i
			const ang2 = da * (i + 1)
			const shade = shades[i]
			if (!shade) continue
			p.beginShape()
			p.fill(0, shade.a0)
			p.vertex(x, y)
			p.fill(0, shade.a1)
			p.vertex(x + p.cos(ang) * r, y + p.sin(ang) * r)
			p.fill(0, shade.a2)
			p.vertex(x + p.cos(ang2) * r, y + p.sin(ang2) * r)
			p.endShape(p.CLOSE)
		}
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	p.draw = (): void => {
		if (!ready) return
		const time = p.millis() / 1000
		p.background("#1E211C")
		p.noStroke()
		p.push()
		p.translate(p.width / 2, p.height / 2)
		for (const cell of cells) {
			p.push()
			p.translate(cell.x, cell.y)
			p.rotate(time * cell.spin * 0.25)
			for (const nest of cell.nest) {
				p.fill(nest.color)
				hex(0, 0, nest.s)
			}
			const first = cell.nest[0]
			if (cell.shades && first) {
				hexTri(0, 0, first.s, cell.shades)
			}
			p.pop()
		}
		p.pop()
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			build()
		},
		algorithmName: "hexaMotion",
	})
}

new p5(sketch)
