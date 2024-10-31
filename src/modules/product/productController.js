const { PrismaClient } = require('@prisma/client');
const productModel = require("../../../DB/model/product.model");
const prisma = new PrismaClient();
const catchError = require("../../middlewares/catchError");
const ApiFeatures = require("../../utils/apiFeatures");
const { addOne, getOne, updateOne, deleteOne } = require("../handlers/handler");
const { parse } = require('path');


const addProduct = addOne(prisma.product);

const getProducts = catchError(async (req, res, next) => {
    // Create an API features instance for filtering, sorting, and limiting fields
    let apiFeatures = new ApiFeatures(prisma.product, req.query)
        .filter()
        .sort()
        .search("product")
        .limitedFields();

    // Count total documents matching the filters
    const countDocuments = await prisma.product.count({
        where: {
            ...apiFeatures.prismaQuery.where,
            categoryId: req.query.categoryId ? parseInt(req.query.categoryId) : undefined, // Use categoryId for filtering
        },
    });

    // Handle pagination
    apiFeatures.paginateWithCount(countDocuments); // Call paginate after getting the count

    // Execute the query for the documents
    const products = await apiFeatures.exec(
        {
            include: {
                categoryId: true, // Include parent category data
            },
        }
    );

    // Create response object
    const response = {
        paginationResult: apiFeatures.paginationResult,
        products: products.result.map(product => {
            // Parse images, prepend URL, and stringify them back
            const imageArray = JSON.parse(product.images); // Assuming images is a JSON string
            const updatedImages = imageArray.map(img => process.env.MEDIA_BASE_URL + img);
            const imgCover = process.env.MEDIA_BASE_URL + product.imgCover; // Update imgCover URL

            return {
                ...product,
                imgCover,
                images: updatedImages,
            };
        }),
    };

    // Send the response
    res.json(response);
});



const getProduct = getOne(prisma.product);

const updateProduct = updateOne(prisma.product);

const deleteProduct = deleteOne(prisma.product);

module.exports = { addProduct, getProduct, getProducts, updateProduct, deleteProduct };
