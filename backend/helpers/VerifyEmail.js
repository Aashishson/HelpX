const nodeMailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASS = process.env.USER_PASS;

const templatePath = path.join(__dirname, "../templates/VerificationTemplate.html");
let htmlTemplate = fs.readFileSync(templatePath,"utf-8");


const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth:{
        user: USER_EMAIL,
        pass: USER_PASS
    }

});

exports.sendMailwithGmail  = async( newUser , verifyUserToken) => {
    const verifyLink = `http://localhost:4000/auth/verify/${verifyUserToken}`;
    htmlTemplate = htmlTemplate.replace("{{verification_link}}", verifyLink);
console.log("USER OBJECT:", newUser);
    await transporter.sendMail({
        from: `HelpX Support <${USER_EMAIL}>`,
        to: newUser.Email,
        subject: ` EMAIL Verification`,
        html: htmlTemplate

    })

    

}