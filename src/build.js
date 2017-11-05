import ffmpeg from 'fluent-ffmpeg';
import { join } from 'path';
import { emptydir, copy } from 'fs-extra';
import { exec } from 'child_process';
import items from 'tmp/combine/items.json';

function mediaPath(pre, name) {
  return join(__dirname, `../tmp/${pre ? 'combine' : 'process'}/${name}`);
}

function prepareFile({ name }) {
  return new Promise((resolve, reject) => {
    const itemPath = mediaPath(true, name);

    ffmpeg.ffprobe(itemPath, (err, metadata) => {
      if (err) return reject(err);

      let hasAudio = false;

      metadata.streams.forEach(({ codec_type }) => {
        if (codec_type === 'audio') {
          hasAudio = true;
        }
      });

      const outputPath = mediaPath(false, name);

      if (hasAudio) {
        return copy(itemPath, outputPath).then(resolve);
      }

      exec(
        `ffmpeg -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -i ${itemPath} -shortest -c:v copy -c:a aac ${outputPath}`,
        {},
        (error) => {
          if (error) return reject(error);

          return resolve();
        }
      );
    });
  });
}

function init() {
  const itemsToProcess = [];

  items.forEach((item) => {
    if (item.name.includes('.mp4')) {
      itemsToProcess.push(item);
    }
  });

  const promises = [];

  itemsToProcess.forEach((item) => {
    promises.push(prepareFile(item));
  });

  Promise.all(promises).then(() => {
    const command = ffmpeg();

    itemsToProcess.forEach(({ name }) => {
      if (name.includes('.mp4')) {
        command.input(mediaPath(false, name));
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
  });
}

emptydir(join(__dirname, '../tmp/process')).then(init);
