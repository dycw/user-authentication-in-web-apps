import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import crypto from "crypto";
import MongoStore from "connect-mongo";
import routes from "./routes";
import connection from "./config/database";

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
dotenv.config();

// Create the Express application
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * -------------- SESSION SETUP ----------------
 */

app.use(
  session({
    secret: process.env["SECRET"]!,
    store: MongoStore.create({
      mongoUrl: process.env["DB_STRING"],
      collectionName: "sessions",
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    resave: false,
    saveUninitialized: true,
  }),
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

// Need to require the entire Passport config module so app.js knows about it
import "./config/passport";

app.use(passport.initialize());
app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000);
console.log("Express app listening to http://localhost:3000");
