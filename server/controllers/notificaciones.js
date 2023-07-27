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

const whatsappMail = function (req, res) {
    const { to } = req.body

    var botId = '113381458451143';
    var phoneNbr = to;
    var bearerToken = 'EAANef7SZBzsMBAOvZAAZBrsI9w9ZCRtP8YUBOUZAmXgpNfrZA6kViZBI95gS1YQGKYWKCMQHFKI5j8shT1QkcbUkZAZCN9SZA69p3S97cllt8K7frfvZC6rPcLpTQb3SQhJpHJkcY1FqMZABdfQc8emXZAXQeWdYrwEKTl0J4RAgzPtWJClm7VXgidcvwmBEzomW7zzaKgFaITYR4KgGzXafRWLFl';

    var url = 'https://graph.facebook.com/v17.0/' + botId + '/messages';
    var data = {
        messaging_product: 'whatsapp',
        to: phoneNbr,
        type: 'template',
        template: {
            name: 'hello_world',
            language: { code: 'en_US' }
        }
    };

    var postReq = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + bearerToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        json: true
    };

    fetch(url, postReq)
        .then(data => {
            res.json(data.json())
        })
        .then(res => {
            console.log(res)
        })
        .catch(error => console.log(error));
}

module.exports = {
    mailer,
    whatsappMail
}