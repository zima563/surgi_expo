const { PrismaClient } = require('@prisma/client');
const categoryModel = require("../../../DB/model/category.model");
const prisma = new PrismaClient();
// const redisClient = require("../../../DB/redis");
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

  // Get the count for pagination
  const countDocuments = await prisma.category.count({
    where: { parentId: null, ...apiFeatures.prismaQuery.where }, // Include the where conditions
  });

  await apiFeatures.paginateWithCount(countDocuments); // Call paginate after getting the count

  // Execute the query for the documents
  const categories = await apiFeatures.exec(
    {
      include: {
        parentId: true, // Include parent category data
      },
    }
  );

  // Create the response object
  const response = {
    paginationResult: apiFeatures.paginationResult, // Include pagination details
    categories: categories.result.map(category => ({
      ...category,
      image: "https://media.surgi-expo.com/" + category.image, // Update image URL
    })),
  };

  res.json(response);
});

const getSubCategories = catchError(async (req, res, next) => {
  // Parse parentId as an integer or null if "null" is provided
  const parentId = req.params.parentId === 'null' ? null : parseInt(req.params.parentId, 10);
  // Initialize ApiFeatures with parentId from `req.params.id`
  let apiFeatures = new ApiFeatures(prisma.category, { ...req.query, parentId })
    .filter()
    .sort()
    .search("category")
    .limitedFields();



  // Get the count of documents that match the `parentId`
  const countDocuments = await prisma.category.count({
    where: { parentId, ...apiFeatures.prismaQuery.where },
  });


  // Use the count for pagination
  await apiFeatures.paginateWithCount(countDocuments);

  // Execute the query to get categories
  const categories = await apiFeatures.exec("category")

  // Prepare the response
  const response = {
    paginationResult: apiFeatures.paginationResult,
    categories: categories.result.map(category => ({
      ...category,
      image: process.env.MEDIA_BASE_URL + category.image,
    })),
  };

  res.json(response);
});

const getSubCategoriesAll = catchError(async (req, res, next) => {
  // Initialize ApiFeatures with parentId from `req.params.id` if provided
  let apiFeatures = new ApiFeatures(prisma.category, { ...req.query, parentId: { not: null } })
    .filter()
    .sort()
    .search("category")
    .limitedFields();

  // Define the base where condition to only get categories with `parentId` not null
  const baseWhereCondition = {
    parentId: { not: null },
    ...apiFeatures.prismaQuery.where,
  };

  // Get the count of documents that match the `parentId` condition
  const countDocuments = await prisma.category.count({
    where: baseWhereCondition,
  });

  // Use the count for pagination
  await apiFeatures.paginateWithCount(countDocuments);

  // Execute the query to get categories with `parentId` not null
  const categories = await apiFeatures.exec("category");

  // Prepare the response
  const response = {
    paginationResult: apiFeatures.paginationResult,
    categories: categories.result.map(category => ({
      ...category,
      image: process.env.MEDIA_BASE_URL + category.image,
    })),
  };

  res.json(response);
});

const getCategory = getOne(prisma.category, "category");

const updateCategory = updateOne(prisma.category);

const deleteCategory = deleteOne(prisma.category);

module.exports = {
  addCategory,
  getCategories,
  getSubCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  getSubCategoriesAll
};
