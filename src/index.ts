import express from "express"
import cors from "cors"
import * as bodyParser from "body-parser"
const HangoutsBot = require("hangouts-bot")

const app = express()
const jsonParser = bodyParser.json();
const urlEncodedParser = bodyParser.urlencoded({ extended: true });
const port: number = parseInt(process.env.PORT) || 5000
const bot = new HangoutsBot('botconbfuscate@gmail.com', 'Canada92');

bot.on('online', function () {
    console.log('hangouts-bot: online')
})

bot.on('offline', function () {
    console.log('hangouts-bot: offline')
})

bot.on('message', function (from:any, message:any) {
    console.log('hangouts-bot:', from, message)
})

// temporary
const form = `<html><head></head><body><form method='POST' action=''><input name='email'/><textarea name='message'></textarea><input type='submit'/></form></body></html>`

app.use(cors())
app.use(urlEncodedParser);

app.use(function (req: any, res: any, next: any) {
    res.removeHeader('X-Powered-By')
    next()
})

app.get('/', async function (req: any, res: any) {
    return res.send(form)
})

app.post('/', urlEncodedParser, jsonParser, async function (req: any, res: any) {
    console.log(req.body)
    bot.sendMessage('tgmclennan@gmail.com', req.body)
    return res.send(req.body)
})

const server = app.listen(port, function () {
    console.log(`env: ` , process.env)
    console.log(`conbfuscate @ http://localhost:${port}/`)
})

export default app;
