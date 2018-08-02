import "dotenv/config";
import express from "express";
import cors from "cors";
import * as bodyParser from "body-parser";
import * as nodemailer from "nodemailer";
import SMTPTransport = require("nodemailer/lib/smtp-transport");

const app = express();
const jsonParser = bodyParser.json();
const urlEncodedParser = bodyParser.urlencoded({ extended: true });
const port: number = parseInt(process.env.PORT) || 80;

// temporary
const form = `<html><head></head><body><form method='POST' action='/message'><input name='email'/><textarea name='message'></textarea><input type='submit'/></form></body></html>`;

// node-mailer setup
const recipient = process.env.NM_TARGET;
const transporter: nodemailer.Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        "user": process.env.NM_TRANS_EMAIL,
        "pass": process.env.NM_TRANS_PASS
    }
});
const message: { from: string, to: string, subject: string, text: string, html: string } = {
    from: process.env.NM_TRANS_EMAIL,
    to: process.env.NM_TARGET,
    subject: "msg from ",
    text: "",
    html: "",
};

/**
 * Sends an email. We do not care to report success status to the sender, only log it.
 * @param to Email address of message sender.
 * @param message Body of email
 */
async function send(to: string, msg: string | object) {
    if (typeof msg === "object") msg = JSON.stringify(msg);
    message.subject += `${to}.`;
    message.text += msg;
    message.html += `<pre>${msg}</pre>`;
    console.log(message);
    await transporter.sendMail(message)
        .then(res => {
            console.log(`Email sent to ${to}. Message: ${msg}`);
        })
        .catch((err) => {
            console.error(`Error: nodemailer failed to send message to ${to}. Details: `, err);
        });
}

// Middleware
app.use(cors());
app.use(urlEncodedParser);

app.use(function (req: any, res: any, next: any) {
    res.removeHeader("X-Powered-By"); // shrink attack surface
    next();
});

// Routes

app.get("/", async function (req: any, res: any) {
    return res.send(form);
});

app.post("/", urlEncodedParser, jsonParser, async function (req: any, res: any) {
    return res.send("Beep boop, I'm a bot.");
});

app.all("/message", function (req: any, res: any) {
    if (req.body.email && req.body.message) send(req.body.email, req.body.message);
    if (req.body.name && req.body.message) send(req.body.name, req.body.message);
    return res.status(200).send("");
});

app.all("/message/:name/:message", async function (req: any, res: any) {
    send(req.params.name, req.params.message);
    return res.status(200).send("");
});

// Start server

const server = app.listen(port, function () {
    console.log(`conbfuscate @ http://localhost:${port}/`);
});

export default app;
