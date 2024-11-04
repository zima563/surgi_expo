const { default: mongoose } = require("mongoose");
const categoryModel = require("./DB/model/category.model");
const productModel = require("./DB/model/product.model");
const { PrismaClient } = require('@prisma/client');
const dbConnection = require("./DB/dbConnection");
const userModel = require("./DB/model/user.model");



const prisma = new PrismaClient();
dbConnection();
// Function to fetch data
async function fetchData() {
    const categories = await categoryModel.find().lean();
    const products = await productModel.find().lean();
    const users = await userModel.find().lean();

    return { categories, products, users };
}



async function migrateData() {
    try {
        const { categories, products, users } = await fetchData();

        // Migrate categories
        for (const category of categories) {
            await prisma.category.create({
                data: {
                    name: category.name,
                    image: category.image,
                    description: category.description,
                    parentId: category.parentId ? parseInt(category.parentId) : null,
                },
            });
        }

        // Migrate products
        for (const product of products) {
            await prisma.product.create({
                data: {
                    title: product.title,
                    slug: product.slug,
                    description: product.description,
                    brief: product.brief,
                    imgCover: product.imgCover,
                    images: product.images ? JSON.stringify(product.images) : null,
                    categoryId: product.category ? parseInt(product.category) : null,
                },
            });
        }

        // Migrate users
        for (const user of users) {
            await prisma.user.create({
                data: {
                    userName: user.userName,
                    email: user.email,
                    password: user.password, // Ensure that you hash the password as needed
                },
            });
        }

        console.log('Data migration completed!');
    } catch (error) {
        console.error('Error migrating data:', error);
    } finally {
        await prisma.$disconnect();
        mongoose.connection.close();
    }
}

migrateData();

