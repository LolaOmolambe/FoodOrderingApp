const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
//const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      //validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a Password!"],
      minlength: 6,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm Password!"],
      validate: {
        //Only works on save or create
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same",
      },
    },
    firstName: {
      type: String,
      required: [true, "Please input First name!"],
    },
    lastName: {
      type: String,
      required: [true, "Please input Last Name!"],
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  //This only runs if password was modified
  if (!this.isModified("password")) return next();

  //Hash passwords
  this.password = await bcrypt.hash(this.password, 12);

  //Delete password confirm
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

//userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
