import { ArrayBufferTarget, Muxer } from "mp4-muxer"
import type p5 from "p5"
import { saveStem } from "./outputPath"

// Fixed length so a slow frame does not stretch the motion.
const RECORD_SECONDS = 8
const RECORD_FPS = 30

const FRAME_COUNT = RECORD_SECONDS * RECORD_FPS
const FRAME_MS = 1000 / RECORD_FPS
const FAILURE_MS = 2500

let recording = false

class EncodeUnsupported extends Error {}

export const isRecordingAnimation = (): boolean => recording

// Saves a fixed-length MP4 by stepping the sketch one frame at a time.
// millis() and deltaTime are pinned so a slow machine does not change the motion.
export const recordAnimation = async (
	sketch: p5,
	algorithmName?: string,
): Promise<void> => {
	if (recording) return
	recording = true
	const status = createStatus()
	status.textContent = `Recording 0/${FRAME_COUNT}`
	try {
		await writeAnimation(sketch, algorithmName, status)
	} catch (error) {
		const message =
			error instanceof EncodeUnsupported
				? "This browser cannot encode MP4"
				: "Could not save the video"
		if (!(error instanceof EncodeUnsupported)) console.error(error)
		status.textContent = message
		await delay(FAILURE_MS)
	} finally {
		status.remove()
		recording = false
	}
}

const writeAnimation = async (
	sketch: p5,
	algorithmName: string | undefined,
	status: HTMLDivElement,
): Promise<void> => {
	const canvas = readCanvas(sketch)
	if (!canvas) throw new Error("Canvas is not ready")

	const source = frameSource(canvas)
	const config = await supportedConfig(source.width, source.height)
	if (!config) throw new EncodeUnsupported()

	const wasLooping = sketch.isLooping()
	await pauseSketch(sketch)
	const clock = installClock(sketch)
	let encoder: VideoEncoder | null = null
	try {
		if (isUserDraw(sketch)) throw new Error("The sketch was still drawing")

		const target = new ArrayBufferTarget()
		const muxer = new Muxer({
			target,
			video: {
				codec: "avc",
				width: source.width,
				height: source.height,
				frameRate: RECORD_FPS,
			},
			fastStart: "in-memory",
			firstTimestampBehavior: "strict",
		})

		let encoderFailure: Error | null = null
		encoder = new VideoEncoder({
			output: (chunk, meta) => {
				muxer.addVideoChunk(chunk, meta)
			},
			error: (error) => {
				encoderFailure =
					error instanceof Error ? error : new Error(String(error))
			},
		})
		encoder.configure(config)

		for (let frameIndex = 0; frameIndex < FRAME_COUNT; frameIndex++) {
			if (encoderFailure) throw encoderFailure
			clock.seek(frameIndex)
			await sketch.redraw()

			const timestamp = timestampUs(frameIndex)
			const frame = new VideoFrame(source.paint(), {
				timestamp,
				duration: timestampUs(frameIndex + 1) - timestamp,
			})
			try {
				encoder.encode(frame, { keyFrame: frameIndex % RECORD_FPS === 0 })
			} finally {
				frame.close()
			}

			status.textContent = `Recording ${frameIndex + 1}/${FRAME_COUNT}`
			if (encoder.encodeQueueSize > 2) await waitForDequeue(encoder)
			if (frameIndex % 10 === 0) await nextFrame()
		}

		await encoder.flush()
		if (encoderFailure) throw encoderFailure
		muxer.finalize()
		downloadMp4(target.buffer, `${saveStem(sketch, algorithmName)}.mp4`)
	} finally {
		clock.restore()
		if (encoder && encoder.state !== "closed") encoder.close()
		if (wasLooping) sketch.loop()
	}
}

const encoderConfig = (width: number, height: number): VideoEncoderConfig => {
	const referencePixels = 1500 * 960
	const bitrate = Math.max(
		1_000_000,
		Math.round((width * height * 8_000_000) / referencePixels),
	)
	return {
		codec: "avc1.640033",
		width,
		height,
		bitrate,
		framerate: RECORD_FPS,
		avc: { format: "avc" },
		hardwareAcceleration: "prefer-hardware",
		latencyMode: "realtime",
	}
}

const supportedConfig = async (
	width: number,
	height: number,
): Promise<VideoEncoderConfig | null> => {
	const preferred = encoderConfig(width, height)
	if (await canEncode(preferred)) return preferred
	const { hardwareAcceleration: _hardware, ...fallback } = preferred
	if (await canEncode(fallback)) return fallback
	return null
}

const canEncode = async (config: VideoEncoderConfig): Promise<boolean> => {
	if (typeof VideoEncoder === "undefined") return false
	const support = await VideoEncoder.isConfigSupported(config)
	return support.supported === true
}

const readCanvas = (sketch: p5): HTMLCanvasElement | null => {
	if (!("canvas" in sketch)) return null
	const canvas = sketch.canvas
	if (!(canvas instanceof HTMLCanvasElement)) return null
	if (canvas.width < 2 || canvas.height < 2) return null
	return canvas
}

type FrameSource = {
	width: number
	height: number
	paint: () => CanvasImageSource
}

// H.264 needs an even width and height. Drop the last row or column when odd.
const frameSource = (canvas: HTMLCanvasElement): FrameSource => {
	const width = canvas.width - (canvas.width % 2)
	const height = canvas.height - (canvas.height % 2)
	if (width === canvas.width && height === canvas.height) {
		return { width, height, paint: () => canvas }
	}

	const copy = document.createElement("canvas")
	copy.width = width
	copy.height = height
	const context = copy.getContext("2d")
	if (!context) throw new Error("Could not copy the canvas")
	return {
		width,
		height,
		paint: () => {
			context.drawImage(canvas, 0, 0)
			return copy
		},
	}
}

type Clock = {
	seek: (frameIndex: number) => void
	restore: () => void
}

const installClock = (sketch: p5): Clock => {
	let virtualMs = 0
	Object.defineProperty(sketch, "millis", {
		configurable: true,
		writable: true,
		value: () => virtualMs,
	})
	Object.defineProperty(sketch, "deltaTime", {
		configurable: true,
		enumerable: true,
		writable: true,
		value: FRAME_MS,
	})
	return {
		seek: (frameIndex: number): void => {
			virtualMs = (frameIndex * 1000) / RECORD_FPS
		},
		restore: (): void => {
			Reflect.deleteProperty(sketch, "millis")
		},
	}
}

const pauseSketch = async (sketch: p5): Promise<void> => {
	sketch.noLoop()
	cancelScheduledDraw(sketch)
	await nextFrame()
	for (let attempt = 0; attempt < 30 && isUserDraw(sketch); attempt++) {
		await nextFrame()
	}
}

const cancelScheduledDraw = (sketch: p5): void => {
	if (!("_requestAnimId" in sketch)) return
	const id = sketch._requestAnimId
	if (typeof id === "number") cancelAnimationFrame(id)
}

const isUserDraw = (sketch: p5): boolean => {
	if (!("_inUserDraw" in sketch)) return false
	return sketch._inUserDraw === true
}

const timestampUs = (frameIndex: number): number => {
	return Math.round((frameIndex * 1_000_000) / RECORD_FPS)
}

const downloadMp4 = (buffer: ArrayBuffer, filename: string): void => {
	const blob = new Blob([buffer], { type: "video/mp4" })
	const url = URL.createObjectURL(blob)
	const link = document.createElement("a")
	link.href = url
	link.download = filename
	document.body.appendChild(link)
	link.click()
	link.remove()
	setTimeout(() => {
		URL.revokeObjectURL(url)
	}, 30_000)
}

const createStatus = (): HTMLDivElement => {
	const status = document.createElement("div")
	status.setAttribute("role", "status")
	status.style.position = "fixed"
	status.style.left = "16px"
	status.style.bottom = "16px"
	status.style.zIndex = "20"
	status.style.padding = "8px 12px"
	status.style.background = "rgba(0, 0, 0, 0.72)"
	status.style.color = "white"
	status.style.font = "14px sans-serif"
	status.style.pointerEvents = "none"
	document.body.appendChild(status)
	return status
}

const waitForDequeue = (encoder: VideoEncoder): Promise<void> => {
	return new Promise((resolve) => {
		encoder.addEventListener("dequeue", () => resolve(), { once: true })
	})
}

const nextFrame = (): Promise<void> => {
	return new Promise((resolve) => {
		requestAnimationFrame(() => resolve())
	})
}

const delay = (milliseconds: number): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(resolve, milliseconds)
	})
}
