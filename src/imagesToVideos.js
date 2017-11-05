import { remove, copy, ensureDir } from 'fs-extra';
import { join } from 'path';

const outputDir = join(__dirname, '../tmp/imageVideos');

function imageToVideo({ name, path }, addVideoToArray) {
  const outputPath = join(outputDir, name);

  addVideoToArray({ name, path: outputPath });

  return copy(path, outputPath);
}

export default function (images, addVideoToArray) {
  return remove(outputDir)
    .then(() => ensureDir(outputDir))
    .then(() => {
      const promises = [];

      images.forEach(image =>
        promises.push(imageToVideo(image, addVideoToArray))
      );

      return Promise.all(promises);
    });
}
