import "dotenv/config";
import express from "express";
import cors from "cors";
import * as bodyParser from "body-parser";
import * as nodemailer from "nodemailer";
import SMTPTransport = require("nodemailer/lib/smtp-transport");

const app = express();
const jsonParser = bodyParser.json();
const urlEncodedParser = bodyParser.urlencoded({ extended: true });
const port: number = parseInt(process.env.PORT) || 5000;

// temporary
const form = `<html><head></head><body><form method='POST' action=''><input name='email'/><textarea name='message'></textarea><input type='submit'/></form></body></html>`;

// node-mailer
const recipient = process.env.NM_TARGET;
const transporter: nodemailer.Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        "user": process.env.NM_TRANS_EMAIL,
        "pass": process.env.NM_TRANS_PASS
    }
});
const message: { from: string, to: string, subject: string, text: string } = {
    from: process.env.NM_TRANS_EMAIL,
    to: process.env.NM_TARGET,
    subject: "msg from ",
    text: ""
};

// middleware
app.use(cors());
app.use(urlEncodedParser);

app.use(function (req: any, res: any, next: any) {
    res.removeHeader("X-Powered-By");
    next();
});

app.get("/", async function (req: any, res: any) {
    return res.send(form);
});

app.post("/", urlEncodedParser, jsonParser, async function (req: any, res: any) {
    console.log(req.body);
    return res.send(req.body);
});

app.get("/message", async function (req: any, res: any) {
    console.log("GET /message");
    const name = req.body.name;
    message.subject += name;
    message.text += req.body;
    await transporter.sendMail(message)
        .then(res => {
            console.log(`Email sent to ${name}. Message: ${req.body}`);
            return res.status(200);
        })
        .catch((err) => {
            console.error(`Error: nodemailer failed to send message to ${name}. Details: `, err);
            return res.status(500);
        });
        return res.status(200);
});

const server = app.listen(port, function () {
    // console.log(`env: `, process.env);
    console.log(`conbfuscate @ http://localhost:${port}/`);
});

export default app;
