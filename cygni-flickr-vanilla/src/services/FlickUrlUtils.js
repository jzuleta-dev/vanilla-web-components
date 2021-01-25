const api_key = "1304b1853386cabd714d0f9e8c42df4f";
const apiURL = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${api_key}&per_page=60&format=json&nojsoncallback=1&text=`;
const singlePhotoURL = `https://live.staticflickr.com/`;
const fromApiResponseToPhotos = ({ photos, stat }) =>
  stat === "ok" && photos ? photos : [];

export const getPhotoUrl = ({ server, id, secret }) =>
  `${singlePhotoURL}${server}/${id}_${secret}.jpg`;

export const getPhotos = (keyword = "", page = 1) => {
  return fetch(`${apiURL}${keyword ? keyword : ""}&page=${page}`)
    .then((res) => res.json())
    .then(fromApiResponseToPhotos);
};
