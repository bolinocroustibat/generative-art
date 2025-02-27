import type p5 from "p5"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../settings"

// Function to get canvas dimensions
export const getCanvasDimensions = (
	p: p5,
): { width: number; height: number } => {
	// Check if the canvas dimensions are defined in settings.ts
	// @ts-ignore - This is intentional to check if the variables exist
	if (
		typeof CANVAS_WIDTH !== "undefined" &&
		typeof CANVAS_HEIGHT !== "undefined"
	) {
		return {
			width: CANVAS_WIDTH,
			height: CANVAS_HEIGHT,
		}
	}

	// Otherwise use the default dimensions (window size)
	return {
		width: window.innerWidth,
		height: window.innerHeight,
	}
}
