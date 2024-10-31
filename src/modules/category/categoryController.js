const { PrismaClient } = require('@prisma/client');
const categoryModel = require("../../../DB/model/category.model");
const prisma = new PrismaClient();
const catchError = require("../../middlewares/catchError");
const ApiFeatures = require("../../utils/apiFeatures");
const { addOne, getOne, updateOne, deleteOne } = require("../handlers/handler");

const addCategory = addOne(prisma.category);

const getCategories = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(prisma.category, { ...req.query, parentId: null })
    .filter()
    .sort()
    .search("category")
    .limitedFields();

  const countDocuments = await prisma.category.count({
    where: { parentId: null, ...apiFeatures.prismaQuery.where },
  });

  await apiFeatures.paginateWithCount(countDocuments);

  const categories = await prisma.category.findMany({
    where: apiFeatures.prismaQuery.where,
    select: {
      categoryId: true, // Include categoryId
      ...apiFeatures.prismaQuery.select,
    },
  });

  const response = {
    paginationResult: apiFeatures.paginationResult,
    categories: categories.map(category => ({
      ...category,
      image: process.env.MEDIA_BASE_URL + category.image,
    })),
  };

  res.json(response);
});

const getSubCategories = catchError(async (req, res, next) => {
  const parentId = req.params.parentId === 'null' ? null : parseInt(req.params.parentId, 10);

  let apiFeatures = new ApiFeatures(prisma.category, { ...req.query, parentId })
    .filter()
    .sort()
    .search("category")
    .limitedFields();

  const countDocuments = await prisma.category.count({
    where: { parentId, ...apiFeatures.prismaQuery.where },
  });

  await apiFeatures.paginateWithCount(countDocuments);

  const categories = await prisma.category.findMany({
    where: apiFeatures.prismaQuery.where,
    select: {
      categoryId: true, // Include categoryId
      ...apiFeatures.prismaQuery.select,
    },
  });

  const response = {
    paginationResult: apiFeatures.paginationResult,
    categories: categories.map(category => ({
      ...category,
      image: process.env.MEDIA_BASE_URL + category.image,
    })),
  };

  res.json(response);
});

const getCategory = getOne(prisma.category);

const updateCategory = updateOne(prisma.category);

const deleteCategory = deleteOne(prisma.category);

module.exports = {
  addCategory,
  getCategories,
  getSubCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
