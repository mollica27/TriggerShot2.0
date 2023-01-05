import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";
import { type } from "os";
import { create, Whatsapp, Message, SocketState } from "venom-bot";
import { ScrapQrcode } from "venom-bot/dist/api/model/qrcode";

export type QRCode = {
    base64Qr: string
    asciiQR: string
    attempts: number
}


class Sender {
    private client: Whatsapp
    private connected: boolean;
    private qr: QRCode;

    
    get isConnected() : boolean {
        return this.connected
    }

    get qrCode(): QRCode {
        return this.qr
    }

    constructor() {
        this.initialize()
    }

    async sendText(to: string, body: string) {
        /* 553591556581@c.us */

        if (!isValidPhoneNumber(to, "BR")) {
            throw new Error("this number is not valid")
        }

        let phoneNumber = parsePhoneNumber(to, "BR")
            ?.format("E.164")
            ?.replace("+", "") as string

        phoneNumber = phoneNumber.includes("@c.us") 
            ? phoneNumber 
            : `${phoneNumber}@c.us`

        /* console.log("phoneNumber", phoneNumber) */

        await this.client.sendText(phoneNumber, body)
    }

    private initialize() {
        const qr = (base64Qr: string, asciiQR: string, attempts: number) => {
            this.qr = {base64Qr, asciiQR, attempts}

        }

        const status = (statusSession: string,) => {
            // isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || 
            //chatsAvailable || deviceNotConnected || serverWssNotConnected ||
            //noOpenBrowser || initBrowser || openBrowser || connectBrowserWs || initWhatsapp || 
            //erroPageWhatsapp || successPageWhatsapp || waitForLogin || waitChat || successChat
            //Create session wss return "serverClose" case server for close

            this.connected = ["isLogged", "qrReadSuccess", "chatsAvailable"]
            .includes(statusSession)
        }

        const start = (client: Whatsapp) => {
            this.client = client

            client.onStateChange((state) =>{
                this.connected = state === SocketState.CONNECTED
            })
        }

        create("ws-sender", qr, status)
        .then((client) => start(client))
        .catch((error) => console.error(error))
    }
}
export default Sender