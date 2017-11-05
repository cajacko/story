import ffmpeg from 'fluent-ffmpeg';
import { join } from 'path';
import items from 'tmp/combine/items.json';

function mediaPath(name) {
  return join(__dirname, `../tmp/combine/${name}`);
}

const command = ffmpeg();

items.forEach(({ name }) => {
  if (name.includes('.mp4')) {
    command.mergeAdd(mediaPath(name));
  }
});

command
  .on('progress', (progress) => {
    console.log(`Processing: ${Math.floor(progress.percent)}% done`);
  })
  .on('end', () => {
    console.log('Finished processing');
  })
  .mergeToFile(
    join(__dirname, '../tmp/output.mp4'),
    join(__dirname, '../tmp/processing')
  );
