import type p5 from "p5"

// Fixed canvas dimensions (used when specified)
const CANVAS_WIDTH = null
const CANVAS_HEIGHT = null

// Function to get canvas dimensions
export const getCanvasDimensions = (
	p: p5,
): { width: number; height: number } => {
	// First try to use the fixed dimensions if they exist
	if (CANVAS_WIDTH && CANVAS_HEIGHT) {
		return {
			width: CANVAS_WIDTH,
			height: CANVAS_HEIGHT,
		}
	}
	return {
		width: window.innerWidth,
		height: window.innerHeight,
	}
}
