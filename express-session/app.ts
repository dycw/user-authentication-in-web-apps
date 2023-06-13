import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import session from "express-session";
import express from "express";

dotenv.config();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env["SECRET"]!,
    store: MongoStore.create({
      mongoUrl: process.env["MONGO_URL"],
      collectionName: "sessions",
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    resave: false,
    saveUninitialized: true,
  }),
);

app.get("/", (req, res, _next) => {
  if (req.session.viewCount) {
    req.session.viewCount = req.session.viewCount + 1;
  } else {
    req.session.viewCount = 0;
  }
  res.send(
    `<h1>You hav evisited this page ${req.session.viewCount} time(s)</h1>`,
  );
});

app.listen(3000);

console.log("Listening to http://localhost:3000");
