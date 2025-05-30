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
		"#FF0000", // Red
		"#800080", // Purple
		"#000080", // Navy
		"#008000", // Green
		"#FFFF00", // Yellow
		"#FF69B4", // Pink
		"#8B4513", // Saddle Brown
		"#FFFFFF", // White
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

	mondrian: [
		"#FFFFFF", // White (with higher weight in the original)
		"#FF0000", // Red
		"#0000FF", // Blue
		"#FFFF00", // Yellow
	],

	golden: ["#db3b4b", "#edd23b", "#d4dbdd", "#2172ba"],

	chea: ["#FACD00", "#FB4F00", "#F277C5", "#7D57C6", "#00B187", "#3DC1CD"],

	chime: ["#F4D3DE", "#F7E843", "#409746", "#373787", "#E12E29"],

	// Wes Anderson's Grand Budapest Hotel
	grandBudapest: [
		"#F1BB7B",
		"#FD6467",
		"#5B1A18",
		"#D67236",
		"#E6A0C4",
		"#C6CDF7",
	],

	// Hokusai's The Great Wave
	greatWave: ["#011F4B", "#03396C", "#005B96", "#6497B1", "#B3CDE0", "#FFFFFF"],

	// Van Gogh's Starry Night
	starryNight: [
		"#1E3F66",
		"#2E5C8A",
		"#4A90E2",
		"#FFD700",
		"#FDB813",
		"#C7B683",
	],

	// Japanese Cherry Blossom
	sakura: ["#FFB7C5", "#FF8FA2", "#FFE5EC", "#674846", "#8D6449", "#FFFFFF"],

	// Bauhaus inspired
	bauhaus: ["#EC3E3E", "#0F71B8", "#FFDD00", "#000000", "#FFFFFF"],

	// Northern Lights
	aurora: ["#00796B", "#2E7D32", "#1976D2", "#512DA8", "#C2185B", "#1B5E20"],

	// Art Deco
	artDeco: ["#B8860B", "#000000", "#FFFFFF", "#B76E79", "#12395D", "#828282"],

	// Studio Ghibli inspired
	ghibli: ["#85D4E3", "#F4B674", "#9CD08F", "#EAAC8B", "#E8A0BF", "#86B3D1"],

	// Memphis Design Movement
	memphis: ["#FF6B6B", "#4ECDC4", "#FFE66D", "#2C3E50", "#FF9F1C", "#95A5A6"],

	// Frida Kahlo inspired
	frida: ["#E63946", "#1D3557", "#F1FAEE", "#A8DADC", "#457B9D", "#FFB703"],

	// Cyberpunk
	cyberpunk: ["#FF00FF", "#00FFFF", "#FF3366", "#33FF33", "#181818", "#FF9900"],

	// Ukiyo-e prints
	ukiyoe: ["#2C3B4F", "#B4436C", "#E7D6C3", "#F5C33B", "#88A0A8", "#C73E3A"],

	// Order palette
	order: ["#FFFCF7", "#FDDA02", "#EE78AC", "#3155A3", "#028B88"],

	// Wes Anderson Palettes
	bottleRocket: [
		"#A42820", "#5F5647", "#9B110E", "#3F5151", "#4E2A1E", "#550307",
		"#0C1707", "#FAD510", "#CB2314", "#273046", "#354823", "#1E1E1E"
	],

	rushmore: [
		"#E1BD6D", "#EABE94", "#0B775E", "#35274A", "#F2300F"
	],

	royal: [
		"#899DA4", "#C93312", "#FAEFD1", "#DC863B", "#9A8822",
		"#F5CDB4", "#F8AFA8", "#FDDDA0", "#74A089"
	],

	zissou: [
		"#3B9AB2", "#78B7C5", "#EBCC2A", "#E1AF00" , "#F21A00"
	],

	darjeelingLimited: [
		"#FF0000", "#00A08A", "#F2AD00", "#F98400", "#5BBCD6",
		"#ECCBAE", "#046C9A", "#D69C4E", "#ABDDDE", "#000000"
	],

	chevalier: [
		"#446455", "#FDD262", "#D3DDDC", "#C7B19C"
	],

	fantasticFox: [
		"#DD8D29", "#E2D200", "#46ACC8", "#E58601", "#B40F20"
	],

	cavalcanti: [
		"#D8B70A", "#02401B", "#A2A475", "#81A88D", "#972D15"
	],

	grandBudapestHotel: [
		"#F1BB7B", "#FD6467", "#5B1A18", "#D67236", "#E6A0C4",
		"#C6CDF7", "#D8A499", "#7294D4"
	],

	isleOfDogs: [
		"#9986A5", "#79402E", "#CCBA72", "#0F0D0E", "#D9D0D3", "#8D8680"
	],

	caretonga: [
		"#2F2C3B", // Dark blue-gray
		"#F57281", // Pink
		"#EAEAEA", // Light gray
		"#EAEAEA", // Light gray (duplicate in original)
	],

	cables: [
		"#1E1E1E",
		"#5A5A5A",
		"#FFFFFF",
	],

	arcos: [
		"#FF0000",
		"#00FF00",
		"#0000FF",
		"#FFFF00",
		"#FF00FF",
		"#00FFFF",
	],

	arboles: [
		"#4B9EFF",
		"#000000",
	],

	helados: [
		"#FFB7B7", // -13774701
		"#FFEEBB", // -74949
		"#FFE7EF", // -1204433
		"#FFB7CA", // -5076934
		"#FFEEB1", // -80463
		"#FFEEA1", // -94591
	],

	circulos: [
		"#F73F09",
		"#004D51",
		"#008280",
		"#00B9B5",
	],

	circulos2: [
		"#F73F09",
		"#004D51",
		"#008280",
		"#00B9B5",
	],

	circulosdentrocirculos2: [
		"#163440",
		"#28A199",
		"#70CCAD",
		"#CAFAC3",
		"#FFFACC",
	],
}
