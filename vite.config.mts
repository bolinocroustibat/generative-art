import { mkdir, writeFile } from "node:fs/promises"
import type { IncomingMessage, ServerResponse } from "node:http"
import path from "node:path"
import type { Plugin } from "vite"
import { defineConfig } from "vite"

const OUTPUT_FILE =
	/^output\/[A-Za-z0-9][A-Za-z0-9_-]*\/(?:[A-Za-z0-9][A-Za-z0-9_-]*_)?\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.png$/

const MAX_BYTES = 32 * 1024 * 1024

const readBody = (request: IncomingMessage): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = []
		let size = 0
		request.on("data", (chunk: Buffer) => {
			size += chunk.length
			if (size > MAX_BYTES) {
				reject(new Error("Image is too large"))
				request.destroy()
				return
			}
			chunks.push(chunk)
		})
		request.on("end", () => {
			resolve(Buffer.concat(chunks))
		})
		request.on("error", reject)
	})
}

const saveOutputPlugin = (): Plugin => {
	return {
		name: "save-output",
		configureServer(server) {
			server.middlewares.use(
				"/api/save-output",
				(
					request: IncomingMessage,
					response: ServerResponse,
					next: () => void,
				) => {
					if (request.method !== "POST") {
						next()
						return
					}

					void (async () => {
						try {
							const header = request.headers["x-output-path"]
							const relative = Array.isArray(header) ? header[0] : header
							const destination = relative
								? path.resolve(server.config.root, relative)
								: ""
							const outputRoot = path.resolve(server.config.root, "output")
							if (
								!relative ||
								!OUTPUT_FILE.test(relative) ||
								!destination.startsWith(`${outputRoot}${path.sep}`)
							) {
								response.statusCode = 400
								response.end("Invalid output path")
								return
							}

							const body = await readBody(request)
							if (body.length === 0) {
								response.statusCode = 400
								response.end("Empty image")
								return
							}

							await mkdir(path.dirname(destination), { recursive: true })
							await writeFile(destination, body)
							response.statusCode = 204
							response.end()
						} catch (error) {
							console.error(error)
							if (!response.headersSent) {
								response.statusCode = 500
								response.end("Could not save image")
							}
						}
					})()
				},
			)
		},
	}
}

export default defineConfig({
	plugins: [saveOutputPlugin()],
})
