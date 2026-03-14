const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        // Automatically create a test account on Ethereal Email on the fly
        let testAccount = await nodemailer.createTestAccount();

        // Create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        // Setup email data
        const mailOptions = {
            from: '"OACRS System" <noreply@oacrs.com>', // sender address
            to: options.email, // list of receivers
            subject: options.subject, // Subject line
            text: options.message, // plain text body
        };

        // Send mail with defined transport object
        const info = await transporter.sendMail(mailOptions);

        console.log("==========================================");
        console.log("Email sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        console.log("==========================================");
        
    } catch (error) {
        console.error("Error sending email: ", error);
    }
};

module.exports = sendEmail;
