import express from "express"
import cors from "cors"
import * as bodyParser from "body-parser"

const app = express()
const jsonParser = bodyParser.json();
const urlEncodedParser = bodyParser.urlencoded({ extended: true });

// temporary
const form = `<html><head></head><body><form method='POST' action=''><input name='email'/><textarea name='message'></textarea><input type='submit'/></form></body></html>`

app.use(cors())
app.use(urlEncodedParser);

app.use(function (req:any, res:any, next:any) {
    res.removeHeader('X-Powered-By')
    next()
})

app.get('/', async function (req: any, res: any) {
    return res.send(form)
})

app.post('/', urlEncodedParser, jsonParser, async function (req:any, res:any) {
    console.log(req.body)
    return res.send(req.body)
})

const server = app.listen(80, '0.0.0.0', function () {
    console.log(`conbfuscate @ http://0.0.0.0:80/`)
})

export default app;
