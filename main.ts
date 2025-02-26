// Main entry point for the generative art project
import { CURRENT_ALGORITHM } from './settings'

console.log(`Loading algorithm: ${CURRENT_ALGORITHM}`)

// Dynamically import the selected algorithm
import(`./algorithms/${CURRENT_ALGORITHM}/index.ts`)
	.then(() => {
		console.log(`Algorithm "${CURRENT_ALGORITHM}" loaded successfully.`)
	})
	.catch(error => {
		console.error(`Failed to load algorithm "${CURRENT_ALGORITHM}":`, error)
	})
