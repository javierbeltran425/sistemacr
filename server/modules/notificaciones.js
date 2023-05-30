const knex = require("../db");
const nodemailer = require("nodemailer");

const mailer = async function (req, res) {

    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: `${process.env.NODEM_USER}`, // generated ethereal user
            pass: `${process.env.NODEM_PASSWORD}`, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `${process.env.NODEM_USER}`, // sender address
        to: `${req.body.sendemail}`, // list of receivers
        subject: "Mensaje del sistema de solicitudes DEI", // Subject line
        html: `${req.body.emailcontent}`, // html body
    });

    res.json(info)
}

module.exports = {
    mailer
}