const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    newUser.password = undefined;
    const token = newUser.signToken();
    console.log("Token:", token);
    res.status(201).json({
      status: "success",
      token: token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (
      !user ||
      !(await user.correctPassword(req.body.password, user.password))
    ) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }
    const token = user.signToken();
    user.password = undefined;
    res.status(200).json({
      status: "success",
      token: token,
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log("token : ", token);
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "you are not logged in !",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User no longer exists ",
      });
    }
    console.log("Decoded : ", decoded);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: "invalid token !",
    });
  }
};
exports.getMe = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
};
