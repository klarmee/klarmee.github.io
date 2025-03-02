const fs = require('fs').promises;
const sharp = require('sharp');
const path = require('path');

const directoryPaths = ['./avif/hi', './hi'];
const maxSizeInMB = 1.5;
const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

async function compressImage(inputPath) {
  try {
    const image = sharp(inputPath);

    // Get metadata to determine the current size of the image
    const stats = await fs.stat(inputPath);
    
    // If the file size is already under 1.5MB, no need to compress
    if (stats.size < maxSizeInBytes) {
      console.log(`${path.basename(inputPath)} is already under 1.5MB. Skipping compression.`);
      return; // Skip compression if file size is already under the limit
    }

    let quality = 50; // Start with a quality value to reduce file size
    let isCompressed = false;

    // Create a temporary file path
    const tmpFile = `${inputPath}.tmp`;

    // Determine the output format based on the input format
    const outputFormat = path.extname(inputPath).toLowerCase() === '.avif' ? 'avif' : 'jpeg';

    // Compress image until it's under the size limit
    while (!isCompressed) {
      await image
        .toFormat(outputFormat, outputFormat === 'avif' ? { quality: quality, effort: 5 } : { quality: quality, progressive: true })
        .toFile(tmpFile); // Save to the temporary file

      const outputStats = await fs.stat(tmpFile);

      // Check if the output file size is under the 1.5MB threshold
      if (outputStats.size < maxSizeInBytes) {
        isCompressed = true;
        console.log(`${path.basename(inputPath)} has been compressed to ${outputStats.size / 1024 / 1024}MB.`);
      } else {
        // Reduce quality if still above the size limit
        quality = quality - 10;
      }
    }

    // Replace the original file with the temporary file
    await fs.rename(tmpFile, inputPath);

    // Log the actual size of the image after processing
    await new Promise(resolve => setTimeout(resolve, 100)); // Add a 100ms delay
    const finalStats = await fs.stat(inputPath);
    console.log(`Actual size of ${path.basename(inputPath)} after processing: ${finalStats.size} bytes`);
  } catch (error) {
    console.error(`Error processing file ${inputPath}: ${error.message}`);
  }
}

async function processImages() {
  try {
    for (const directoryPath of directoryPaths) {
      const files = await fs.readdir(directoryPath);

      // Process each image file in the directory
      for (const file of files) {
        const filePath = path.join(directoryPath, file);

        // Check if the file is an AVIF or JPEG image (case-insensitive)
        if (['.avif', '.jpg', '.jpeg'].includes(path.extname(file).toLowerCase())) {
          console.log(`Processing file: ${file}`);

          // Compress the image if necessary
          await compressImage(filePath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory: ${error.message}`);
  }
}

processImages();