import type p5 from "p5"

export type Circle = { x: number; y: number; s: number }

export type Speck = { ang: number; des: number; ss: number }

export type CandyCluster = {
	x: number
	y: number
	s: number
	dd: number
	rot: number
	body: string
	speck: string
	dark: string
	specks: Speck[]
}

// Rejection sampling stays at 200000 attempts. A grid replaces the full scan,
// which was freezing the page before anything could paint.
export const packCircles = (p: p5): Circle[] => {
	const placed: Circle[] = []
	const cell = Math.max(24, p.width * 0.04)
	const cols = Math.max(1, Math.ceil(p.width / cell))
	const rows = Math.max(1, Math.ceil(p.height / cell))
	const grid: Circle[][] = Array.from({ length: cols * rows }, () => [])
	const large: Circle[] = []

	const hits = (x: number, y: number, s: number, other: Circle): boolean => {
		const minDist = (other.s + s) * 0.48
		const dx = x - other.x
		const dy = y - other.y
		return dx * dx + dy * dy < minDist * minDist
	}

	for (let i = 0; i < 200000; i++) {
		const x = p.random(p.width)
		const y = p.random(p.height)
		const s = p.width * p.random(0.3) * p.random(1)
		let add = true
		for (const other of large) {
			if (hits(x, y, s, other)) {
				add = false
				break
			}
		}
		if (add) {
			const radius = Math.ceil(((cell + s) * 0.48) / cell)
			const c = Math.floor(x / cell)
			const r = Math.floor(y / cell)
			for (let rr = r - radius; rr <= r + radius && add; rr++) {
				if (rr < 0 || rr >= rows) continue
				for (let cc = c - radius; cc <= c + radius; cc++) {
					if (cc < 0 || cc >= cols) continue
					for (const other of grid[rr * cols + cc]) {
						if (hits(x, y, s, other)) {
							add = false
							break
						}
					}
					if (!add) break
				}
			}
		}
		if (!add) continue
		const circle = { x, y, s }
		placed.push(circle)
		if (s > cell) large.push(circle)
		else {
			const c = Math.min(cols - 1, Math.max(0, Math.floor(x / cell)))
			const r = Math.min(rows - 1, Math.max(0, Math.floor(y / cell)))
			grid[r * cols + c].push(circle)
		}
	}
	return placed
}

export const cssColor = (
	p: p5,
	color: p5.Color,
	alpha = p.alpha(color),
): string => {
	return `rgba(${p.red(color)},${p.green(color)},${p.blue(color)},${alpha / 255})`
}

export const sameColor = (a: p5.Color, b: p5.Color): boolean => {
	return a.toString() === b.toString()
}

export const buildCluster = (
	p: p5,
	circle: Circle,
	rcol: () => p5.Color,
): CandyCluster => {
	const { x, y, s } = circle
	const dd = s * 0.1
	const c1 = rcol()
	let c2 = rcol()
	let guard = 0
	while (sameColor(c1, c2) && guard < 12) {
		c2 = rcol()
		guard++
	}
	const specks: Speck[] = []
	for (let j = 0; j < 100; j++) {
		const ang = p.random(p.TWO_PI)
		const ss = s * p.random(0.08, 0.12)
		const ratio = p.random(p.PI)
		if (ratio > 1 || ss < 0.6) continue
		specks.push({
			ang,
			des: Math.acos(ratio) * (s - ss) * 0.33,
			ss,
		})
	}
	return {
		x,
		y,
		s,
		dd,
		rot: p.random(p.TWO_PI),
		body: cssColor(p, c1),
		speck: cssColor(p, c2),
		dark: cssColor(p, p.lerpColor(c1, p.color(0, 5, 10), 0.05)),
		specks,
	}
}

const fillDisc = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	diameter: number,
): void => {
	if (diameter < 0.5) return
	ctx.beginPath()
	ctx.arc(x, y, diameter * 0.5, 0, Math.PI * 2)
	ctx.fill()
}

export const paintCluster = (
	ctx: CanvasRenderingContext2D,
	cluster: CandyCluster,
	shadow: string,
	withSpecks: boolean,
): void => {
	if (cluster.s < 0.75) return
	ctx.save()
	ctx.translate(cluster.x - cluster.dd, cluster.y - cluster.dd)
	ctx.rotate(cluster.rot)
	ctx.fillStyle = shadow
	fillDisc(ctx, 0, 0, cluster.s)
	ctx.translate(cluster.dd, cluster.dd)
	ctx.fillStyle = cluster.body
	fillDisc(ctx, 0, 0, cluster.s)
	if (withSpecks) paintSpecks(ctx, cluster)
	ctx.restore()
}

export const paintSpecks = (
	ctx: CanvasRenderingContext2D,
	cluster: CandyCluster,
): void => {
	for (const speck of cluster.specks) {
		const px = Math.cos(speck.ang) * speck.des
		const py = Math.sin(speck.ang) * speck.des
		ctx.fillStyle = cluster.dark
		fillDisc(ctx, px - speck.ss * 0.03, py - speck.ss * 0.03, speck.ss)
		ctx.fillStyle = cluster.speck
		fillDisc(ctx, px, py, speck.ss)
	}
}

export const circleCenter = (
	cluster: CandyCluster,
): { x: number; y: number } => {
	const ox = cluster.x - cluster.dd
	const oy = cluster.y - cluster.dd
	const cos = Math.cos(cluster.rot)
	const sin = Math.sin(cluster.rot)
	return {
		x: ox + cluster.dd * cos - cluster.dd * sin,
		y: oy + cluster.dd * sin + cluster.dd * cos,
	}
}
