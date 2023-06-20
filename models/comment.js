const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {timeAgo} = require('../util');

const CommentSchema = new Schema(
  {
    title: {
      type: String,
      maxLength: 64,
      required: false,
    },
    content: {
      type: String,
      minLength: 1,
      maxLength: 512,
      required: true,
    },
    originalPoster: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created",
      updatedAt: "updated",
    },
  },
);

CommentSchema.virtual("url").get(function () {
  return `/clubhouse/comment/${this._id}`;
});

CommentSchema.virtual("timeAgo").get(function () {
  return timeAgo(this.created);
});

module.exports = mongoose.model("Comment", CommentSchema);
