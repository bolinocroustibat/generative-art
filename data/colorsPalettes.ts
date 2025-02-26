// Color palettes for generative art
console.log("Colors palettes loaded from data directory") // Debug message to confirm loading

// Export the color palettes using ES6 module syntax with a simple type annotation
export const colorPalettes: { [key: string]: string[] } = {
	default: [
		"#D5E486",
		"#24C0F2",
		"#E3BBE4",
		"#06F8F7",
		"#1B1A36",
		"#E5244D",
		"#1412CE",
		"#FEBD9F",
		"#A861AD",
		"#969ECC",
		"#EB6156",
		"#E94A6A",
	],

	// Eyes 004 palette
	eyes004: [
		"#D81D03", // Red
		"#101A9D", // Blue
		"#1C7E4E", // Green
		"#F6A402", // Yellow
		"#EFD4BF", // Beige
		"#E2E0EF", // Light Purple
		"#050400", // Black
	],

	III: [
		"#2B3F3E",
		"#312A3B",
		"#F25532",
		"#43251B",
		"#C81961",
		"#373868",
		"#FFF8DC",
	],

	rothko: [
		// https://github.com/mmerrittsmith/rothko
		"#5C2D8D", // Violet
		"#000000", // Black
		"#FF6700", // Orange
		"#FFC72C", // Yellow
		"#FFFFFF", // White
		"#FF0000", // Red
		"#800080", // Purple
		"#000080", // Navy
		"#008000", // Green
		"#FFFF00", // Yellow
		"#FF69B4", // Pink
		"#8B4513", // Saddle Brown
	],

	royalTenenbaums: [
		"#a7ba42",
		"#95ccba",
		"#ffdede",
		"#fff0cb",
		"#f2cc84",
		"#9e6e5d",
		"#b8e5db",
		"#f8dcd2",
		"#ceb37c",
		"#9c99a5",
		"#ffe8b5",
		"#d3d0cb",
	],

	// AKIRA
	// https://mediachomp.com/akira-color-palette/
	// https://www.facebook.com/colorpalette.cinema/

	// Mondrian palette
	mondrian: [
		"#FFFFFF", // White (with higher weight in the original)
		"#FF0000", // Red
		"#0000FF", // Blue
		"#FFFF00", // Yellow
	],
}
