const productModel = require("../../../DB/model/product.model");
const catchError = require("../../middlewares/catchError");
const ApiFeatures = require("../../utils/apiFeatures");
const { addOne, getOne, updateOne, deleteOne } = require("../handlers/handler");
const { protectRoutes } = require("../user/user.controller");

const addProduct = addOne(productModel);

const getProducts = catchError(async (req, res, next) => {
    // const redisKey = `products:${JSON.stringify(req.query)}`; // Generate a unique key based on query parameters

    // // Check if data exists in Redis cache
    // let cachedData = await redisClient.get(redisKey);

    // if (cachedData) {
    //     // If cached data exists, return it
    //     return res.json(JSON.parse(cachedData));
    // }

    // Apply filters, search, etc., but don't paginate yet
    let apiFeatures = new ApiFeatures(productModel.find({ parentId: null }), req.query)
        .filter()
        .sort()
        .search("category")
        .limitedFields();

    let filteredQuery = apiFeatures.mongooseQuery; // Get the filtered query
    let countDocuments = await filteredQuery.clone().countDocuments().maxTimeMS(30000); // Use clone to reuse the query for counting

    // Now paginate using the filtered count
    apiFeatures.paginate(countDocuments); // Call paginate after getting the count

    // Execute the query for the documents
    const { mongooseQuery, paginationResult } = apiFeatures;
    let products = await mongooseQuery;
    products = products.map(product => {
        product.imgCover = process.env.MEDIA_BASE_URL + product.imgCover;
        product.images.map(img => {
            return process.env.MEDIA_BASE_URL + img;
        })
        return product;
    })

    const response = { countDocuments, paginationResult, products };

    // Store the response in Redis cache with a TTL (Time To Live) of 1 hour
    // await redisClient.set(redisKey, JSON.stringify(response), 'EX', 3600); // 3600 seconds = 1 hour

    res.json(response);
});

const getProduct = getOne(productModel);

const updateProduct = updateOne(productModel);

const deleteProduct = deleteOne(productModel);

module.exports = { addProduct, getProduct, getProducts, updateProduct, deleteProduct };
