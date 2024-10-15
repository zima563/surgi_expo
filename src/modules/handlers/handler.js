const slugify = require("slugify");
const catchError = require("../../middlewares/catchError");
const apiError = require("../../utils/apiError");

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
    if (req.files?.imgCover) {
      req.body.imgCover = process.env.BASE_URL + req.files.imgCover[0].filename
    }
    if (req.files?.images) {
      req.body.images = req.files.images.map((val) => process.env.BASE_URL + val.filename);
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
    if (req.file) req.body.image = process.env.BASE_URL + req.file.filename;

    if (req.files?.imgCover) req.body.imgCover = process.env.BASE_URL + req.files.imgCover[0].filename;
    if (req.files?.images)
      req.body.images = req.files.images.map((val) => process.env.BASE_URL + val.filename);
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