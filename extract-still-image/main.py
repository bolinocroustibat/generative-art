import logging
from pathlib import Path

import cv2
import numpy as np
from numpy.typing import NDArray

# Settings
VIDEO_PATH = Path("data/videos/japan_buildings/PXL_20200920_060730131.mp4")
OUTPUT_PATH = Path("data/pictures/japan_buildings")
FRAME_POSITION = 0.5  # Extract frame at 50% of the video duration


def extract_still(video_path: Path, output_path: Path, position: float = 0.5) -> None:
    """Extract a still frame from a video file.

    Args:
            video_path: Path to the video file
            output_path: Directory to save the still frame
            position: Position in the video (0.0 to 1.0) where to extract the frame
    """
    # Configure logging
    logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
    logger = logging.getLogger(__name__)

    # Check if video file exists
    if not video_path.exists():
        logger.error(f"Error: Video file does not exist: {video_path}")
        return

    # Create output directory if it doesn't exist
    output_path.mkdir(parents=True, exist_ok=True)

    logger.info(f"Opening video file: {video_path}")
    cap: cv2.VideoCapture = cv2.VideoCapture(str(video_path))

    if not cap.isOpened():
        logger.error(f"Error: Could not open video file: {video_path}")
        return

    # Get video properties
    total_frames: int = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps: float = cap.get(cv2.CAP_PROP_FPS)
    duration: float = total_frames / fps

    logger.info(f"Video duration: {duration:.2f} seconds")
    logger.info(f"Total frames: {total_frames}")
    logger.info(f"FPS: {fps}")

    # Calculate frame to extract
    target_frame = int(total_frames * position)

    # Set frame position
    cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame)

    # Read frame
    ret: bool
    frame: NDArray[np.uint8]
    ret, frame = cap.read()
    if not ret:
        logger.error("Error: Could not read frame")
        return

    # Generate output filename
    output_file: Path = output_path / f"{video_path.stem}_frame_{target_frame}.jpg"

    # Save frame
    cv2.imwrite(str(output_file), frame)
    logger.info(f"Saved frame to: {output_file}")

    # Release video capture
    cap.release()


if __name__ == "__main__":
    extract_still(VIDEO_PATH, OUTPUT_PATH, FRAME_POSITION)
