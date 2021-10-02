export default {
  BASE_URL: 'https://pixabay.com/api/',
  KEY: '21704664-f3a5361496563a8a6716b3b47',
  pageNumber: 1,
  query: '',
  smallPics: [],
  //   options: {},
  fetchImages() {
    return fetch(
      `${this.BASE_URL}?image_type=photo&orientation=horizontal&key=${this.KEY}&q=${this.query}&page=${this.pageNumber}&per_page=12`,
    ).then(r => r.json());
  },
};
