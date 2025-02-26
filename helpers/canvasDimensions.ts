import type p5 from "p5"

// Fixed canvas dimensions (used when specified)
// Uncomment these lines to use fixed dimensions
const CANVAS_WIDTH = 960
const CANVAS_HEIGHT = 960


// Function to get canvas dimensions
export const getCanvasDimensions = (
	p: p5,
): { width: number; height: number } => {
	// Check if the canvas dimensions are defined (not commented out)
	// @ts-ignore - This is intentional to check if the variables exist
	if (typeof CANVAS_WIDTH !== 'undefined' && typeof CANVAS_HEIGHT !== 'undefined') {
		// @ts-ignore - This is intentional to use the variables if they exist
		return {
			// @ts-ignore
			width: CANVAS_WIDTH,
			// @ts-ignore
			height: CANVAS_HEIGHT,
		}
	}
	
	// Otherwise use the default dimensions (window size)
	return {
		width: window.innerWidth,
		height: window.innerHeight,
	}
}
