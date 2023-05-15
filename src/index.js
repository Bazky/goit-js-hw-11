import './styles.css';
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

// async function fetchImages(searchQuery) {
//   try {
//     const response = await axios.get(URL, {
//       params: {
//         key: API_KEY,
//         q: searchQuery,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//         per_page: 40,
//         page: page,
//       },
//     });

//     return response.data.hits;
//   } catch (error) {
//     Notiflix.Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//   }
// }

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

function fetchImages() {
  const url = `${URL}&q=${searchQuery}&page=${page}`;
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Something went wrong!');
    })
    .then(({ hits, totalHits }) => {
      if (hits.length === 0) {
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        loadMoreBtn.classList.add('is-hidden');
      } else if (hits.length > 0) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        loadMoreBtn.classList.remove('is-hidden');
      }
      return hits;
    });
}
