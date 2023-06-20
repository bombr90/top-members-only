const express = require("express");

module.exports = function(passport){  
  const router = express.Router();

  // Require controller modules.
  const member_controller = require("../controllers/memberController");
  const comment_controller = require("../controllers/commentController");
  const auth_controller = require("../controllers/authController")(passport);

  const {
    loginRules,
    createRules,
    upgradeRules,
    commentRules,
    validate,
  } = require("../controllers/validatorController");

  const asyncHandler = require("express-async-handler");
 
  // MIddleware For debugging and verification
  
  const checkAuthenticated = (req, res, next) => {
    return req.isAuthenticated() ? next() : res.redirect('/clubhouse/member/login')
  }

  const redirectIfAuthenticated = (req,res,next) => {
    req.isAuthenticated() ? 
      res.redirect(`/clubhouse/member/${req.user._id}`) : 
      next(); 
  }

  const checkRole = (roles = []) => (req, res, next) => {
    (roles.includes(req.user.role)) ?
      next() :
      res.status(401).json("Insufficient access privileges, upgrade your membership.");
  }  
  
  // MEMBER ROUTES

  // Get Clubhouse home page.
  router.get("/", comment_controller.index);

  router.get(
    "/member/create",
    redirectIfAuthenticated,
    member_controller.member_create_get
  );
  router.get(
    "/member/login",
    redirectIfAuthenticated,
    member_controller.member_login_get
  );
  router.get(
    "/member/upgrade",
    checkAuthenticated,
    member_controller.member_upgrade_get
  );
  router.get(
    "/member/logout",
    checkAuthenticated,
    auth_controller.auth_logout_get
  );
  router.get("/comments", comment_controller.comments_list_get);

  router.get(
    "/comment/new",
    checkAuthenticated,
    checkRole(['member','admin']),
    comment_controller.comment_form_get
  );

  router.post(
    "/comment/delete/:id",
    checkAuthenticated,
    checkRole(["admin"]),
    comment_controller.comment_delete_post
  );

  router.get(
    "/comment/delete/:id",
    checkAuthenticated,
    checkRole(["admin"]),
    comment_controller.comment_delete_get
  );

  router.get(
    "/member/details",
    checkAuthenticated, 
    async (req, res) => {
      res.redirect(`/clubhouse/member/${req.user._id}`);
    }
  );

  router.get(
    "/member/:id",
    checkAuthenticated,
    member_controller.member_details_get
  );


  // POST ROUTES
  router.post(
    "/member/create",
    redirectIfAuthenticated,
    createRules(),
    validate,
    member_controller.member_create_post
  );
  
  router.post(
    "/member/login",
    redirectIfAuthenticated,
    loginRules(),
    validate,
    auth_controller.auth_login_post,
  );


  router.post(
    "/member/upgrade",
    checkAuthenticated,
    upgradeRules(),
    validate,
    member_controller.member_upgrade_post
  );

  router.post(
    "/comment/new",
    checkAuthenticated,
    commentRules(),
    validate,
    comment_controller.comment_form_post
  );
  return router;
}
