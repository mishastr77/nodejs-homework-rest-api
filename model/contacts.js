const { Schema, model } = require("mongoose");
const Joi = require("joi");

const contactSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const joiContactSchemaMain = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z' '\-()0-9]{3,30}$/)
    .required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: false }).required(),
  phone: Joi.string()
    .pattern(/^[' '\-()0-9]{3,30}$/)
    .required(),
  favorite: Joi.boolean().optional(),
});

const joiSchemaForFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});

const Contact = model("contact", contactSchema);

module.exports = {
  Contact,
  joiContactSchemaMain,
  joiSchemaForFavorite,
};
