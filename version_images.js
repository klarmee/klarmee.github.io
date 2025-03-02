const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Define input directories
const inputDirs = ['./150/', './800/', './hi/'];

// Define output directory base
const outputDirBase = './avif/';

// Define allowed image extensions
const extensions = ['.jpg', '.jpeg', '.png'];

// Function to convert images in a directory
async function convertImages(inputDir) {
  try {
    // Get the directory name
    const dirName = path.basename(inputDir);

    // Construct output directory
    const outputDir = `${outputDirBase}${dirName}`;

    // Check if output directory exists, create if not
    if (!(await fs.readdir(outputDirBase)).includes(dirName)) {
      await fs.mkdir(outputDir, { recursive: true });
    }

    // Read input directory
    const files = await fs.readdir(inputDir);
    console.log(`Processing directory: ${inputDir}`);

    for (const file of files) {
      // Check if file has allowed extension
      if (extensions.includes(path.extname(file))) {
        // Construct AVIF file path
        const avifFile = `${outputDir}/${path.basename(file, path.extname(file))}.avif`;

        // Check if AVIF file already exists
        if (!(await fs.readdir(outputDir)).includes(path.basename(avifFile))) {
          // Convert image to AVIF
          console.log(`starting ${file} to AVIF`);
          await sharp(`${inputDir}${file}`)
            .avif({
              quality: 80, // Adjust quality as needed (1-100)
            })
            .toFile(avifFile);
          console.log(`Converted ${file} to AVIF`);
        } else {
          console.log(`Skipping ${file}, AVIF version already exists`);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory: ${inputDir}`, error);
  }
}

// Loop through input directories
async function main() {
  for (const inputDir of inputDirs) {
    await convertImages(inputDir);
  }
}

main();