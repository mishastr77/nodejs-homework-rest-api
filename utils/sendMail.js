const { InternalServerErrore } = require("http-errors");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { KEY_SENDGRID } = process.env;

sgMail.setApiKey(KEY_SENDGRID);

const sendMail = async (data) => {
  try {
    const mail = { ...data, from: "strilchuk.mykhaylo@gmail.com" };
    await sgMail.send(mail);
    return true;
  } catch (error) {
    throw new InternalServerErrore(error.message);
  }
};

module.exports = { sendMail };
