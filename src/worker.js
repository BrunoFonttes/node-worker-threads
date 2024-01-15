const { parentPort } = require("worker_threads")

parentPort.on("message", (value) => {
    let count = 0
    for (let i = 0; i < value; i++) {
        count++
    }
    parentPort.postMessage(`done for ${count}`)
})

parentPort.on("error", err => console.error(err));

parentPort.on("exit", code => console.log(`Worker exited with code ${code}.`));