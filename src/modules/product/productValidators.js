const Joi = require("joi");

const addProductVal = Joi.object({
  title: Joi.string().min(2).max(100).required().trim(),
  description: Joi.string().trim().required().min(2).max(1000),
  brief: Joi.string().trim().required().min(2).max(1000),
  category: Joi.string().length(24).hex().required(),
  imgCover: Joi.array()
    .items(
      Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string()
          .valid("image/png", "image/jpg", "image/jpeg")
          .required(),
        // destination: Joi.string().required(),
        // filename: Joi.string().required(),
        // path: Joi.string().required(),
        buffer: Joi.any(),
        size: Joi.number().required(),
      })
    )
    .required(),

  images: Joi.array()
    .items(
      Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string()
          .valid("image/png", "image/jpg", "image/jpeg")
          .required(),
        // destination: Joi.string().required(),
        // filename: Joi.string().required(),
        // path: Joi.string().required(),
        buffer: Joi.any(),
        size: Joi.number().required(),
      })
    ),
});

const paramsVal = Joi.object({
  id: Joi.number().required(),
});

const updateProductVal = Joi.object({
  id: Joi.number().required(),

  title: Joi.string().min(2).max(100).optional().trim(),
  description: Joi.string().trim().optional().min(2).max(1000),
  brief: Joi.string().trim().min(2).max(1000),
  category: Joi.string().length(24).hex(),
  imgCover: Joi.array().items(
    Joi.object({
      fieldname: Joi.string().required(),
      originalname: Joi.string().required(),
      encoding: Joi.string().required(),
      mimetype: Joi.string()
        .valid("image/png", "image/jpg", "image/jpeg")
        .required(),
      // destination: Joi.string().required(),
      // filename: Joi.string().required(),
      // path: Joi.string().required(),
      buffer: Joi.any(),
      size: Joi.number().required(),
    })
  ),

  images: Joi.array().items(
    Joi.object({
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
    })
  ),
});

module.exports = { addProductVal, paramsVal, updateProductVal };
