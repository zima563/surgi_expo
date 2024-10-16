const slugify = require("slugify");
const catchError = require("../../middlewares/catchError");
const apiError = require("../../utils/apiError");
const cloudinary = require("cloudinary")

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
    // Upload single image file to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.image = result.secure_url; // Save the Cloudinary URL
    }

    // Upload cover image to Cloudinary if provided
    if (req.files?.imgCover) {
      const coverResult = await cloudinary.uploader.upload(req.files.imgCover[0].path);
      req.body.imgCover = coverResult.secure_url; // Save the Cloudinary URL
    }

    // Upload multiple images to Cloudinary if provided
    if (req.files?.images) {
      const imageUploadPromises = req.files.images.map((file) =>
        cloudinary.uploader.upload(file.path)
      );
      const imageResults = await Promise.all(imageUploadPromises);
      req.body.images = imageResults.map((result) => result.secure_url); // Save the Cloudinary URLs
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
    // Upload single image file to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.image = result.secure_url; // Save the Cloudinary URL
    }

    // Upload cover image to Cloudinary if provided
    if (req.files?.imgCover) {
      const coverResult = await cloudinary.uploader.upload(req.files.imgCover[0].path);
      req.body.imgCover = coverResult.secure_url; // Save the Cloudinary URL
    }

    // Upload multiple images to Cloudinary if provided
    if (req.files?.images) {
      const imageUploadPromises = req.files.images.map((file) =>
        cloudinary.uploader.upload(file.path)
      );
      const imageResults = await Promise.all(imageUploadPromises);
      req.body.images = imageResults.map((result) => result.secure_url); // Save the Cloudinary URLs
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