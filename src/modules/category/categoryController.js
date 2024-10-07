const categoryModel = require("../../../DB/model/category.model");
const { addOne, getAll, getOne, updateOne, deleteOne, getAllSubcategories } = require("../handlers/handler");

const addCategory = addOne(categoryModel);

const getCategories = getAll(categoryModel, "category");

const getSubCategories = getAllSubcategories(categoryModel, "subcategory");

const getCategory = getOne(categoryModel);

const updateCategory = updateOne(categoryModel);

const deleteCategory = deleteOne(categoryModel);

module.exports = {
  addCategory,
  getCategories,
  getSubCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
