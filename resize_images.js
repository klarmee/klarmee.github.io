const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Directories
const inputDir = './imagestoresize';
const outputDir800 = './800';
const outputDir150 = './150';

// Create output directories if they don't exist
if (!fs.existsSync(outputDir800)) fs.mkdirSync(outputDir800);
if (!fs.existsSync(outputDir150)) fs.mkdirSync(outputDir150);

// Read all image files from the input directory
fs.readdirSync(inputDir).forEach(file => {
  const inputPath = path.join(inputDir, file);

  // Check if it's a valid image file (you can extend this for other formats if needed)
  if (fs.lstatSync(inputPath).isFile() && /\.(jpg|jpeg|png|gif)$/i.test(file)) {

    // 800px max version
    sharp(inputPath)
      .resize(800, 800, { fit: 'inside' })
      .toFile(path.join(outputDir800, file), (err, info) => {
        if (err) {
          console.error(`Error processing 800px version of ${file}:`, err);
        } else {
          console.log(`Processed 800px version of ${file}`);
        }
      });

    // 150px max version
    sharp(inputPath)
      .resize(150, 150, { fit: 'inside' })
      .toFile(path.join(outputDir150, file), (err, info) => {
        if (err) {
          console.error(`Error processing 150px version of ${file}:`, err);
        } else {
          console.log(`Processed 150px version of ${file}`);
        }
      });
  }
});
