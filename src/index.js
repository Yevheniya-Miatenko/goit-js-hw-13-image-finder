import debounce from 'lodash.debounce';
import '@pnotify/core/dist/BrightTheme.css';
import { alert, defaultModules } from '@pnotify/core/dist/PNotify.js';
import { defaults } from '@pnotify/core';
defaults.type = 'error';
import './sass/main.scss';

import apiServise from './js/apiService.js';
import galleryTpl from './templates/gallery.hbs';

import * as basicLightbox from 'basiclightbox';

const refs = {
  input: document.querySelector('[name="query"]'),
  gallery: document.querySelector('.gallery'),
  spinner: document.querySelector('.js-spinner'),
  btnSpinner: document.querySelector('.js-btn-spinner'),
  box: document.querySelector('.box'),
  toTopBtn: document.querySelector('.to-top'),
  trigger: document.querySelector('.scroll-trigger'),
};

refs.input.addEventListener('input', debounce(handleInput, 1000));

async function handleInput(event) {
  refs.spinner.classList.remove('is-hidden');

  clearBeforePopulating();

  const userInput = event.target.value;
  apiServise.query = userInput;

  try {
    const apiData = await apiServise.fetchImages();

    if (apiData.hits.length === 0) {
      alert('No matches, please try again!');
      refs.spinner.classList.add('is-hidden');
      return;
    }
    makeButtonActive();
    populateGallery(apiData);
  } catch (error) {
    alert(error);
    refs.spinner.classList.add('is-hidden');
  }
}

const picsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    console.log(apiServise.pageNumber);
    if (entry.intersectionRatio > 0 && apiServise.pageNumber > 1) {
      apiServise.fetchImages().then(populateGallery).catch(alert);
    }
  });
});

picsObserver.observe(refs.trigger);

function clearBeforePopulating() {
  refs.gallery.innerHTML = '';
  apiServise.query = '';
  apiServise.pageNumber = 1;
}

function populateGallery(data) {
  const markUp = galleryTpl(data);
  refs.gallery.insertAdjacentHTML('beforeend', markUp);
  apiServise.pageNumber += 1;
}
// function makeSmoothScroll() {
//   refs.box.scrollIntoView({
//     behavior: 'smooth',
//     block: 'end',
//   });
// }

function makeButtonActive() {
  refs.spinner.classList.add('is-hidden');
  // refs.showMoreBtn.classList.remove('is-hidden');
}

const myObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      refs.toTopBtn.classList.remove('is-hidden');
    } else {
      refs.toTopBtn.classList.add('is-hidden');
    }
  });
});
myObserver.observe(refs.input);

refs.gallery.addEventListener('click', event => {
  console.log(event.target.dataset.src);
  console.log(event.target.src);
  if (event.target.nodeName === 'IMG') {
    const instance = basicLightbox.create(`
  	<img src="${event.target.dataset.src}" alt="big pic"/>
  `);

    instance.show();
  }
});
