const express = require("express");
const {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
  getSubCategories,
} = require("./categoryController.js");
const {
  addCategoryVal,
  paramsIdVal,
  updateCategoryVal,
} = require("./categoryValidators.js");
const validation = require("../../middlewares/validation.js");
const { uploadSingleFile } = require("../../services/fileUpload/upload.js");
const { protectRoutes } = require("../user/user.controller.js");
const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .post(
    protectRoutes,
    uploadSingleFile("img"),
    validation(addCategoryVal),
    addCategory
  )
  .get(getCategories);

categoryRouter.route("/sub/:parentId").get(getSubCategories);
categoryRouter.route("/sub").get(getSubCategories);



categoryRouter
  .route("/:id")
  .get(validation(paramsIdVal), getCategory)
  .put(
    protectRoutes,
    uploadSingleFile("img"),
    validation(updateCategoryVal),
    updateCategory
  )
  .delete(
    protectRoutes,
    validation(paramsIdVal),
    deleteCategory
  );

module.exports = { categoryRouter };
