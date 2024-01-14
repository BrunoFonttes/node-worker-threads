const { parentPort, threadId } = require("worker_threads")
const sharp = require("sharp");

const resize = async (src, width, height) => {
    const [filename, ext] = src.split(".");
    await sharp(src)
        .resize(width, height, { fit: "cover" })
        .toFile(`${filename}-${width}.${ext}`);
};

/**
 * listens to main thread posting message
 */
parentPort.on("message", async msg => {
    console.time(`benchmark-${threadId}`);

    const { src, size: { width, height } } = msg;
    await resize(src, width, height)

    /**
     * posts a message in the main thread informing the end of the execution
     */
    parentPort.postMessage(`done on threadId ${threadId}: resizing ${src} to ${width}px wide`)
    
    console.timeEnd(`benchmark-${threadId}`)
})

parentPort.on("error", err => console.error(err));

parentPort.on("exit", code => console.log(`Worker exited with code ${code}.`));