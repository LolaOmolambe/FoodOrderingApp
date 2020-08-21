
const Email = require("../services/email");

exports.contactUs = async (req, res, next) => {
  try {
    let { name, subject, email, message } = req.body;
    console.log(req.body);
    let url="";
    let newUser = {
      email: "hellofromvegefoods@gmail.com",
      firstName: name,
    };

    await new Email(newUser, url).sendContactMail(subject, message, email);

    res.status(201).json({
      status: "success",
      message: "Email sent successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Email not sent!",
    });
  }
};
