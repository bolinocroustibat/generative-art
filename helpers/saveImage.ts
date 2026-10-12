import type p5 from "p5"

import { saveStem } from "./outputPath.ts"

const canvasBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (!blob) {
				reject(new Error("Could not read the canvas"))
				return
			}
			resolve(blob)
		}, "image/png")
	})
}

const writeImage = async (
	sketch: p5,
	algorithmName?: string,
): Promise<void> => {
	const canvas = sketch.canvas
	if (!(canvas instanceof HTMLCanvasElement)) {
		throw new Error("No canvas to save")
	}

	const relativePath = `${saveStem(sketch, algorithmName)}.png`
	const response = await fetch("/api/save-output", {
		method: "POST",
		headers: {
			"Content-Type": "image/png",
			"X-Output-Path": relativePath,
		},
		body: await canvasBlob(canvas),
	})
	if (!response.ok) {
		throw new Error(`Could not save ${relativePath}`)
	}
	console.log(`Saved ${relativePath}`)
}

// Writes the canvas into output/<algorithm>/ through the dev server.
export const saveImage = (sketch: p5, algorithmName?: string): void => {
	void writeImage(sketch, algorithmName).catch((error: unknown) => {
		console.error(error)
	})
}
