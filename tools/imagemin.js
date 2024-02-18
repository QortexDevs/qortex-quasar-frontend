import { readdirSync, statSync } from 'fs'
import { join, basename, dirname } from 'path'

import imagemin from 'imagemin'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminPngquant from 'imagemin-pngquant'

const bytesToMegabytes = bytes => Math.round((bytes / (1024 * 1024) + Number.EPSILON) * 100) / 100

const getAllFiles = function (dirPath, arrayOfFiles) {
  const files = readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function (file) {
    if (statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(join(dirPath, '/', file))
    }
  })

  return arrayOfFiles
}

;(async () => {
  const sourceFiles = getAllFiles('/app/src/dist')
  for (const sourceFile of sourceFiles) {
    const fileName = basename(sourceFile)
    const filePath = dirname(sourceFile)
    const originalFileSize = bytesToMegabytes(statSync(sourceFile).size)
    await imagemin([sourceFile], {
      destination: filePath,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ]
    })
    const resultFileSize = bytesToMegabytes(statSync(sourceFile).size)
    console.log(fileName, originalFileSize, resultFileSize)
  }
})()
