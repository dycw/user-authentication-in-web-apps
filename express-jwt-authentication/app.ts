import express from "express";
import router from "./routes";
import { fileURLToPath } from "url";
import cors from "cors";
import path from "path";
import passportConfig from "./config/passport";
import passport from "passport";
import dotenv from "dotenv";

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
dotenv.config();

// Create the Express application
const app = express();

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
import "./config/database";

// Must first load the models
import "./models/user";

// Pass the global passport object into the configuration function
passportConfig(passport);

// This will initialize the passport object on every request
app.use(passport.initialize());

// Instead of using body-parser middleware, use the new Express implementation of the same thing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allows our Angular application to make HTTP requests to Express application
app.use(cors());

// Where Angular builds to - In the ./angular/angular.json file, you will find this configuration
// at the property: projects.angular.architect.build.options.outputPath
// When you run `ng build`, the output will go to the ./public directory
const __dirname = fileURLToPath(new URL(".", import.meta.url));
app.use(express.static(path.join(__dirname, "public")));

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(router);

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000);
