const Joi = require("joi");

const addCategoryVal = Joi.object({
  name: Joi.string().min(2).max(100).trim().required(),
  description: Joi.string().min(10).max(500).trim().optional(),
  parentId: Joi.number().optional(),
  image: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/png", "image/jpg", "image/jpeg")
      .required(),
    // destination: Joi.string().required(),
    // filename: Joi.string().required(),
    // path: Joi.string().required(), 
    size: Joi.number().required(),
    buffer: Joi.any(),
  }).required(),
});

const paramsIdVal = Joi.object({
  id: Joi.number().required(),
});

const updateCategoryVal = Joi.object({
  id: Joi.number().required(),

  name: Joi.string().min(2).max(100).trim(),
  description: Joi.string().min(10).max(1500).trim().optional(),
  parentId: Joi.number().optional(),
  image: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/png", "image/jpg", "image/jpeg")
      .required(),
    // destination: Joi.string().required(),
    // filename: Joi.string().required(),
    // path: Joi.string().required(),
    size: Joi.number().required(),
    buffer: Joi.any(),
  }),
});

module.exports = { addCategoryVal, paramsIdVal, updateCategoryVal };
