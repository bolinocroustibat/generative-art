import type p5 from "p5"
import { colorPalettes } from "../data/colorsPalettes.ts"
import { COLOR_PALETTE } from "../settings.ts"
import { getMoviePalette } from "./moviesPalettesApi"

export const rgbToHex = (rgb: [number, number, number]): string => {
	return `#${rgb
		.map((x) => {
			const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16)
			return hex.length === 1 ? `0${hex}` : hex
		})
		.join("")}`
}

/**
 * Returns the color palette specified in settings or a specified one
 * @param paletteName - Optional name of the palette to use (overrides the setting)
 * @returns Array of color strings
 * @throws Error if palette doesn't exist locally and can't be fetched from the API
 */
export const getColorPalette = async (
	paletteName?: string,
): Promise<string[]> => {
	// Use the provided palette name or the COLOR_PALETTE from settings
	const paletteToUse = paletteName || COLOR_PALETTE

	// Check if the requested palette exists locally
	if (colorPalettes[paletteToUse]) {
		console.log(`Using local color palette: "${paletteToUse}"`)
		return colorPalettes[paletteToUse]
	}

	console.log(`Local palette "${paletteToUse}" not found, trying movies API...`)
	try {
		// Try to fetch from the movies API as a fallback
		const moviePalette = await getMoviePalette(paletteToUse)
		return moviePalette
	} catch (error) {
		// If both local and API attempts fail, throw an error with all available local palettes
		throw new Error(
			`Color palette "${paletteToUse}" not found locally or in movies API. Available local palettes: ${Object.keys(colorPalettes).join(", ")}`,
		)
	}
}

/**
 * Returns a random color from the palette
 * @param p - The p5 instance
 * @param colors - Array of color strings
 * @returns A p5.Color object
 */
export const getRandomColor = (p: p5, colors: string[]): p5.Color => {
	return p.color(colors[p.floor(p.random(colors.length))])
}

/**
 * Returns an interpolated color based on a random position in the palette
 * @param p - The p5 instance
 * @param colors - Array of color strings
 * @returns A p5.Color object
 */
export const getInterpolatedRandomColor = (
	p: p5,
	colors: string[],
): p5.Color => {
	return getInterpolatedColor(p, colors, p.random(colors.length))
}

/**
 * Returns an interpolated color between two adjacent colors in the palette
 * @param p - The p5 instance
 * @param colors - Array of color strings
 * @param position - Position in the color palette (can be fractional)
 * @returns A p5.Color object
 */
export const getInterpolatedColor = (
	p: p5,
	colors: string[],
	position: number,
): p5.Color => {
	position = p.abs(position)
	position = position % colors.length
	const c1 = colors[p.floor(position % colors.length)]
	const c2 = colors[p.floor((position + 1) % colors.length)]
	return p.lerpColor(p.color(c1), p.color(c2), position % 1)
}

/**
 * Returns a color with random alpha value
 * @param p - The p5 instance
 * @param color - Base color (string or p5.Color)
 * @param minAlpha - Minimum alpha value (0-255)
 * @param maxAlpha - Maximum alpha value (0-255)
 * @returns A p5.Color object
 */
export const getColorWithRandomAlpha = (
	p: p5,
	color: string | p5.Color,
	minAlpha = 100,
	maxAlpha = 255,
): p5.Color => {
	const c = typeof color === "string" ? p.color(color) : color
	const alpha = p.random(minAlpha, maxAlpha)
	c.setAlpha(alpha)
	return c
}

/**
 * Returns a slightly varied version of the input color
 * @param p - The p5 instance
 * @param color - Base color (string or p5.Color)
 * @param amount - Maximum amount of variation (0-255)
 * @returns A p5.Color object
 */
export const getVariedColor = (
	p: p5,
	color: string | p5.Color,
	amount = 20,
): p5.Color => {
	const c = typeof color === "string" ? p.color(color) : color
	const r = p.red(c) + p.random(-amount, amount)
	const g = p.green(c) + p.random(-amount, amount)
	const b = p.blue(c) + p.random(-amount, amount)
	return p.color(r, g, b)
}
