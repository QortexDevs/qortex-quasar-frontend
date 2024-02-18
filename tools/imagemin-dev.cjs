/* eslint-disable */
const fs = require('fs')
const path = require('path')
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')

const bytesToMegabytes = bytes => Math.round((bytes / (1024 * 1024)  + Number.EPSILON) * 100) / 100

const getAllFiles = function (dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function (file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, '/', file))
    }
  })

  return arrayOfFiles
}
;(async () => {
  const sourceFiles = getAllFiles('/app/src/assets')
  for (const sourceFile of sourceFiles) {
    console.log(sourceFile)
    const fileName = path.basename(sourceFile)
    const filePath = path.dirname(sourceFile)
    const originalFileSize = bytesToMegabytes(fs.statSync(sourceFile).size)
    const files = await imagemin([sourceFile], {
      destination: filePath,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ]
    })
    const resultFileSize = bytesToMegabytes(fs.statSync(sourceFile).size)
    console.log(fileName, originalFileSize, resultFileSize)
  }
})()