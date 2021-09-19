const { User } = require("../models/user");
const { Conflict, Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const { v4 } = require("uuid");
const { sendMail } = require("../utils");

const avatarsDir = path.join(__dirname, "../", "public/avatars");

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const avatarDefault = gravatar.url(email, { s: "200" }, true);
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict("Email in use");
  }
  const newUser = new User({
    email,
    avatarURL: `${avatarDefault}`,
    verificationToken: v4(),
  });
  newUser.setPassword(password);
  const id = newUser._id.toString();
  const dirPath = path.join(avatarsDir, id);
  await fs.mkdir(dirPath);
  const { verificationToken } = newUser;
  const data = {
    to: email,
    subject: "confirmation of registration on the site",
    html: `<a href="http://localhost:3000/users/verify/${verificationToken}" > Verify your registration </a>`,
  };
  await sendMail(data);
  await newUser.save();
  res.status(201).json({
    user: {
      email: email,
      subscription: "starter",
      avatarURL: avatarDefault,
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
    if (!user.verify) {
      throw new Unauthorized("Email not verified");
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

const updateAvatar = async (req, res) => {
  const { id } = req.user;
  const { path: tempPath, originalname } = req.file;
  const uploadPath = path.join(avatarsDir, id, originalname);
  try {
    const files = await Jimp.read(tempPath);
    await files.resize(150, 150).write(tempPath);
    await fs.rename(tempPath, uploadPath);
    const avatarURL = `/avatars/${id}/${originalname}`;
    await User.findByIdAndUpdate(id, { avatarURL });
    res.json({
      status: "success",
      code: 200,
      data: {
        result: avatarURL,
      },
    });
  } catch (error) {
    await fs.unlink(tempPath);
    throw error;
  }
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    res.status(404).json({
      message: "User not found",
    });
  }
  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });
  res.send("<h2>Verification successful</h2>");
};

module.exports = {
  signup,
  login,
  logout,
  current,
  updateAvatar,
  verify,
};
