import 'src/getEnv';
import fetch from 'node-fetch';
import { emptydir } from 'fs-extra';
import { join } from 'path';
import download from 'src/download';

const tmpDir = join(__dirname, '../tmp/combine');

function getDownloadUrl(item) {
  const newItem = Object.assign({}, item);

  return fetch(item.url).then((res) => {
    newItem.url = res.url;
    return newItem;
  });
}

function processAll(items, process) {
  const promises = [];

  items.forEach((item) => {
    promises.push(process(item));
  });

  return Promise.all(promises);
}

function downloadItem(item) {
  return getDownloadUrl(item).then(newItem =>
    download(newItem.url, {
      directory: tmpDir,
      filename: newItem.name,
    })
  );
}

function combineMedia() {}

emptydir(tmpDir)
  .then(() => fetch(process.env.GOOGLE_SCRIPT_URL))
  .then(res => res.json())
  .then(items =>
    processAll(items, downloadItem).then(() => combineMedia(items))
  )
  // .then(() => emptydir(tmpDir))
  .then(() => console.log('done'))
  .catch(console.err);
