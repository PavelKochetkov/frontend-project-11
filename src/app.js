import * as yup from 'yup';
import onChange from 'on-change';
import view from './view.js';

const state = {
  formState: {
    status: '',
    error: '',
  },
  statusLoading: {
    status: '',
    error: '',
  },
  feeds: [],
};

const loading = (watchedState, url) => {
  const { statusLoading } = watchedState;
  statusLoading.status = 'succsess';
  watchedState.feeds.push(url);
};

const validate = (url, urlList) => {
  const schema = yup.string().url('Не корректный URL').notOneOf(urlList, 'RSS уже существует');
  return schema
    .validate(url)
    .then(() => { })
    .catch((e) => e);
};

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    sendButton: document.querySelector('[type="submit"]'),
  };
  const watchedState = onChange(state, view(state, elements));
  elements.form.addEventListener('submit', ((event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const url = data.get('url').trim();
    watchedState.formState.status = 'processing';
    const urlList = watchedState.feeds.map((feed) => feed);
    validate(url, urlList).then((error) => {
      if (error) {
        watchedState.formState.error = error.message;
        watchedState.formState.status = 'failed';
        return;
      }
      watchedState.formState.error = '';
      loading(watchedState, url);
    });
  }));
};
