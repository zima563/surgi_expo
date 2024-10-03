const categoryModel = require("../../../DB/model/category.model");
const { addOne, getAll, getOne, updateOne, deleteOne } = require("../handlers/handler");

const addCategory = addOne(categoryModel);

const getCategories = getAll(categoryModel, "category");

const getCategory = getOne(categoryModel);

const updateCategory = updateOne(categoryModel);

const deleteCategory = deleteOne(categoryModel);

module.exports = {
  addCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
