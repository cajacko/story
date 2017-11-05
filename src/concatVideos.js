import ffmpeg from 'fluent-ffmpeg';
import { join } from 'path';
import { remove } from 'fs-extra';

const outputPath = join(__dirname, '../tmp/output.mp4');

export default function (videos) {
  const command = ffmpeg();

  videos.forEach((video) => {
    command.input(video);
  });

  remove(outputPath).then(() =>
    command
      .on('progress', (progress) => {
        console.log(`Processing: ${Math.floor(progress.percent)}% done`);
      })
      .on('end', () => {
        console.log('Finished processing');
      })
      .mergeToFile(outputPath, join(__dirname, '../tmp/processing'))
  );
}
