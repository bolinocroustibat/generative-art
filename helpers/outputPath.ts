import type p5 from "p5"
import { CURRENT_ALGORITHM } from "../settings.ts"

// output/<folder>/<file>. A dated main sketch drops the algorithm name.
// A variant keeps its file name.
const ALGORITHM_ID =
	/^([A-Za-z0-9][A-Za-z0-9_-]*)(?:\/([A-Za-z0-9][A-Za-z0-9_-]*))?$/

const fileTimestamp = (sketch: p5): string => {
	return (
		sketch.year() +
		"-" +
		sketch.nf(sketch.month(), 2) +
		"-" +
		sketch.nf(sketch.day(), 2) +
		"_" +
		sketch.nf(sketch.hour(), 2) +
		"-" +
		sketch.nf(sketch.minute(), 2) +
		"-" +
		sketch.nf(sketch.second(), 2)
	)
}

const pageAlgorithm = (fallback?: string): string => {
	if (typeof window !== "undefined") {
		const value = new URLSearchParams(window.location.search).get("algorithm")
		if (value && !value.includes("..") && ALGORITHM_ID.test(value)) return value
	}
	if (ALGORITHM_ID.test(CURRENT_ALGORITHM)) return CURRENT_ALGORITHM
	return fallback ?? ""
}

// Same relative path for a PNG and an MP4, without the extension.
export const saveStem = (sketch: p5, algorithmName?: string): string => {
	const match = ALGORITHM_ID.exec(pageAlgorithm(algorithmName))
	const timestamp = fileTimestamp(sketch)
	if (!match) return timestamp

	const folder = match[1]
	const variant = match[2]
	if (!folder) return timestamp
	const stem = variant ? `${variant}_${timestamp}` : timestamp
	return `output/${folder}/${stem}`
}
