import p5 from "p5"
import { getColorPalette, getCanvasDimensions, setupKeyboardControls } from "../../helpers/index.ts"

// Create a p5.js sketch in instance mode
const sketch = (p: p5) => {
	let seed: number
	const colors: string[] = getColorPalette()

	// Rect class equivalent to the Processing version
	class Rect {
		x: number
		y: number
		w: number
		h: number

		constructor(x: number, y: number, w: number, h: number) {
			this.x = x
			this.y = y
			this.w = w
			this.h = h
		}
	}

	p.setup = (): void => {
		const dimensions = getCanvasDimensions(p)
		p.createCanvas(dimensions.width, dimensions.height)
		p.pixelDensity(2)
		seed = p.floor(p.random(999999)) // Initialize seed
		generate()
	}

	p.draw = (): void => {
		// This is intentionally empty as we're using generate() for drawing
		// Original comment: //if (frameCount%60 == 0) generate();
	}

	const generate = (): void => {
		p.randomSeed(seed)
		p.background(rcol())

		p.rectMode(p.CENTER)
		const sc1 = rcol()
		const sc2 = rcol()
		const sc3 = rcol()
		const ss = p.width / 24
		const cc = p.floor(p.width * 1.0 / ss)

		p.noStroke()
		// Create a color with alpha
		const fillColor = rcol()
		fillColor.setAlpha(30)
		p.fill(fillColor)
		
		for (let j = 0; j <= cc * 2; j++) {
			for (let i = 0; i <= cc * 2; i++) {
				const xx = i * ss * 0.5
				const yy = j * ss * 0.5

				p.rect(xx, yy, 3, 3)
				p.rect(xx, yy, 1, 1)
				p.rect(xx + ss * 0.25, yy + ss * 0.25, 1, 1)
			}
		}

		for (let j = 0; j < cc - 1; j++) {
			for (let i = 0; i < cc - 1; i++) {
				const xx = (i + 1) * ss
				const yy = (j + 1) * ss
				p.noFill()
				
				// Create colors with alpha
				const strokeColor1 = p.color(sc1.toString())
				strokeColor1.setAlpha(30)
				p.stroke(strokeColor1)
				p.rect(xx, yy, ss, ss)
				
				const strokeColor2 = p.color(sc2.toString())
				strokeColor2.setAlpha(30)
				p.stroke(strokeColor2)
				p.rect(xx, yy, ss * 0.9, ss * 0.9)
				
				p.noStroke()
				const fillColor3 = p.color(sc3.toString())
				fillColor3.setAlpha(200)
				p.fill(fillColor3)
				// Original comment: //rect(xx, yy, ss*0.05, ss*0.05);

				/* Original commented code:
				fill(sc3, 80);
				textFont(font);
				textAlign(CENTER, CENTER);
				text(str(i)+"x"+str(j), int(xx), int(yy-1));
				*/
			}
		}

		const rects: Rect[] = []
		rects.push(new Rect(ss * 0.5, ss * 0.5, p.width - ss + 1, p.height - ss + 1))

		const subh = p.floor(p.random(1, 50))
		for (let i = 0; i < subh; i++) {
			const ind = p.floor(p.random(rects.length))
			const r = rects[ind]

			const nh = p.floor(p.random(1, r.h / ss)) * ss

			if (r.h - nh > ss) {
				rects.push(new Rect(r.x, r.y, r.w, nh))
				rects.push(new Rect(r.x, r.y + nh, r.w, r.h - nh))
				rects.splice(ind, 1)
			}
		}

		const subw = p.floor(p.random(1, 100))
		for (let j = 0; j < subw; j++) {
			const ind = p.floor(p.random(rects.length))
			const r = rects[ind]
			const nw = p.floor(p.random(1, r.w / ss)) * ss

			if (r.w - nw > ss) {
				rects.push(new Rect(r.x, r.y, nw, r.h))
				rects.push(new Rect(r.x + nw, r.y, r.w - nw, r.h))
				rects.splice(ind, 1)
			}
		}

		for (let k = 0; k < rects.length; k++) {
			const r = rects[k]
			const w = r.w
			const h = r.h
			const x = r.x
			const y = r.y
			
			// Create a color with alpha
			const borderColor = rcol()
			borderColor.setAlpha(180)
			p.fill(borderColor)
			
			p.rectMode(p.CORNER)
			const s = 1
			p.rect(x, y, w, s)
			p.rect(x, y + s, s, h - s)
			p.rect(x + w - s, y + s, s, h - s)
			p.rect(x + s, y + h - s, w - s * 2, s)

			const rnd = 0 // Original comment: //int(random(2));
			p.rectMode(p.CENTER)
			if (rnd === 0) {
				const sca = p.floor(p.pow(2, p.floor(p.random(0, 4))))
				const cw = p.floor(w * sca / ss)
				const ch = p.floor(h * sca / ss)
				const sss = ss / sca
				for (let j = 0; j < ch; j++) {
					for (let i = 0; i < cw; i++) {
						p.fill(getColor())
						const xx = x + (i + 0.5) * sss
						const yy = y + (j + 0.5) * sss
						p.rect(xx, yy, sss * 0.8, sss * 0.8)
						if (p.random(1) < 0.2) {
							const amp = p.random(0.5)
							p.fill(getColor())
							let cor = 0.5
							if (sss < 10) cor = 0.0
							p.rect(xx - cor, yy - cor, sss * 0.8 * amp, sss * 0.8 * amp)
						}
					}
				}
			}
		}
	}

	// Color utility functions
	const rcol = (): p5.Color => {
		return p.color(colors[p.floor(p.random(colors.length))])
	}

	const getColor = (v?: number): p5.Color => {
		if (v === undefined) {
			return getColor(p.random(colors.length))
		}
		const value = p.abs(v)
		const normalizedValue = value % colors.length
		const c1 = p.color(colors[p.floor(normalizedValue % colors.length)])
		const c2 = p.color(colors[p.floor((normalizedValue + 1) % colors.length)])
		return p.lerpColor(c1, c2, normalizedValue % 1)
	}

	// Set up keyboard controls
	p.keyPressed = setupKeyboardControls(p, {
		generateFn: () => {
			seed = p.floor(p.random(999999))
			generate()
		},
		algorithmName: "azulejos"
	})
}

// Create a new p5 instance with the sketch
new p5(sketch) 