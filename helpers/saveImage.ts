import type p5 from "p5"

// Saves the current canvas as a PNG image with a timestamp filename
// Note: Images will be downloaded to the browser's default download location
export const saveImage = (p: p5, algorithmName?: string): void => {
	const timestamp =
		p.year() +
		"-" +
		p.nf(p.month(), 2) +
		"-" +
		p.nf(p.day(), 2) +
		"_" +
		p.nf(p.hour(), 2) +
		"-" +
		p.nf(p.minute(), 2) +
		"-" +
		p.nf(p.second(), 2)

	// Include the algorithm name in the filename if provided
	const filename = algorithmName ? `${algorithmName}_${timestamp}` : timestamp

	p.saveCanvas(filename, "png")
}
