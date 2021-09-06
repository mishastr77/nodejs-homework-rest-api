const { User } = require("../models/user");
const { Conflict, Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict("Email in use");
  }
  const newUser = new User({ email });
  newUser.setPassword(password);
  await newUser.save();
  res.status(201).json({
    user: {
      email: email,
      subscription: "starter",
    },
  });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.validPassword(password)) {
      throw new Unauthorized("Email or password is wrong");
    }
    const payload = {
      id: user._id,
    };
    const { SECRET_KEY } = process.env;
    const token = jwt.sign(payload, SECRET_KEY);
    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).json({
      token: token,
      user: {
        email: email,
        subscription: "starter",
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { toren: null });
  res.json({ Status: 204, message: "No Content" });
};

const current = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription,
  });
};

module.exports = {
  signup,
  login,
  logout,
  current,
};
