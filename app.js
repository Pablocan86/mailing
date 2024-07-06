const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const twilio = require("twilio");

dotenv.config();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.usermail,
    pass: process.env.pass,
  },
});

app.get("/mail", async (req, res) => {
  let result = await transport.sendMail({
    from: "pablo.cantarin86@gmail.com",
    to: "aypsports@yahoo.com.ar",
    subject: "Prueba de funcionamiento",
    html: `<div>
        <h1>Correo de prueba</h1>
        <img src="cid:bandas"/>
        </div>`,

    attachments: [
      {
        filename: "bandas.webp",
        path: __dirname + `/images/bandas.webp`,
        cid: "bandas",
      },
      {
        filename: "encuesta.pdf",
        path: __dirname + `/pdf/encuesta.pdf`,
        cid: "encuesta",
      },
    ],
  });

  res.send(`Mensaje enviado a ${result.envelope.to}`);
});

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_SMS_NUMBER = process.env.TWILIO_SMS_NUMBE;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

app.get("/sms", async (req, res) => {
  let result = await client.messages.create({
    body: "Esto es un mensaje SMS",
    from: TWILIO_SMS_NUMBER,
    to: "541154829958",
  });
  res.send({ status: "succes", result: "Message sent" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
