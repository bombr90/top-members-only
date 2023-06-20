const mongoose = require("mongoose"); 
const bcryptjs = require("bcryptjs");
const { dateToString } = require("../util");
const Schema = mongoose.Schema;

const MemberSchema = new Schema(
  {
    userName: {
      type: String, 
      minLength: 1, 
      maxLength: 24, 
      required: true
    },
    password: {
      type: String,
      minLength: 8,
      required: true,
    },
    firstName: { 
      type: String, 
      minLength: 1, 
      maxLength: 24, 
      required: true 
    },
    lastName: { 
      type: String, 
      minLength: 1, 
      maxLength: 24, 
      required: true 
    },
    email: { 
      type: String, 
      minLength: 1, 
      required: true 
    },
    comments: [{ 
      type: Schema.Types.ObjectId, 
      ref: "Comment" 
    }],
    role: {
      type: String,
      enum: ['guest','member','admin'],
      default: 'guest'
    }
  },
  {
    timestamps: {
      createdAt: "created",
      updatedAt: "updated",
    },
  }
);

// future db password handling implementation for refactor https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1

// MemberSchema.pre('save', function(next) {
//   const user = this;
//   if(!user.isModified('password')) return next();
//   bcryptjs.hash(user.password, 10, function(err,hash){
//     if(err) return next(err);
//     user.password = hash;
//     next();
//   })
// });

// MemberSchema.methods.comparePassword = function(candidatePassword, cb) {
//   bcryptjs.compare(candidatePassword, this.password, function(err, isMatch) {
//     if(err) return cb(err);
//     cb(null, isMatch);
//   });
// }

// end future implementation

// Virtuals 
MemberSchema.virtual("url").get(function () {
  return `/clubhouse/member/${this._id}`;
});

MemberSchema.virtual("createdFormatted").get(function () {
  return dateToString(this.created);
});


module.exports = mongoose.model("Member", MemberSchema);
