import ffmpeg from 'fluent-ffmpeg';
import { remove, ensureDir } from 'fs-extra';
import { exec } from 'child_process';
import { join } from 'path';

const outputDir = join(__dirname, '../tmp/videos/');

function addSoundToVideo({ name, path }, addVideoToArray) {
  return new Promise((resolve, reject) =>
    ffmpeg.ffprobe(path, (err, metadata) => {
      if (err) return reject(err);

      let hasAudio = false;

      metadata.streams.forEach(({ codec_type }) => {
        // eslint-disable-next-line camelcase
        if (codec_type === 'audio') {
          hasAudio = true;
        }
      });

      if (hasAudio) {
        addVideoToArray(path);
        return resolve();
      }

      const outputPath = join(outputDir, name);

      return exec(
        // eslint-disable-next-line max-len
        `ffmpeg -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -i ${path} -shortest -c:v copy -c:a aac ${outputPath}`,
        {},
        (error) => {
          if (error) return reject(error);

          addVideoToArray(outputPath);
          return resolve();
        }
      );
    })
  );
}

export default function (videos, addVideoToArray) {
  return remove(outputDir)
    .then(() => ensureDir(outputDir))
    .then(() => {
      const promises = [];

      console.log(videos);

      videos.forEach(video =>
        promises.push(addSoundToVideo(video, addVideoToArray))
      );

      return Promise.all(promises);
    });
}
