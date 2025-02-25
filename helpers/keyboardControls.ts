import type p5 from "p5"
import { saveImage } from "./saveImage"

/**
 * Configuration options for keyboard controls
 */
export interface KeyboardControlsConfig {
	/** Function to generate new artwork */
	generateFn?: () => void
	/** Function to save the current state */
	saveFn?: (p: p5) => void
	/** Additional custom key handlers */
	customHandlers?: Record<string, () => void>
}

/**
 * Sets up common keyboard controls for p5 sketches
 *
 * Default controls:
 * - 's': Save canvas as image
 * - ' ' (space): Generate new artwork
 *
 * @param p - The p5 instance
 * @param config - Configuration options
 * @returns A keyPressed function to be assigned to p.keyPressed
 */
export const setupKeyboardControls = (
	p: p5,
	config: KeyboardControlsConfig = {},
): (() => void) => {
	const {
		generateFn,
		saveFn = (p) => saveImage(p),
		customHandlers = {},
	} = config

	return (): void => {
		const key = p.key.toLowerCase()

		// Standard controls
		if (key === "s" && saveFn) {
			saveFn(p)
			return
		}

		if (key === " " && generateFn) {
			generateFn()
			return
		}

		// Handle any custom key bindings
		if (customHandlers[key]) {
			customHandlers[key]()
		}
	}
}
