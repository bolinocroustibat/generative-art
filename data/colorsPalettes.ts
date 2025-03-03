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

	eyes001: [
		"#0795D0",
		"#019C54",
		"#F5230D",
		"#DF5A48",
		"#F1BF16",
		"#F0C016",
		"#F4850C",
		"#E13E33",
		"#746891",
		"#623E86",
		"#00A2C6",
		"#EBD417",
	],

	eyes004: [
		"#D81D03",
		"#101A9D",
		"#1C7E4E",
		"#F6A402",
		"#EFD4BF",
		"#E2E0EF",
		"#050400",
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

	circo: ["#EBB858", "#EEA8C1", "#D0CBC3", "#87B6C4", "#EA4140", "#5A5787"],

	azulejos: ["#EE3425", "#000000", "#D3D3D3", "#FEFEFE"],

	op_prob1: ["#E70012", "#D3A100", "#017160", "#00A0E9", "#072B45"],

	hembras: [
		"#EFF1F4",
		"#81C7EF",
		"#2DC3BA",
		"#BCEBD2",
		"#F9F77A",
		"#F8BDD3",
		"#272928",
	],

	arabe: ["#F19617", "#251207", "#15727F", "#CEAB81", "#BD3E36"],

	alfombra: [
		"#D81D03",
		"#101A9D",
		"#1C7E4E",
		"#F6A402",
		"#EFD4BF",
		"#E2E0EF",
		"#050400",
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

	// Golden palette
	golden: [
		"#db3b4b",
		"#edd23b",
		"#d4dbdd",
		"#2172ba",
	],

	// Chea palette
	chea: [
		"#FACD00",
		"#FB4F00",
		"#F277C5",
		"#7D57C6",
		"#00B187",
		"#3DC1CD",
	],

	// Chime palette
	chime: [
		"#F4D3DE",
		"#F7E843",
		"#409746",
		"#373787",
		"#E12E29",
	],
}
