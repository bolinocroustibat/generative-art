import logging
from pathlib import Path

import cv2
import numpy as np
from numpy.typing import NDArray
from tqdm import tqdm

# Settings
VIDEO_PATH = Path("data/videos/japan_buildings")  # Can be a file or directory
OUTPUT_PATH = Path("data/pictures/japan_buildings")
FRAME_POSITION = 0.5  # Extract frame at 50% of the video duration
FORCE_ROTATION = 270  # Force rotation angle (0, 90, 180, 270) or None to use metadata
VIDEO_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv"}  # Supported video formats


def is_video_file(path: Path) -> bool:
    """Check if a file is a video based on its extension."""
    return path.is_file() and path.suffix.lower() in VIDEO_EXTENSIONS


def rotate_frame(frame: NDArray[np.uint8], angle: int) -> NDArray[np.uint8]:
    """Rotate frame by the specified angle.

    Args:
        frame: Image frame to rotate
        angle: Rotation angle in degrees (0, 90, 180, or 270)

    Returns:
        Rotated frame
    """
    if angle == 0:
        return frame

    height, width = frame.shape[:2]
    center = (width // 2, height // 2)

    # Create rotation matrix
    rotation_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)

    # Perform rotation
    return cv2.warpAffine(frame, rotation_matrix, (width, height))


def extract_still(
    video_path: Path,
    output_path: Path,
    position: float = 0.5,
    force_rotation: int | None = None,
    verbose: bool = True,
) -> None:
    """Extract a still frame from a video file.

    Args:
            video_path: Path to the video file
            output_path: Directory to save the still frame
            position: Position in the video (0.0 to 1.0) where to extract the frame
            force_rotation: Force rotation angle (0, 90, 180, 270) or None to use metadata
            verbose: Whether to display info logs (error logs are always displayed)
    """
    logger = logging.getLogger(__name__)
    if verbose:
        logger.info(f"Processing video: {video_path}")

    # Check if video file exists
    if not video_path.exists():
        logger.error(f"Error: Video file does not exist: {video_path}")
        return

    # Create output directory if it doesn't exist
    output_path.mkdir(parents=True, exist_ok=True)

    if verbose:
        logger.info(f"Opening video file: {video_path}")
    cap: cv2.VideoCapture = cv2.VideoCapture(str(video_path))

    if not cap.isOpened():
        logger.error(f"Error: Could not open video file: {video_path}")
        return

    # Get video properties
    total_frames: int = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps: float = cap.get(cv2.CAP_PROP_FPS)
    duration: float = total_frames / fps
    rotation: int = int(cap.get(cv2.CAP_PROP_ORIENTATION_META))
    if verbose:
        logger.info(f"Video duration: {duration:.2f} seconds")
        logger.info(f"Total frames: {total_frames}")
        logger.info(f"FPS: {fps}")
        logger.info(f"Rotation: {rotation}°")

    # Calculate frame to extract
    target_frame: int = int(total_frames * position)

    # Set frame position
    cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame)

    # Read frame
    ret: bool
    frame: NDArray[np.uint8]
    ret, frame = cap.read()
    if not ret:
        logger.error("Error: Could not read frame")
        return

    # Apply rotation based on force_rotation parameter or metadata
    if force_rotation is not None:
        if force_rotation not in {0, 90, 180, 270}:
            logger.warning(f"Invalid rotation angle: {force_rotation}. Using 0 degrees.")
            force_rotation = 0
        frame = rotate_frame(frame, force_rotation)
    elif rotation:
        frame = rotate_frame(frame, rotation)

    # Generate output filename
    output_file: Path = output_path / f"{video_path.stem}_frame_{target_frame}.jpg"

    # Save frame
    cv2.imwrite(str(output_file), frame)
    if verbose:
        logger.info(f"Saved frame to: {output_file}")

    # Release video capture
    cap.release()


def process_videos(
    input_path: Path, output_path: Path, position: float = 0.5, force_rotation: int | None = None
) -> None:
    """Process a single video file or all videos in a directory.

    Args:
            input_path: Path to video file or directory containing videos
            output_path: Directory to save the extracted frames
            position: Position in the video (0.0 to 1.0) where to extract the frame
            force_rotation: Force rotation angle (0, 90, 180, 270) or None to use metadata
    """
    # Configure logging
    logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
    logger = logging.getLogger(__name__)

    if input_path.is_file():
        if is_video_file(input_path):
            extract_still(input_path, output_path, position, force_rotation, verbose=True)
        else:
            logger.warning(f"Skipping non-video file: {input_path}")
    elif input_path.is_dir():
        logger.info(f"Processing directory: {input_path}")
        video_files = [f for f in input_path.iterdir() if is_video_file(f)]

        if not video_files:
            logger.warning(f"No video files found in directory: {input_path}")
            return

        for video_file in tqdm(sorted(video_files), desc="Processing videos", unit="file"):
            extract_still(video_file, output_path, position, force_rotation, verbose=False)
    else:
        logger.error(f"Error: Path does not exist: {input_path}")


if __name__ == "__main__":
    process_videos(VIDEO_PATH, OUTPUT_PATH, FRAME_POSITION, FORCE_ROTATION)
