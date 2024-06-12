import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import ru from './ru.js';
import view from './view.js';
import proxy from './proxy.js';
import parser from './parser.js';

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
  posts: [],
  urls: [],
  ui: {
    id: null,
    viewedPost: [],
  },
};

const checkNewPosts = (watchedState) => {
  const { feeds } = watchedState;
  const request = feeds.map((feed) => proxy(feed.url)
    .then((responce) => {
      const { posts } = parser(responce.data.contents);
      const newPosts = posts
        .filter((post) => !watchedState.posts.some((item) => item.title === post.title));
      watchedState.posts.push(...newPosts);
    })
    .catch(() => {}));
  Promise.all(request)
    .then(() => {
      setTimeout(() => checkNewPosts(watchedState), 5000);
    });
};

const loading = (watchedState, url) => {
  const { statusLoading } = watchedState;
  proxy(url)
    .then((response) => {
      const { feeds, posts } = parser(response.data.contents);
      feeds.url = url;
      statusLoading.status = 'succsess';
      watchedState.urls.push(url);
      watchedState.feeds.push(feeds);
      watchedState.posts.push(...posts);
      statusLoading.status = '';
    })
    .catch((error) => {
      if (error.message === 'invalidRSS') {
        statusLoading.error = 'invalidRSS';
      } else {
        statusLoading.error = 'errorNetwork';
      }
      statusLoading.status = 'failed';
    });
};

const validate = (url, urlList) => {
  const schema = yup.string().url('errorNotValid').required('errorNotFilledIn').notOneOf(urlList, 'errorNotUnique');
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
    feedsCol: document.querySelector('.feeds'),
    postsCol: document.querySelector('.posts'),
    modal: document.querySelector('.modal'),
  };
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    debug: true,
    lng: 'ru',
    resources: {
      ru,
    },
  }).then(() => {
    const watchedState = onChange(state, view(state, elements, i18nextInstance));
    elements.form.addEventListener('submit', ((event) => {
      event.preventDefault();
      const data = new FormData(event.target);
      const url = data.get('url').trim();
      watchedState.formState.status = 'processing';
      const urlList = watchedState.urls.map((urls) => urls);
      validate(url, urlList).then((error) => {
        if (error) {
          watchedState.formState.error = error.message;
          watchedState.formState.status = 'failed';
          return;
        }
        watchedState.formState.error = '';
        loading(watchedState, url);
        watchedState.formState.status = '';
      });
    }));
    elements.postsCol.addEventListener('click', (event) => {
      const { id } = event.target.dataset;
      if (id) {
        watchedState.ui.id = id;
        watchedState.ui.viewedPost.push(id);
      }
    });
    checkNewPosts(watchedState);
  });
};
