const slugify = require("slugify");
const catchError = require("../../middlewares/catchError");
const apiError = require("../../utils/apiError");
const fs = require('fs');
const path = require('path');
const sharp = require("sharp");
const { v4: uuidv4 } = require('uuid');


const deleteOne = (model) => {
  return catchError(async (req, res, next) => {
    const documentId = parseInt(req.params.id, 10); // Ensure the ID is parsed as an integer

    // Find and delete the document by its ID
    const document = await model.delete({
      where: { id: documentId }, // Adjust 'id' to match your model's primary key field if necessary
    });

    // If the document was not found, call the next middleware with a 404 error
    if (!document) {
      return next(new apiError("Document not found", 404));
    }

    // Return the deleted document in the response
    res.json(document);
  });
};
const updateOne = (model) => {
  return catchError(async (req, res, next) => {
    if (req.body.title) req.body.slug = slugify(req.body.title);
    if (req.body.name) req.body.slug = slugify(req.body.name);

    // Fetch the existing document
    const documentId = parseInt(req.params.id, 10); // Ensure the ID is parsed as an integer
    let document = await model.findUnique({
      where: { id: documentId }, // Use 'id' if it's the primary key field
    });
    if (!document) return next(new apiError("Document not found", 404));

    // Define a helper function to delete a file
    const deleteFile = (filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
      }
    };
    if (req.body.parentId) {
      req.body.parentId = parseInt(req.body.parentId, 10);
    }
    // Process single image
    if (req.file) {
      let cleanedFilename = req.file.originalname
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_.]/g, '');
      const resizedFilename = uuidv4() + encodeURIComponent(cleanedFilename);
      const imagePath = path.join('uploads/', resizedFilename);

      await sharp(req.file.buffer)
        .resize(800)
        .jpeg({ quality: 60 })
        .toFile(imagePath);

      // Delete the old image if it exists
      if (document.image) {
        deleteFile(path.join('uploads/', document.image));
      }
      req.body.image = resizedFilename; // Set the new image filename
    }

    // Process multiple images (imgCover and images arrays)
    if (req.files?.imgCover) {
      let cleanedFilename = req.files.imgCover[0].originalname
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_.]/g, '');
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

      req.body.imgCover = resizedFilename; // Set the new imgCover filename
    }

    if (req.files?.images) {
      // Delete old images if they exist
      document.images = JSON.parse(document.images)
      if (document.images && document.images.length > 0) {
        document.images.forEach((img) => {
          deleteFile(path.join('uploads/', img));
        });
      }

      req.body.images = await Promise.all(
        req.files.images.map(async (file) => {
          let cleanedFilename = file.originalname
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_.]/g, '');
          const resizedFilename = "images-" + uuidv4() + encodeURIComponent(cleanedFilename);
          const imgPath = path.join('uploads/', resizedFilename);

          await sharp(file.buffer)
            .resize(800)
            .jpeg({ quality: 60 })
            .toFile(imgPath);

          return resizedFilename; // Return the new filename
        })
      );
    }
    req.body.images = JSON.stringify(req.body.images);
    // Update the document in the database
    document = await model.update({
      where: { id: documentId }, // Use 'id' if it's the primary key field
      data: req.body, // Update with the new data
    });

    res.json(document); // Return the updated document
  });
};

const addOne = (model) => {
  return catchError(async (req, res, next) => {
    // Generate slug from title or name
    if (req.body.title) req.body.slug = slugify(req.body.title);
    if (req.body.name) req.body.slug = slugify(req.body.name);
    if (req.params.category) req.body.category = req.params.category;

    // Initialize an object to store the data to be saved
    const newDocumentData = { ...req.body };
    // Convert parentId to integer if it exists
    if (req.body.parentId) {
      newDocumentData.parentId = parseInt(req.body.parentId, 10); // Handle invalid value
    }
    // Process single image
    if (req.file) {
      let cleanedFilename = req.file.originalname
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_.]/g, ''); // Clean the filename

      const resizedFilename = uuidv4() + encodeURIComponent(cleanedFilename);
      const imagePath = path.join('uploads/', resizedFilename);

      // Resize and save the image
      await sharp(req.file.buffer)
        .resize(800)
        .jpeg({ quality: 60 })
        .toFile(imagePath);

      newDocumentData.image = resizedFilename; // Assign to the data object
    }

    // Process multiple images (imgCover and images arrays)
    if (req.files?.imgCover) {
      let cleanedFilename = req.files.imgCover[0].originalname
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_.]/g, '');

      const resizedFilename = "cover-" + uuidv4() + encodeURIComponent(cleanedFilename);
      const imgCoverPath = path.join('uploads/', resizedFilename);

      await sharp(req.files.imgCover[0].buffer)
        .resize(800)
        .jpeg({ quality: 60 })
        .toFile(imgCoverPath);

      newDocumentData.imgCover = resizedFilename; // Assign to the data object
    }

    if (req.files?.images) {
      newDocumentData.images = await Promise.all(
        req.files.images.map(async (file) => {
          let cleanedFilename = file.originalname
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_.]/g, '');

          const resizedFilename = "images-" + uuidv4() + encodeURIComponent(cleanedFilename);
          const imgPath = path.join('uploads/', resizedFilename);

          await sharp(file.buffer)
            .resize(800)
            .jpeg({ quality: 60 })
            .toFile(imgPath);

          return resizedFilename;
        })
      );
    }
    newDocumentData.images = JSON.stringify(newDocumentData.images);
    // Save the new document using Prisma
    const document = await model.create({
      data: newDocumentData,
    });

    // Send the created document back in the response
    res.json(document);
  });
};



const getOne = (model, modelName) => {
  return catchError(async (req, res, next) => {
    if (modelName === "category") {
      const document = await model.findUnique({
        where: {
          id: parseInt(req.params.id), // Assuming 'id' is of type Int in Prisma
        },
        include: {
          parentCategory: true
        }
      });

      if (document.image) {
        document.image = process.env.MEDIA_BASE_URL + document.image;
      }
      if (document.imgCover) {
        document.imgCover = process.env.MEDIA_BASE_URL + document.imgCover;
        // Parse images, prepend URL, and stringify them back
        const imageArray = JSON.parse(document.images); // Assuming images is a JSON string
        document.images = imageArray.map(img => process.env.MEDIA_BASE_URL + img);
      }
      if (!document) {
        return next(new apiError("Document not found", 404));
      }

      return res.json(document);
    } else {
      const document = await model.findUnique({
        where: {
          id: parseInt(req.params.id), // Assuming 'id' is of type Int in Prisma
        },
        include: {
          category: {
            include: {
              parentCategory: true
            }
          },
        }
      });

      if (document.image) {
        document.image = process.env.MEDIA_BASE_URL + document.image;
      }
      if (document.imgCover) {
        document.imgCover = process.env.MEDIA_BASE_URL + document.imgCover;
        // Parse images, prepend URL, and stringify them back
        const imageArray = JSON.parse(document.images); // Assuming images is a JSON string
        document.images = imageArray.map(img => process.env.MEDIA_BASE_URL + img);
      }
      if (!document) {
        return next(new apiError("Document not found", 404));
      }

      return res.json(document);
    }

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