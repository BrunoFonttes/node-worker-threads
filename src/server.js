const express = require("express")
const { Worker } = require("worker_threads")
const app = express()
const PORT = 3000

app.get("/",(req, res)=>{
    res.status(200).send("Hello World!")
})
app.post("/blocking", (req, res)=>{
    let count = 0
    for(let i=0;i<90000000000;i++){
        count++
    }
    res.status(200).send(`done for ${count}`)
})

app.post("/non-blocking",(req, res)=>{
    const worker = new Worker(__dirname+"/worker.js")
    worker.postMessage(90000000000)
    worker.on("message",message=>{
        res.status(200).send(message)
    }) 
})

app.listen(PORT, ()=>{
    console.log(`Server listening at port ${PORT}`)
})