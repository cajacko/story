import download from 'download-file';

export default function (url, options) {
  return new Promise((resolve, reject) => {
    download(url, options, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}
