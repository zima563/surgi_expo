const express = require('express')
const cors = require("cors");
const dotenv = require("dotenv");
const dbConnection = require('./DB/dbConnection');
const { bootstrap } = require('./src/index.routes');
const { login } = require('./src/modules/user/user.controller');
const compression = require('compression')

const app = express()



dotenv.config();

// dbConnection();
app.use("/", express.static("uploads"));
app.use(compression());
app.use(express.json())
app.use(cors({ origin: process.env.URL }))

bootstrap(app)

app.listen(process.env.PORT || 3000, () => console.log(`Example app listening on port ${process.env.PORT || 3000}!`))