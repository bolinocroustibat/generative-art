// Main entry point for the generative art project
import { CURRENT_ALGORITHM } from "./settings"

console.log(`Loading algorithm: "${CURRENT_ALGORITHM}"`)

// Handle file paths within algorithm folders
const algorithmPath = CURRENT_ALGORITHM.includes("/")
	? `./algorithms/${CURRENT_ALGORITHM}.ts`
	: `./algorithms/${CURRENT_ALGORITHM}/index.ts`

// Dynamically import the selected algorithm
/* @vite-ignore */
import(algorithmPath)
	.then(() => {
		console.log(`Algorithm "${CURRENT_ALGORITHM}" loaded successfully.`)
	})
	.catch((error) => {
		console.error(`Failed to load algorithm "${CURRENT_ALGORITHM}":`, error)
	})
