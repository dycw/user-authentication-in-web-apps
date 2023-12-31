import express, {
  type ErrorRequestHandler,
  type RequestHandler,
} from "express";

const app = express();

const middleware1: RequestHandler = (req, _res, next) => {
  req.customProperty = 100;
  next();
};

const middleware2: RequestHandler = (req, _res, next) => {
  console.log(`The custom property value is: ${req.customProperty}`);
  req.customProperty = 600;
  next();
};

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  res.json({ err });
};

app.use(middleware1);
app.use(middleware2);

app.get("/", (req, res, _next) => {
  res.send(`<h1>The custom property value is: ${req.customProperty}</h1>`);
});

app.use(errorHandler); // must be at the end

app.listen(3000);

console.log("Express server listening to http://localhost:3000");
