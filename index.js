const { Worker } = require("worker_threads");
require("sharp");

const src = process.argv[2];

const sizes = [
    { width: 120 },
    { width: 1920 },
    { width: 10920 },
    { width: 1280 },
    { width: 640 },
];

const createThread = (size)=>{
    /**
     * creates a worker thread to execute the code of worker.js
     * This file is gonna interact with the main thread trought the "parentPort" 
     * imported from worker_threads module
     *  */ 
    const worker = new Worker(__dirname + "/worker.js");

    /**
     * Creates a function to listen to the worker thread events and
     * resolve or reject the promise
     */
    const p = new Promise((resolve, reject) => {
        worker.once('message', (message) => {
            worker.terminate()
            resolve(message)
        })
        worker.once('error', reject)
    })

    /**
     * sends a message to the created worker
     */
    worker.postMessage({ src, size })

    /**
     * returns the promise P
     */
    return p
}


const main = async () => {
    console.time('main-bechmark')
    // for(const size of sizes){
    //     const a = await createThread(size)   
    // }
    const result = await Promise.all(sizes.map(size => createThread(size)))
    console.log(result)
    console.timeEnd('main-bechmark')
}
main()
