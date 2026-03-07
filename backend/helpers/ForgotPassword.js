const nodemailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth:{
        user: USER_EMAIL,
        pass: USER_PASS
    }

});

const SendRestPasswordMail = async(user, Email , otp , name) =>{



    await transporter.sendMail({
        from: `HelpX Support`,
        to: name,
        Subject: "Reset-Password",
        html: OtpTemplate

    })

}