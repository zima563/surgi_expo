const productModel = require("../../../DB/model/product.model");
const { addOne, getAll, getOne, updateOne, deleteOne } = require("../handlers/handler");

const addProduct = addOne(productModel);

const getProducts = getAll(productModel, "product");

const getProduct = getOne(productModel);

const updateProduct = updateOne(productModel);

const deleteProduct = deleteOne(productModel);

module.exports = { addProduct, getProduct, getProducts, updateProduct, deleteProduct };
