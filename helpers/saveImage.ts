import type p5 from "p5"

/**
 * Saves the current canvas as a PNG image with a timestamp filename
 * @param p - The p5 instance
 * @returns void
 */
export const saveImage = (p: p5): void => {
	const timestamp =
		p.year() +
		p.nf(p.month(), 2) +
		p.nf(p.day(), 2) +
		"-" +
		p.nf(p.hour(), 2) +
		p.nf(p.minute(), 2) +
		p.nf(p.second(), 2)
	p.saveCanvas(timestamp, "png")
}
