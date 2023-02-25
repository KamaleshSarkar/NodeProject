const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    publishingDate: {
      type: String,
      required: true,
    },
    writer: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
   
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = new mongoose.model("Blog-Content", blogSchema);
