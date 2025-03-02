const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Directory where your images are located
const inputDir = './resources/';
const outputDir = './resized/';

// Resolutions you want to create
const sizes = [400, 800, 1200];

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Function to resize an image
const resizeImage = (file, size) => {
    const ext = path.extname(file);
    const name = path.basename(file, ext);

    sharp(`${inputDir}${file}`)
        .resize(size) // Resize to the specified width, keeping the aspect ratio
        .toFile(`${outputDir}${name}-${size}${ext}`, (err, info) => {
            if (err) {
                console.error(`Error processing file ${file} to size ${size}:`, err);
            } else {
                console.log(`Resized ${file} to ${size}px width.`);
            }
        });
};

// Function to process all .webp files in the directory
const processAllWebpFiles = () => {
    fs.readdir(inputDir, (err, files) => {
        if (err) {
            console.error(`Error reading directory ${inputDir}:`, err);
            return;
        }

        // Filter for .webp files
        const webpFiles = files.filter(file => path.extname(file).toLowerCase() === '.webp');

        if (webpFiles.length === 0) {
            console.log(`No .webp files found in ${inputDir}`);
            return;
        }

        // Resize each .webp file to all specified sizes
        webpFiles.forEach(file => {
            sizes.forEach(size => {
                resizeImage(file, size);
            });
        });
    });
};

// Process all .webp files
processAllWebpFiles();
