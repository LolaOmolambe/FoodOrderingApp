const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

//new Email(user,url).sendWelcome();

// module.exports = class Email {
//   constructor(user, url) {
//     this.to = user.email;
//     this.firstName = user.name.split(" ")[0];
//     this.url = url;
//     this.from = `Lola Omolambe <${process.env.EMAIL_FROM}>`;
//   }

//   newTransport() {
//     if (process.env.NODE_ENV === "production") {
//       //Use SendGrid
//       return 1;
//     }
//     return nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });
//   }

//   async send(template, subject) {
//     //Send the actual email
//     console.log("1");
//     //1. Render HTML based on a template
//     //res.render('')
//     const html = pug.renderFile(
//       `${__dirname}/../views/emails/${template}.pug`,
//       {
//         firstName: this.firstName,
//         url: this.url,
//         subject,
//       }
//     );

//     console.log("2");
//     //2.Define email options
//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html,
//       text: htmlToText.fromString(html),
//     };

//     //3.Create a transport and send email
//     await this.newTransport().sendMail(mailOptions);
//   }

//   async sendWelcome() {
//     await this.send("welcome", "Welcome to the VegeFoods Family!");
//   }
// };

const sendEmail = async (options) => {
  //1.Create a transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "lola.omolambe@gmail.com",
      pass: "Invalid2018!",
    },
  });

  //2.define email options
  const mailOptions = {
      from: 'Lola <hello@jonas.io>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      
  }

  //3.actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
