import express, { Request, Response } from "express"

import Sender from "./sender";


const sender = new Sender()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/status", (req: Request, res: Response) => {
    return res.send({
        qr_code: sender.qrCode,
        connected: sender.isConnected,
    })

    /* return res.status(200).json() */
})

app.post("/send", async (req: Request, res: Response) => {
    const { number, message } = req.body

    try {
        //validar e transfomar o número wpp
        
      await sender.sendText(number, message)

      return res.status(200).json()
    } catch (error) {
      console.error(error)
      res.status(500).json({ status: "error", message: error })  
    }
})

app.listen(5000, () => {
    console.log("🚀 TRIGGERSHOT 2.0 SERVER STARTED!")
})