const slugify = require("slugify");
const catchError = require("../../middlewares/catchError");
const apiError = require("../../utils/apiError");
const cloudinary = require("cloudinary");
const sharp = require("sharp");

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
    if (req.file && req.file.buffer) {
      const compressedImageBuffer = await sharp(req.file.buffer)
        .jpeg({ quality: 70 }) // Adjust quality to reduce size, keeping around ~100 KB
        .toBuffer();

      req.file.buffer = compressedImageBuffer; // Replace the original buffer with the compressed buffer
      req.body.image = req.file.filename;
    }

    if (req.files?.imgCover && req.files.imgCover[0].buffer) {
      const compressedImgCoverBuffer = await sharp(req.files.imgCover[0].buffer)
        .jpeg({ quality: 70 }) // Compress imgCover to ~100 KB
        .toBuffer();

      req.files.imgCover[0].buffer = compressedImgCoverBuffer; // Replace the original buffer
      req.body.imgCover = req.files.imgCover[0].filename;
    }
    if (req.files?.images) {
      req.body.images = [];

      for (const file of req.files.images) {
        const compressedImageBuffer = await sharp(file.buffer)
          .jpeg({ quality: 70 }) // Compress each image
          .toBuffer();

        file.buffer = compressedImageBuffer; // Replace the original buffer with the compressed buffer
        req.body.images.push(file.filename);
      }
    }
    let document = await model.findByIdAndUpdate(req.params.id, req.body, {
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
    if (req.file && req.file.buffer) {
      const compressedImageBuffer = await sharp(req.file.buffer)
        .jpeg({ quality: 70 }) // Adjust quality to reduce size, keeping around ~100 KB
        .toBuffer();

      req.file.buffer = compressedImageBuffer; // Replace the original buffer with the compressed buffer
      req.body.image = req.file.filename;
    }

    if (req.files?.imgCover && req.files.imgCover[0].buffer) {
      const compressedImgCoverBuffer = await sharp(req.files.imgCover[0].buffer)
        .jpeg({ quality: 70 }) // Compress imgCover to ~100 KB
        .toBuffer();

      req.files.imgCover[0].buffer = compressedImgCoverBuffer; // Replace the original buffer
      req.body.imgCover = req.files.imgCover[0].filename;
    }
    if (req.files?.images) {
      req.body.images = [];

      for (const file of req.files.images) {
        const compressedImageBuffer = await sharp(file.buffer)
          .jpeg({ quality: 70 }) // Compress each image
          .toBuffer();

        file.buffer = compressedImageBuffer; // Replace the original buffer with the compressed buffer
        req.body.images.push(file.filename);
      }
    }
    let document = new model(req.body);

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