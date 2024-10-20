const slugify = require("slugify");
const catchError = require("../../middlewares/catchError");
const apiError = require("../../utils/apiError");
const cloudinary = require("cloudinary")
const fs = require('fs');
const path = require('path');
const sharp = require("sharp")

cloudinary.config({
  cloud_name: "dnrfbxmc3",
  api_key: "518374656112347",
  api_secret: "_zgNFNuYi5CfkrW53NQ059sh-KA",
});

const deleteOne = (model) => {
  return catchError(async (req, res, next) => {
    let document = await model.findByIdAndDelete(req.params.id);
    !document && next(new apiError("not document found", 404));
    document && res.json(document);
  });
};

const updateOne = (model) => {
  return catchError(async (req, res, next) => {
    if (req.body.title) req.body.slug = slugify(req.body.title);
    if (req.body.name) req.body.slug = slugify(req.body.name);
    // Fetch the existing document
    let document = await model.findById(req.params.id);
    if (!document) return next(new apiError("Document not found", 404));

    // Define a helper function to delete a file
    const deleteFile = (filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
      }
    };
    // Process single image
    if (req.file) {
      // Define the path to save the processed image
      const imagePath = path.join('uploads/', `resized-${Date.now()}-${req.file.originalname}`);

      // Use Sharp to resize and reduce quality
      await sharp(req.file.buffer)
        .resize(800) // Resize width to 800px, keeping aspect ratio
        .jpeg({ quality: 60 }) // Reduce quality to 60%
        .toFile(imagePath); // Save the processed image

      // Delete the old image if it exists
      if (document.image) {
        deleteFile(path.join('uploads/', document.image));
      }
      // Save the filename to the database
      req.body.image = path.basename(imagePath);
    }

    // Process multiple images (imgCover and images arrays)
    if (req.files?.imgCover) {
      const imgCoverPath = path.join('uploads/', `cover-${Date.now()}-${req.files.imgCover[0].originalname}`);

      await sharp(req.files.imgCover[0].buffer)
        .resize(800)
        .jpeg({ quality: 60 })
        .toFile(imgCoverPath);

      // Delete the old imgCover if it exists
      if (document.imgCover) {
        deleteFile(path.join('uploads/', document.imgCover));
      }

      req.body.imgCover = path.basename(imgCoverPath);
    }

    if (req.files?.images) {

      // Delete old images if they exist
      if (document.images && document.images.length > 0) {
        document.images.forEach((img) => {
          deleteFile(path.join('uploads/', img));
        });
      }
      req.body.images = await Promise.all(
        req.files.images.map(async (file) => {
          const imgPath = path.join('uploads/', `image-${Date.now()}-${file.originalname}`);

          // Process each image
          await sharp(file.buffer)
            .resize(800)
            .jpeg({ quality: 60 })
            .toFile(imgPath);

          return path.basename(imgPath);
        })
      );
    }
    document = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    !document && next(new apiError("not document found", 404));
    document && res.json(document);
  });
};

const addOne = (model) => {
  return catchError(async (req, res, next) => {
    if (req.body.title) req.body.slug = slugify(req.body.title);
    if (req.body.name) req.body.slug = slugify(req.body.name);
    if (req.params.category) req.body.category = req.params.category;

    // Process single image
    if (req.file) {


      // Define the path to save the processed image
      const imagePath = path.join('uploads/', `resized-${Date.now()}-${req.file.originalname}`);

      // Use Sharp to resize and reduce quality
      await sharp(req.file.buffer)
        .resize(800) // Resize width to 800px, keeping aspect ratio
        .jpeg({ quality: 60 }) // Reduce quality to 60%
        .toFile(imagePath); // Save the processed image

      // Save the filename to the database
      req.body.image = path.basename(imagePath);
    }

    // Process multiple images (imgCover and images arrays)
    if (req.files?.imgCover) {
      const imgCoverPath = path.join('uploads/', `cover-${Date.now()}-${req.files.imgCover[0].originalname}`);

      await sharp(req.files.imgCover[0].buffer)
        .resize(800)
        .jpeg({ quality: 60 })
        .toFile(imgCoverPath);

      req.body.imgCover = path.basename(imgCoverPath);
    }

    if (req.files?.images) {
      req.body.images = await Promise.all(
        req.files.images.map(async (file) => {
          const imgPath = path.join('uploads/', `image-${Date.now()}-${file.originalname}`);

          // Process each image
          await sharp(file.buffer)
            .resize(800)
            .jpeg({ quality: 60 })
            .toFile(imgPath);

          return path.basename(imgPath);
        })
      );
    }
    await document.save();
    res.json(document);
  });
};

// const getAll = (model, modelName) => {
//   return catchError(async (req, res, next) => {
//     // Apply filters, search, etc. but don't paginate yet.
//     let apiFeatures = new ApiFeatures(model.find({ parentId: null }), req.query)
//       .filter()
//       .sort()
//       .search(modelName)
//       .limitedFields();

//     let filteredQuery = apiFeatures.mongooseQuery; // Get the filtered query
//     let countDocuments = await filteredQuery.clone().countDocuments().maxTimeMS(30000); // Use clone to reuse the query for counting

//     // Now paginate using the filtered count
//     apiFeatures.paginate(countDocuments); // Call paginate after getting the count

//     // Execute the query for the documents
//     const { mongooseQuery, paginationResult } = apiFeatures;
//     let document = await mongooseQuery;

//     res.json({ countDocuments, paginationResult, document });
//   });
// };

// const getAllSubcategories = (model, modelName) => {
//   return catchError(async (req, res, next) => {
//     // Apply filters, search, etc. but don't paginate yet.
//     let apiFeatures = new ApiFeatures(model.find({ parentId: req.params.parentId }), req.query)
//       .filter()
//       .sort()
//       .search(modelName)
//       .limitedFields();

//     let filteredQuery = apiFeatures.mongooseQuery; // Get the filtered query
//     let countDocuments = await filteredQuery.clone().countDocuments().maxTimeMS(30000); // Use clone to reuse the query for counting

//     // Now paginate using the filtered count
//     apiFeatures.paginate(countDocuments); // Call paginate after getting the count

//     // Execute the query for the documents
//     const { mongooseQuery, paginationResult } = apiFeatures;
//     let document = await mongooseQuery.populate({
//       path: 'parentId',  // The field that contains the reference to the category
//       select: 'name' // Select the fields you want to populate
//     });

//     res.json({ countDocuments, paginationResult, document });
//   });
// };

const getOne = (model) => {
  return catchError(async (req, res, next) => {
    let document = await model.findById(req.params.id);
    !document && next(new apiError("not document found", 404));
    document && res.json(document);
  });
};

module.exports = {
  updateOne,
  deleteOne,
  getOne,
  // getAll,
  // getAllSubcategories,
  addOne
}