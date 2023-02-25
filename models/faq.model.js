const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    }, 
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = new mongoose.model("FAQ- Question_Ans", faqSchema);
