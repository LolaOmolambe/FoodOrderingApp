const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
//const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
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
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
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
  next();
});

userSchema.pre("save", function (next) {
  //This only runs if password was modified
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// userSchema.pre(/^find/, function(next) {

//   //Only get active users
//     this.find({isActive: true});
//     next();
//  });

userSchema.methods.correctPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  console.log("reset ", resetToken);

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  console.log("passwordReset ", this.passwordResetExpires);

  return resetToken;
};

//userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
