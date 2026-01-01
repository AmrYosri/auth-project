const User = require("./../models/userModel");

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
      status: "faild",
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
      status: "faild",
      message: err.message,
    });
  }
};
