import { MOVIES_PALETTES_API_URL } from "../settings"
import { rgbToHex } from "./colorUtils"

interface MoviePaletteResponse {
	movie: {
		id: number
		title: string
		director: string
		year: string
	}
	palettes: Array<{
		id: string
		active: number
		colors: [number, number, number][]
		is_black_and_white: number
		// Other fields omitted for brevity as they're not needed
	}>
}

/**
 * Fetches the first color palette for a given movie
 * @param movieSlug - The movie's URL slug (e.g., "12-monkeys")
 * @returns Array of hex color strings
 * @throws Error if the fetch fails or no palette is found
 */
export const getMoviePalette = async (movieSlug: string): Promise<string[]> => {
	try {
		const response = await fetch(
			`${MOVIES_PALETTES_API_URL}/palettes/${movieSlug}`,
		)

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		const data = (await response.json()) as MoviePaletteResponse
		console.log(
			`Successfully fetched palette with ${data.palettes[0].colors.length} colors`,
		)
		return data.palettes[0].colors.map((color: [number, number, number]) =>
			rgbToHex(color),
		)
	} catch (error) {
		console.error(`Failed to fetch movie palette: ${error}`)
		throw error
	}
}

/**
 * Example usage:
 *
 * ```typescript
 * try {
 *   const palette = await getMoviePalette("12-monkeys")
 *   console.log(palette) // ["#4C4650", "#A9AEC2", ...]
 * } catch (error) {
 *   console.error("Error fetching palette:", error)
 * }
 * ```
 */
