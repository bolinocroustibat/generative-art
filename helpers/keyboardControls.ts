import type p5 from "p5"
import { saveImage } from "./saveImage"


// Sets up common keyboard controls for p5 sketches
//
// Default controls:
// - 's': Save canvas as image
// - ' ' (space): Generate new artwork
export const setupKeyboardControls = (
	p: p5,
	config: {
		generateFn?: () => void;
		saveFn?: (p: p5) => void;
		customHandlers?: Record<string, () => void>;
		algorithmName?: string;
	} = {},
): (() => void) => {
	const {
		generateFn,
		algorithmName,
		saveFn = (p) => saveImage(p, algorithmName),
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
