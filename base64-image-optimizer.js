const os = require('os');
const fs = require('fs');
// const sharp = require('sharp');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const base64Img = require('base64-img');
const uuidv4 = require('uuid/v4');

/**
 * Compresses
 *  base64 image (PNG)
 * @param {string} inputBase64 
 * @returns {string}
 */
const compress = async (inputBase64) => {
  const tempPath = os.tmpdir();
  const tempPathOptimized = `${tempPath}/optimages`;
  const tempName = uuidv4();

  base64Img.imgSync(inputBase64, tempPath, tempName)
  await imagemin([`${tempPath}/${tempName}.png`], `${tempPathOptimized}`, {
    plugins: [
        imageminPngquant()
    ]
  });
  const outputBase64 = base64Img.base64Sync(`${tempPathOptimized}/${tempName}.png`);
  fs.unlinkSync(`${tempPath}/${tempName}.png`);
  fs.unlinkSync(`${tempPathOptimized}/${tempName}.png`);

  const inputSize = Buffer.byteLength(inputBase64);
  const outputSize = Buffer.byteLength(outputBase64);
  
  return inputSize > outputSize
    ? outputBase64
    : inputBase64;
}

module.exports = {
  compress,
};
