const slugify = require("slugify");
const catchError = require("../../middlewares/catchError");
const apiError = require("../../utils/apiError");
const fs = require('fs');
const path = require('path');
const sharp = require("sharp");
const { v4: uuidv4 } = require('uuid');


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
      // Clean up filename by replacing spaces with underscores (optional)
      let cleanedFilename = req.file.originalname
        .replace(/\s+/g, '_')          // Replace spaces with underscores
        .replace(/[^a-zA-Z0-9_.]/g, ''); // Remove all special characters except letters, numbers, underscores, and dots

      const resizedFilename = uuidv4() + encodeURIComponent(cleanedFilename);
      // Define the path to save the processed image
      const imagePath = path.join('uploads/', resizedFilename);

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
      req.body.image = resizedFilename;
    }

    // Process multiple images (imgCover and images arrays)
    if (req.files?.imgCover) {

      // Clean up filename by replacing spaces with underscores (optional)
      let cleanedFilename = req.files.imgCover[0].originalname
        .replace(/\s+/g, '_')          // Replace spaces with underscores
        .replace(/[^a-zA-Z0-9_.]/g, ''); // Remove all special characters except letters, numbers, underscores, and dots

      const resizedFilename = "cover-" + uuidv4() + encodeURIComponent(cleanedFilename);
      const imgCoverPath = path.join('uploads/', resizedFilename);

      await sharp(req.files.imgCover[0].buffer)
        .resize(800)
        .jpeg({ quality: 60 })
        .toFile(imgCoverPath);

      // Delete the old imgCover if it exists
      if (document.imgCover) {
        deleteFile(path.join('uploads/', document.imgCover));
      }

      req.body.imgCover = resizedFilename;
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

          // Clean up filename by replacing spaces with underscores (optional)
          let cleanedFilename = file.originalname
            .replace(/\s+/g, '_')          // Replace spaces with underscores
            .replace(/[^a-zA-Z0-9_.]/g, ''); // Remove all special characters except letters, numbers, underscores, and dots

          const resizedFilename = "images-" + uuidv4() + encodeURIComponent(cleanedFilename);
          const imgPath = path.join('uploads/', resizedFilename);

          // Process each image
          await sharp(file.buffer)
            .resize(800)
            .jpeg({ quality: 60 })
            .toFile(imgPath);

          return resizedFilename;
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
      // Clean up filename by replacing spaces with underscores (optional)
      let cleanedFilename = req.file.originalname
        .replace(/\s+/g, '_')          // Replace spaces with underscores
        .replace(/[^a-zA-Z0-9_.]/g, ''); // Remove all special characters except letters, numbers, underscores, and dots

      const resizedFilename = uuidv4() + encodeURIComponent(cleanedFilename);

      // Define the path to save the processed image
      const imagePath = path.join('uploads/', resizedFilename);

      // Use Sharp to resize and reduce quality
      await sharp(req.file.buffer)
        .resize(800) // Resize width to 800px, keeping aspect ratio
        .jpeg({ quality: 60 }) // Reduce quality to 60%
        .toFile(imagePath); // Save the processed image

      // Save the filename to the database
      req.body.image = resizedFilename;
    }

    // Process multiple images (imgCover and images arrays)
    if (req.files?.imgCover) {

      // Clean up filename by replacing spaces with underscores (optional)
      let cleanedFilename = req.files.imgCover[0].originalname
        .replace(/\s+/g, '_')          // Replace spaces with underscores
        .replace(/[^a-zA-Z0-9_.]/g, ''); // Remove all special characters except letters, numbers, underscores, and dots

      const resizedFilename = "cover-" + uuidv4() + encodeURIComponent(cleanedFilename);
      const imgCoverPath = path.join('uploads/', resizedFilename);

      await sharp(req.files.imgCover[0].buffer)
        .resize(800)
        .jpeg({ quality: 60 })
        .toFile(imgCoverPath);

      req.body.imgCover = resizedFilename;
    }

    if (req.files?.images) {
      req.body.images = await Promise.all(
        req.files.images.map(async (file) => {
          // Clean up filename by replacing spaces with underscores (optional)
          let cleanedFilename = file.originalname
            .replace(/\s+/g, '_')          // Replace spaces with underscores
            .replace(/[^a-zA-Z0-9_.]/g, ''); // Remove all special characters except letters, numbers, underscores, and dots

          const resizedFilename = "images-" + uuidv4() + encodeURIComponent(cleanedFilename);
          const imgPath = path.join('uploads/', resizedFilename);

          // Process each image
          await sharp(file.buffer)
            .resize(800)
            .jpeg({ quality: 60 })
            .toFile(imgPath);

          return resizedFilename;
        })
      );
    }
    await document.save();
    res.json(document);
  });
};


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