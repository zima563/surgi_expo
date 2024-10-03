const express = require("express");
const {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} = require("./categoryController.js");
const {
  addCategoryVal,
  paramsIdVal,
  updateCategoryVal,
} = require("./categoryValidators.js");
const validation = require("../../middlewares/validation.js");
const { uploadSingleFile } = require("../../services/fileUpload/upload.js");
const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .post(
    uploadSingleFile("img"),
    validation(addCategoryVal),
    addCategory
  )
  .get(getCategories);

categoryRouter
  .route("/:id")
  .get(validation(paramsIdVal), getCategory)
  .put(
    uploadSingleFile("img"),
    validation(updateCategoryVal),
    updateCategory
  )
  .delete(
    validation(paramsIdVal),
    deleteCategory
  );

module.exports = { categoryRouter };
