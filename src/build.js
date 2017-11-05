import { join } from 'path';
import items from 'tmp/downloads/items.json';
// import imagesToVideos from 'src/imagesToVideos';
import addSoundToVideos from 'src/addSoundToVideos';
import concatVideos from 'src/concatVideos';

const itemsWithPaths = items.map((item) => {
  const newItem = item;

  newItem.path = join(__dirname, '../tmp/downloads/', item.name);

  return newItem;
});

const images = [];
const videos = [];
const finalVideos = [];

itemsWithPaths.forEach(({ name, path }) => {
  if (name.includes('.jpg')) {
    images.push({ name, path });
  } else {
    videos.push({ name, path });
  }
});

// imagesToVideos(images, video => videos.push(video))
addSoundToVideos(videos, video => finalVideos.push(video)).then(() =>
  concatVideos(finalVideos)
);
