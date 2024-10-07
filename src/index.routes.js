const globalError = require("./middlewares/globalError");
const { categoryRouter } = require("./modules/category/categoryRoutes");
const { productRouter } = require("./modules/product/productRouters");
const { userRouter } = require("./modules/user/user.routes");



exports.bootstrap = (app) => {

    app.use("/api/categories", categoryRouter);
    app.use("/api/products", productRouter);
    app.use("/api/users", userRouter);

    app.get('/', (req, res) => res.send('Hello World!'))
    app.use(globalError)
}