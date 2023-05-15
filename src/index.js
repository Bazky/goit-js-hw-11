// import Notiflix from 'notiflix';
// import axios from 'axios';

// const input = document.querySelector('form[input="search"]');
// const searchButton = document.querySelector('form[button="search"]');

// async function getImages() {
//   try {
//     const response = await axios.get('https://pixabay.com/api/');
//     console.log(response);
//   } catch (error) {
//     Notiflix.Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//   }
// }
// const imageProperties = {
//   webFormatURL: 'https://pixabay.com/get/35bbf209e13e39d2_640.jpg',
//   largeformatURL: 'https://pixabay.com/get/35bbf209e13e39d2_1280.jpg',
//   tags: description,
//   likes: '',
//   views: '',
//   comments: '',
//   downloads: '',
// };
// const options = {
//   key: '35883323-bde325eb0a57257c02d067bfb',
//   q: 'input.value',
//   Image_type: 'photo',
//   orientation: 'horizontal',
//   safesearch: true,
// };

// searchButton.addEventListener('submit', async () => {
//   ev.preventDefault();
//   const inputValue = input.value;
//   await getImages(inputValue);

//   getImages();
//   console.log('options');
//   console.log('imageProperties');
// });

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const API_KEY = '35883323-bde325eb0a57257c02d067bfb';
const URL = `https://pixabay.com/api/?key=${API_KEY}&image_type=photo&orientation=horizontal&safesearch=true`;

let page = 1;
let searchQuery = '';
const lightbox = new SimpleLightbox('.gallery a');

async function fetchImages(searchQuery) {
  try {
    const response = await axios.get(URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page,
      },
    });

    return response.data.hits;
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();
  clearGallery();
  searchQuery = event.currentTarget.elements.searchQuery.value.trim();
  page = 1;
  fetchImages().then(renderGallery).catch(console.log);
}

function onLoadMore() {
  page += 1;
  fetchImages()
    .then(renderGallery)
    .catch(
      Notiflix.Notify(
        "We're sorry, but you've reached the end of search results."
      )
    );
}

function renderGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <div class="photo-card">
          <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item">
              <b>Likes</b> ${likes}
            </p>
            <p class="info-item">
              <b>Views</b> ${views}
            </p>
            <p class="info-item">
              <b>Comments</b> ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b> ${downloads}
            </p>
          </div>
        </div>
      `
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function clearGallery() {
  gallery.innerHTML = '';
}
