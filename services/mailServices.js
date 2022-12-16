const nodemailer = require('nodemailer');

const sendActivationMail = async (to, link) => {
    const mailSettings = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        service: 'Yandex',
        auth: {
            user: process.env.SMTP_USER_1,
            pass: process.env.SMTP_PASSWORD_1,
        },
    });

    await mailSettings.sendMail({
        from: process.env.SMTP_USER_1,
        to,
        subject: `Activation account on ${process.env.API_URL}`,
        text: '',
        html: `<div>
              <h1>For activation press on link</h1>
                <a href="${link}">${link}</a>
            </div>`,
    });
};
module.exports = sendActivationMail;
