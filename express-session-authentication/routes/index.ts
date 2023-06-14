import express from "express";
import passport from "passport";
import { genPassword } from "../lib/passwordUtils";
import connection from "../config/database";
import { isAdmin, isAuth } from "./authMiddleware";

const router = express.Router();
const User = connection.models.User;

/**
 * -------------- POST ROUTES ----------------
 */

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  }),
);

router.post("/register", async (req, res, _next) => {
  const { salt, hash } = genPassword(req.body.pw);
  const newUser = new User({
    username: req.body.uname,
    salt,
    hash,
    admin: true,
  });
  const user = await newUser.save();
  console.log(user);
  res.redirect("/login");
});

/**
 * -------------- GET ROUTES ----------------
 */

router.get("/", (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get("/login", (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
     Enter Username:<br><input type="text" name="username">\
     <br>Enter Password:<br><input type="password" name="password">\
     <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get("/register", (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
     Enter Username:<br><input type="text" name="username">\
     <br>Enter Password:<br><input type="password" name="password">\
     <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behaviour express session has without a maxage set
 */
router.get("/protected-route", isAuth, (_req, res, _next) => {
  res.send("You made it to the route.");
});

router.get("/admin-route", isAdmin, (_req, res, _next) => {
  res.send("You made it to the admin route.");
});

// Visiting this route logs the user out
router.get("/logout", (req, res, _next) => {
  req.logout();
  res.redirect("/protected-route");
});

router.get("/login-success", (_req, res, _next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>',
  );
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

export default router;
