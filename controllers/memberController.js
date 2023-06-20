const bcrypt = require("bcryptjs");
//For Environmental Variables
require("dotenv").config();
const Member = require("../models/member");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const member = require("../models/member");

const member_create_get = asyncHandler(async (req, res, next) => {
  res.render("member_signup", { title: "Create Member", user: req.user&&true });
});

const member_login_get = asyncHandler(async (req, res, next) => {
  res.render("member_login", { title: "Member Login", user: req.user && true });
});

const member_upgrade_get = asyncHandler(async (req, res, next) => {
  res.render("member_upgrade", {
    title: "Upgrade Membership",
    user: req.user && true,
  });
});

const member_details_get = asyncHandler(async (req, res, next) => {
  if(req.params.id !== req.user.id) {
    const err = new Error("You're not authorized to view this profile");
    err.status= 401;
    return next(err);
  }
  const member = await Member.findById(req.params.id, {
    firstName: 1,
    lastName: 1,
    userName: 1,
    created: 1,
    updated: 1,
    role: 1,
  }).lean();
  if(member===null) {
    const err = new Error("Member not found");
    err.status= 404;
    return next(err);
  };
  res.render("member_details", {
    title: "Member Details",
    member,
    user: req.user && true,
  });
});

const member_create_post = asyncHandler(async (req, res, next) => {
  const errors = [];
  // Create a member object with escaped and trimmed data.
  const newMember = new member({
    userName: req.body.email,
    password: "",
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  });
  //If validation errors return to form
  if (res.locals.validation) {
    res.render("member_signup", {
      title: "Create Member",
      member: newMember,
      user: req.user&&true,
      errors: res.locals.validation.errors,
    });
    return;
  }
  //Create a hash of valid password and store new member in the database
  await bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      errors.push({ msg: err });
    }

    if (errors.length) {
      // There are errors with hash. Render the form again with sanitized values/error messages.
      res.render("member_signup", {
        title: "Create Member",
        member: newMember,
        user: req.user&&true,
        errors: errors,
      });
      return;
    } else {
      // Data from form is valid.
      // Check if member with same email already exists.
      const memberExists = await Member.findOne({
        email: req.body.email,
      }).exec();
      if (memberExists) {
        // Member exists, return to signup page.
         errors.push({ msg: "Email already exists. Try a different email." });
        res.render("member_signup", {
          title: "Create Member",
          member: newMember,
          user: req.user&&true,
          errors,
        });
        return;
      } else {
        // Append hashed password to newMember.
        newMember.password = hashedPassword;
        await newMember.save();
        // New member saved. Redirect to homepage.
        res.redirect("/");
      }
    }
  });
});

const member_login_post = asyncHandler(async (req, res, next) => {
  if (res.locals.validation) {
    res.render("member_login", {
      title: "Member Login",
      username: req.body.username,
      user: req.user&&true,
      errors: res.locals.validation.errors,
    });
    return;
  }
  res.render("member_login", {
    title: "Member Login",
    user: req.user&&true,
    username: req.body.username,
  });
});

const member_upgrade_post = asyncHandler(async (req, res, next) => {
  const errors = [];
  if (res.locals.validation) {
    res.render("member_upgrade", {
      title: "Upgrade Membership",
      role: req.body.role,
      user: req.user&&true,
      errors: res.locals.validation.errors,
    });
    return;
  }

  const master = (req.body.role === "member") ? process.env.MEMBERCODE : (req.body.role === "admin") ? process.env.ADMINCODE : undefined;
  
  //Create a hash of valid password and store new member in the database
  await bcrypt.hash(master, 10, async (err, hashedPassword) => {
    if (err) {
      errors.push({ msg: err });
    }
    if (errors.length) {
      // There are errors with hash. Render the form again with sanitized values/error messages.
      res.render("member_upgrade", {
        title: "Upgrade Membership",
        role: req.body.role,
        user: req.user&&true,
        errors: errors,
      });
      return;
    } else {
      //Hash applicable member/admin password for comparison

      // compare hash to applicable passwords
      const match = await bcrypt.compare(req.body.password, hashedPassword);
      console.log('match', match)
      if(match){
        // success
        await Member.findByIdAndUpdate(req.user.id, { role: req.body.role });
        res.redirect(`/clubhouse/member/${req.user.id}`);
        return;
      } else {
        res.render("member_upgrade", {
          title: "Upgrade Membership",
          role: req.body.role,
          user: req.user&&true,
          errors: [{ msg: 'Passcode invalid.' }]
        });
        return;
      }
      
    }
  });
});

module.exports = {
  member_create_get,
  member_create_post,
  member_login_get,
  member_login_post,
  member_upgrade_get,
  member_upgrade_post,
  member_details_get,
};