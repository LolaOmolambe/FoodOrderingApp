const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

//new Email(user,url).sendWelcome();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    //this.firstName = user.name.split(" ")[0];
    this.firstName = user.firstName;
    this.url = url;
    this.from = `Vege Foods <${process.env.EMAIL_USERNAME}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject, message, email) {
    //Send the actual email
    message = message || "";
    email = email || "";
    console.log("1");
    //1. Render HTML based on a template
    //res.render('')
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
        email,
        message

      }
    );

    console.log("2");
    //2.Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    //3.Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the VegeFoods Family!");
  }

  async sendContactMail(subject, message, email) {
    await this.send("contact", subject, message, email);
  }
};

// const sendEmail = async (options) => {
//   //1.Create a transporter
//   console.log(process.env.EMAIL_USERNAME);
//   const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   //2.define email options
//   const mailOptions = {
//     from: "VegeFoods <hellofromvegefoods@gmail.com>",
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   //3.actually send the email
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
