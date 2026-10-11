import p5 from "p5"
import {
	getCanvasDimensions,
	getColorPalette,
	setupKeyboardControls,
} from "../../helpers/index.ts"

type Drop = {
	x: number
	y: number
	vx: number
	vy: number
	sprite: p5.Graphics
}

type Burst = {
	angle: number
	distance: number
	spin: number
	sprite: p5.Graphics
}

// Moving version of gotas: the drops drift, and the bursts orbit and spin
const sketch = (p: p5) => {
	let seed: number
	let colors: string[] = []
	let ready = false
	let drops: Drop[] = []
	let bursts: Burst[] = []

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
		for (const drop of drops) drop.sprite.remove()
		for (const burst of bursts) burst.sprite.remove()

		const unit = p.min(p.width, p.height)
		const nextDrops: Drop[] = []
		for (let i = 0; i < 100; i++) {
			const x = p.random(p.width)
			const y = p.random(p.height)
			const s = unit * p.random(0.4)
			const heading = i * 2.399963
			const speed = 18 + (i % 5) * 10
			nextDrops.push({
				x,
				y,
				vx: p.cos(heading) * speed,
				vy: p.sin(heading) * speed,
				sprite: bakeDrop(s, rcol(), rcol()),
			})
		}
		drops = nextDrops

		const next: Burst[] = []
		const sub = p.int(p.random(1, 3))
		const div = p.int(p.random(50))
		let index = 0
		for (let j = 0; j < div; j++) {
			const ang = p.map(j, 0, div, 0, p.TWO_PI)
			for (let i = 0; i < sub; i++) {
				const dis = p.map(i, 0, sub, 0.1, 0.8) * unit
				const sprite = bakeCircle(p.random(0.05, 0.33) * unit)
				next.push({
					angle: ang,
					distance: dis,
					spin: (index % 5) - 2,
					sprite,
				})
				index++
			}
		}

		bursts = next
		ready = true
	}

	const bakeDrop = (s: number, fill: p5.Color, glow: p5.Color): p5.Graphics => {
		const radius = s * 0.9 + 2
		const side = Math.max(2, Math.ceil(radius * 2))
		const sprite = p.createGraphics(side, side)
		sprite.pixelDensity(1)
		sprite.clear()
		const center = side / 2
		sprite.stroke(0)
		sprite.fill(fill)
		sprite.ellipse(center, center, s, s)
		arc2(sprite, center, center, s, s * 1.8, 0, p.TWO_PI, glow, 80, 0)
		return sprite
	}

	const bakeCircle = (s: number): p5.Graphics => {
		const cs = p.int(p.random(0, 50))
		const amp = p.random(1)
		const ia = p.random(p.TWO_PI)
		const sub = p.int(p.random(10))
		const div = p.int(p.random(30))
		type Speck = {
			ang: number
			dis: number
			ss: number
			a2: number
			glow: p5.Color
			fill: p5.Color
			alpha: number
		}
		const specks: Speck[] = []
		let maxR = 8
		for (let j = 0; j < div; j++) {
			const ang = ia + p.map(j, 0, div, 0, p.TWO_PI)
			for (let i = 0; i < sub; i++) {
				const dis = p.map(i, 0, sub, 0.1, p.cos(ang * cs) * (0.2 + amp)) * s
				const ss = p.random(4) * p.random(1)
				const a2 = p.random(60) * p.random(1)
				const glow = rcol()
				const fill = rcol()
				const alpha = p.random(250)
				specks.push({ ang, dis, ss, a2, glow, fill, alpha })
				maxR = Math.max(maxR, Math.abs(dis) + Math.abs(ss * a2) * 0.95 + 2)
			}
		}

		const side = Math.ceil(maxR * 2)
		const sprite = p.createGraphics(side, side)
		sprite.pixelDensity(1)
		sprite.clear()
		for (const speck of specks) {
			const xx = maxR + p.cos(speck.ang) * speck.dis
			const yy = maxR + p.sin(speck.ang) * speck.dis
			arc2(
				sprite,
				xx,
				yy,
				speck.ss * speck.a2,
				speck.ss * speck.a2 * 1.8,
				0,
				p.TWO_PI,
				speck.glow,
				80,
				0,
			)
			sprite.stroke(0)
			sprite.fill(
				p.red(speck.fill),
				p.green(speck.fill),
				p.blue(speck.fill),
				speck.alpha,
			)
			sprite.ellipse(xx, yy, speck.ss, speck.ss)
			sprite.ellipse(xx, yy, speck.ss * speck.a2, speck.ss * speck.a2)
		}
		return sprite
	}

	const arc2 = (
		g: p5.Graphics,
		x: number,
		y: number,
		s1: number,
		s2: number,
		a1: number,
		a2: number,
		col: p5.Color,
		shd1: number,
		shd2: number,
	): void => {
		const r1 = s1 * 0.5
		const r2 = s2 * 0.5
		const amp = a2 - a1
		if (amp <= 0) return
		const outer = Math.max(Math.abs(r1), Math.abs(r2))
		if (outer < 0.4) return
		const cover = Math.min(1, amp / p.TWO_PI)
		const angular = Math.max(1, Math.min(36, Math.ceil(outer * cover * 0.28)))
		const radial = Math.max(1, Math.min(5, Math.ceil(Math.abs(r2 - r1) / 10)))
		const da = amp / angular
		const red = p.red(col)
		const green = p.green(col)
		const blue = p.blue(col)
		g.noStroke()
		for (let band = 0; band < radial; band++) {
			const t0 = band / radial
			const t1 = (band + 1) / radial
			g.fill(red, green, blue, p.lerp(shd1, shd2, (t0 + t1) / 2))
			const ra = p.lerp(r1, r2, t0)
			const rb = p.lerp(r1, r2, t1)
			for (let i = 0; i < angular; i++) {
				const ang = a1 + da * i
				const c0 = p.cos(ang)
				const s0 = p.sin(ang)
				const c1 = p.cos(ang + da)
				const s1 = p.sin(ang + da)
				g.beginShape()
				g.vertex(x + c0 * ra, y + s0 * ra)
				g.vertex(x + c1 * ra, y + s1 * ra)
				g.vertex(x + c1 * rb, y + s1 * rb)
				g.vertex(x + c0 * rb, y + s0 * rb)
				g.endShape(p.CLOSE)
			}
		}
	}

	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const wrap = (value: number, limit: number, size: number): number => {
		const span = limit + size
		const shifted = value + size / 2
		const wrapped = ((shifted % span) + span) % span
		return wrapped - size / 2
	}

	p.draw = (): void => {
		if (!ready) return
		const time = p.millis() / 1000
		p.background(0)
		p.imageMode(p.CENTER)
		for (const drop of drops) {
			p.image(
				drop.sprite,
				wrap(drop.x + drop.vx * time, p.width, drop.sprite.width),
				wrap(drop.y + drop.vy * time, p.height, drop.sprite.height),
			)
		}
		for (const burst of bursts) {
			const ang = burst.angle + time * 0.12
			const x = p.width * 0.5 + p.cos(ang) * burst.distance
			const y = p.height * 0.5 + p.sin(ang) * burst.distance
			p.push()
			p.translate(x, y)
			p.rotate(time * burst.spin * 0.4)
			p.image(burst.sprite, 0, 0)
			p.pop()
		}
	}

	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			build()
		},
		algorithmName: "gotasMotion",
	})
}

new p5(sketch)
