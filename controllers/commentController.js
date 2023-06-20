const Member = require("../models/member");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");

const index = asyncHandler(async (req, res, next) => {
  const [member_count, comment_count] = await Promise.all([
    Member.countDocuments({}).exec(),
    Comment.countDocuments({}).exec(),
  ]);

  if(req.user) {
    const member = await Member.findById(req.user._id, {userName:1, role:1, firstName:1, lastName:1}).lean().exec();
    res.render('index',{title: 'Home', comment_count, member_count,member, user: req.user&&true});
    return;
  } else {
    res.render('index',{title: 'Home', comment_count, member_count, user: req.user&&true});
  }
});

const comments_list_get = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({}, {
      title:1, 
      content:1,  
      created:1,
      originalPoster: req.isAuthenticated() ? 1 : '',
    }).populate("originalPoster", "firstName lastName, userName").exec();
  if(req.user){
    res.render("comments_list", {
      title: "All Comments",
      comments,
      user: req.user && true,
      role: req.user.role,
    });
  } else {
    res.render("comments_list", {
      title: "All Comments",
      comments,
      user: req.user && true,
      role: "Guest"
    });
  }
  
});

const comment_form_get = asyncHandler(async (req, res, next) => {
  res.render("comment_form", {
    title: "Comment in the Clubhouse",
    user: req.user && true,
  });
});

const comment_form_post = asyncHandler(async (req, res, next) => {
  const errors = [];
  //If validation errors return to form
  console.log(req.body);
  if (res.locals.validation) {
    res.render("comment_form", {
      title: "Comment in the Clubhouse",
      commentContent: req.body.commentContent,
      commentTitle: req.body.commentTitle || undefined,
      user: req.user&&true,
      errors: res.locals.validation.errors,
    });
    return;
  }
  // Create a comment object with unescaped trimmed data.
  const newComment = new Comment({
    title: req.body.commentTitle || undefined,
    content: req.body.commentContent,
    originalPoster: req.user._id,
  });
  await newComment.save();
  res.redirect("/clubhouse/comments");
});

const comment_delete_get = asyncHandler(async (req, res, next) => {
  res.render("comment_delete", { title: "Delete Comment", id: req.params.id, user: req.user && true });
});

const comment_delete_post = asyncHandler(async (req, res, next) => {
  const status = await Comment.deleteOne({_id: req.params.id});
  console.log(status);
  if(status.acknowledged === true) {
    res.redirect("/clubhouse/comments");
    return;
  } else {
    res.render("comment_delete", {title: "Delete Comment", id: req.params.id, errors: [{msg: "Invalid comment id."}]})
    return;
    }
});

module.exports = {
  index,
  comments_list_get,
  comment_form_get,
  comment_form_post,
  comment_delete_get,
  comment_delete_post,
}
