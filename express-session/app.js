"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(
  (0, express_session_1.default)({
    secret: process.env["SECRET"],
    store: connect_mongo_1.default.create({
      mongoUrl: process.env["MONGO_URL"],
    }),
    cookie: { maxAge: 24 * 60 ** 1000 },
    resave: false,
    saveUninitialized: true,
  }),
);
app.get("/", (_req, res, _next) => res.send("<h1>Hello world (Sessions)</h1>"));
app.listen(3000);
console.log("Listening to http://localhost:3000");
