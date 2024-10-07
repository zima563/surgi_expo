const express = require("express");

const {
  addProductVal,
  paramsVal,
  updateProductVal,
} = require("./productValidators.js");
const validation = require("../../middlewares/validation.js");
const {
  addProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("./productController.js");
const { uploadFieldsOfFiles } = require("../../services/fileUpload/upload.js");
const { protectRoutes } = require("../user/user.controller.js");

const productRouter = express.Router();

productRouter
  .route("/")
  .post(
    protectRoutes,
    uploadFieldsOfFiles([
      { name: "imgCover", maxCounts: 1 },
      { name: "images", maxCounts: 10 },
    ]),
    validation(addProductVal),
    addProduct
  )
  .get(getProducts);

productRouter
  .route("/:id")
  .get(validation(paramsVal), getProduct)
  .put(
    protectRoutes,
    uploadFieldsOfFiles([
      { name: "imgCover", maxCounts: 1 },
      { name: "images", maxCounts: 10 },
    ]),
    validation(updateProductVal),
    updateProduct
  )
  .delete(
    protectRoutes,
    validation(paramsVal),
    deleteProduct
  );

module.exports = { productRouter };
