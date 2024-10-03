const globalError = require("./middlewares/globalError");
const { categoryRouter } = require("./modules/category/categoryRoutes");
const { productRouter } = require("./modules/product/productRouters");



exports.bootstrap = (app) => {

    app.use("/api/categories", categoryRouter);
    app.use("/api/products", productRouter);

    app.get('/', (req, res) => res.send('Hello World!'))
    app.use(globalError)
}