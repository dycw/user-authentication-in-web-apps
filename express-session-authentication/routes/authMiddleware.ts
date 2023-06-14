import { RequestHandler } from "express";

export const isAuth: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(401)
      .json({ msg: "You are not authorized to view this resource" });
  }
};

export const isAdmin: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    next();
  } else {
    res.status(401).json({
      msg: "You are not authorized to view this resource because you are not an admin",
    });
  }
};
