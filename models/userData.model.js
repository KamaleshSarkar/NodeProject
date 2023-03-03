const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      default: ""
  },
  role: {
      type: String,
      default: 'User',
      enum: ['Admin', 'User']
  },
     image: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  
   
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = new mongoose.model("UserData", userSchema);
