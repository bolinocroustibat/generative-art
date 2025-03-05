import logging
from pathlib import Path

import matplotlib.image as img
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from numpy.typing import NDArray
from scipy.cluster.vq import kmeans, whiten
from tqdm import tqdm

# https://www.geeksforgeeks.org/extract-dominant-colors-of-an-image-using-python/

# Settings
IMAGE_PATH = Path("../data/insta_pictures/PXL_20230320_125859497-01.jpeg")
N_DOMINANT_COLORS = 4

def rgb_to_hex(r: float, g: float, b: float) -> str:
	"""Convert RGB values to hex color code."""
	return f"#{int(r * 255):02x}{int(g * 255):02x}{int(b * 255):02x}"


# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

logger.info(f"Loading image from {IMAGE_PATH}")
image: NDArray[np.float64] = img.imread(str(IMAGE_PATH))

r: list[float] = []
g: list[float] = []
b: list[float] = []
for row in tqdm(image, desc="Processing image rows"):
	for temp_r, temp_g, temp_b in row:
		r.append(temp_r)
		g.append(temp_g)
		b.append(temp_b)

logger.info("Creating DataFrame from image data...")
image_colors_df = pd.DataFrame({"red": r, "green": g, "blue": b})

logger.info("Scaling color values")
image_colors_df["scaled_color_red"] = whiten(image_colors_df["red"])
image_colors_df["scaled_color_blue"] = whiten(image_colors_df["blue"])
image_colors_df["scaled_color_green"] = whiten(image_colors_df["green"])

logger.info("Running k-means clustering (can take a few minutes)...")
cluster_centers: NDArray[np.float64]
_: NDArray[np.float64]
cluster_centers, _ = kmeans(
	image_colors_df[["scaled_color_red", "scaled_color_blue", "scaled_color_green"]],
	N_DOMINANT_COLORS,
)

dominant_colors: list[tuple[float, float, float]] = []

logger.info("Calculating color statistics...")
red_std: float = image_colors_df["red"].std()
green_std: float = image_colors_df["green"].std()
blue_std: float = image_colors_df["blue"].std()

logger.info("Processing cluster centers...")
for cluster_center in cluster_centers:
	red_scaled: float
	green_scaled: float
	blue_scaled: float
	red_scaled, green_scaled, blue_scaled = cluster_center
	dominant_colors.append(
		(
			red_scaled * red_std / 255,
			green_scaled * green_std / 255,
			blue_scaled * blue_std / 255,
		)
	)

logger.info("Dominant colors:")
for i, (r, g, b) in enumerate(dominant_colors, 1):
	hex_color = rgb_to_hex(r, g, b)
	logger.info(f"Color {i}: {hex_color}")

logger.info("Displaying results")
plt.imshow([dominant_colors])
plt.show()
