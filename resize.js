const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Define the path to the uploads directory
const uploadsDir = path.join(__dirname, 'uploads');

// Function to process all images in the uploads directory
const reduceImageQuality = async () => {
    // Read all files in the directory
    fs.readdir(uploadsDir, async (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return;
        }

        // Filter only image files (you can modify the extensions as needed)
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));

        // Process each image file
        for (const file of imageFiles) {
            const filePath = path.join(uploadsDir, file);

            try {
                // Use Sharp to read, reduce quality, and overwrite the file
                await sharp(filePath)
                    .jpeg({ quality: 60 })  // Reduce JPEG quality to 60%
                    .toFile(filePath);      // Overwrite the original file

                console.log(`Processed and reduced quality of: ${file}`);
            } catch (error) {
                console.error(`Error processing ${file}:`, error);
            }
        }

        console.log('Image quality reduction complete.');
    });
};

// Run the function to reduce image quality
reduceImageQuality();
