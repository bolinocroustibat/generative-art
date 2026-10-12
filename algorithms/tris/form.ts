import type p5 from "p5"

export class Form {
	points: p5.Vector[] = []
	center: p5.Vector
	fill: p5.Color

	constructor(
		private readonly p: p5,
		fill: p5.Color,
	) {
		this.center = p.createVector(0, 0)
		this.fill = fill
	}

	addPoint(point: p5.Vector): void {
		this.points.push(point)
		this.calculateCenter()
	}

	show(time: number): void {
		const { p } = this
		p.beginShape()
		p.fill(this.fill)
		for (const point of this.points) {
			p.vertex(point.x, point.y)
		}
		p.endShape(p.CLOSE)
		p.beginShape()
		for (const point of this.points) {
			const ang =
				(p.atan2(point.y - this.center.y, point.x - this.center.x) + p.TWO_PI) %
				p.TWO_PI
			const val = p.map(p.cos(ang * 10 + time * 2), -1, 1, 0, 60)
			p.fill(0, val)
			p.vertex(point.x, point.y)
		}
		p.endShape(p.CLOSE)
	}

	calculateCenter(): void {
		this.center = this.p.createVector(0, 0)
		for (const point of this.points) {
			this.center.add(point)
		}
		this.center.div(this.points.length)
	}

	randCenter(time: number): p5.Vector {
		const { p } = this
		const ind = p.random(this.points.length)
		const mix = ind % 1
		const i1 = p.int(ind)
		const i2 = (i1 + 1) % this.points.length
		const nx = p.noise(i1, i2, time * p.random(2))
		const ny = p.noise(i2, i1, time * p.random(2))
		const p1 = this.points[i1]
		const p2 = this.points[i2]
		if (!p1 || !p2) return this.center.copy()
		const m1 = nx * p.random(0.5, 1)
		const m2 = ny * p.random(0.5, 1)
		const a = p.createVector(
			p.lerp(this.center.x, p1.x, m1),
			p.lerp(this.center.y, p1.y, m1),
		)
		const b = p.createVector(
			p.lerp(this.center.x, p2.x, m2),
			p.lerp(this.center.y, p2.y, m2),
		)
		return p.createVector(p.lerp(a.x, b.x, mix), p.lerp(a.y, b.y, mix))
	}

	sub(time: number, colorFn: () => p5.Color): Form[] {
		const next: Form[] = []
		const np = this.randCenter(time)
		for (let i = 0; i < this.points.length; i++) {
			const form = new Form(this.p, colorFn())
			form.addPoint(np.copy())
			const a = this.points[i]
			const b = this.points[(i + 1) % this.points.length]
			if (!a || !b) continue
			form.addPoint(a.copy())
			form.addPoint(b.copy())
			next.push(form)
		}
		return next
	}

	subRect(time: number, colorFn: () => p5.Color): Form[] {
		const { p } = this
		const next: Form[] = []
		const np = this.randCenter(time)
		const aux: p5.Vector[] = []
		for (let i = 0; i < this.points.length; i++) {
			const p1 = this.points[i]
			const p2 = this.points[(i + 1) % this.points.length]
			if (!p1 || !p2) continue
			const mix = p.random(0.4, 0.6)
			aux.push(p1.copy())
			aux.push(p.createVector(p.lerp(p1.x, p2.x, mix), p.lerp(p1.y, p2.y, mix)))
		}
		for (let i = 0; i < aux.length; i += 2) {
			const mid = aux[i]
			const prev = aux[(i - 1 + aux.length) % aux.length]
			const nxt = aux[(i + 1) % aux.length]
			if (!mid || !prev || !nxt) continue
			const form = new Form(p, colorFn())
			form.addPoint(np.copy())
			form.addPoint(prev.copy())
			form.addPoint(mid.copy())
			form.addPoint(nxt.copy())
			next.push(form)
		}
		return next
	}
}
