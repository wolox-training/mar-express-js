const rp = require('request-promise');

module.exports.listAlbums = () => {
  rp('https://jsonplaceholder.typicode.com/albums')
    .then(response => console.log(response))
    .catch(err => console.log(err.message));
};

module.exports.listAlbumPhotos = album_id => {
  rp(`https://jsonplaceholder.typicode.com/photos?albumId=${album_id}`)
    .then(response => console.log(response))
    .catch(err => console.log(err.message));
};
