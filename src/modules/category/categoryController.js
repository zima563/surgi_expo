const categoryModel = require("../../../DB/model/category.model");
// const redisClient = require("../../../DB/redis");
const catchError = require("../../middlewares/catchError");
const ApiFeatures = require("../../utils/apiFeatures");
const { addOne, getOne, updateOne, deleteOne } = require("../handlers/handler");

const addCategory = addOne(categoryModel);

const getCategories = catchError(async (req, res, next) => {
  // const redisKey = `categories:${JSON.stringify(req.query)}`; // Generate a unique key based on query parameters

  // // Check if data exists in Redis cache
  // let cachedData = await redisClient.get(redisKey);

  // if (cachedData) {
  //   // If cached data exists, return it
  //   return res.json(JSON.parse(cachedData));
  // }

  // Apply filters, search, etc., but don't paginate yet
  let apiFeatures = new ApiFeatures(categoryModel.find({ parentId: null }), req.query)
    .filter()
    .sort({ createdAt: -1 })
    .search("category")
    .limitedFields();

  let filteredQuery = apiFeatures.mongooseQuery; // Get the filtered query
  let countDocuments = await filteredQuery.clone().countDocuments().maxTimeMS(30000); // Use clone to reuse the query for counting

  // Now paginate using the filtered count
  apiFeatures.paginate(countDocuments); // Call paginate after getting the count

  // Execute the query for the documents
  const { mongooseQuery, paginationResult } = apiFeatures;
  let categories = await mongooseQuery;
  categories = categories.map(category => {
    category.image = process.env.MEDIA_BASE_URL + category.image;
    return category;
  })
  const response = { countDocuments, paginationResult, categories };

  // Store the response in Redis cache with a TTL (Time To Live) of 1 hour
  // await redisClient.set(redisKey, JSON.stringify(response), 'EX', 3600); // 3600 seconds = 1 hour

  res.json(response);
});

const getSubCategories = catchError(async (req, res, next) => {
  // const redisKey = `subCategories:${req.params.parentId}:${JSON.stringify(req.query)}`; // Generate a unique key based on parentId and query parameters

  // // Check if data exists in Redis cache
  // let cachedData = await redisClient.get(redisKey);

  // if (cachedData) {
  //   // If cached data exists, return it
  //   return res.json(JSON.parse(cachedData));
  // }

  // Apply filters, search, etc., but don't paginate yet
  let apiFeatures = new ApiFeatures(categoryModel.find({ parentId: req.params.parentId }), req.query)
    .filter()
    .sort({ createdAt: -1 })
    .search("category")
    .limitedFields();

  let filteredQuery = apiFeatures.mongooseQuery; // Get the filtered query
  let countDocuments = await filteredQuery.clone().countDocuments().maxTimeMS(30000); // Use clone to reuse the query for counting

  // Now paginate using the filtered count
  apiFeatures.paginate(countDocuments); // Call paginate after getting the count

  // Execute the query for the documents
  const { mongooseQuery, paginationResult } = apiFeatures;
  let categories = await mongooseQuery;
  categories = categories.map(category => {
    category.image = process.env.MEDIA_BASE_URL + category.image;
    return category;
  })
  // Create the response object
  const response = { countDocuments, paginationResult, categories };

  // Store the response in Redis cache with a TTL (Time To Live) of 1 hour
  // await redisClient.set(redisKey, JSON.stringify(response), 'EX', 3600); // 3600 seconds = 1 hour

  // Return the response
  res.json(response);
});


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
