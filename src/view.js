const renderForm = (state, elements, value, i18nextInstance) => {
  const { formState } = state;
  const { input, feedback, sendButton } = elements;
  if (value === 'processing') {
    input.setAttribute('disabled', '');
    sendButton.setAttribute('disabled', '');
    feedback.textContent = '';
    feedback.classList.remove('text-danger');
    input.classList.remove('is-invalid');
  }
  if (value === 'failed') {
    feedback.textContent = i18nextInstance.t(formState.error);
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
    input.removeAttribute('disabled');
    sendButton.removeAttribute('disabled');
    input.focus();
  }
};

const renderLoading = (state, elements, value, i18nextInstance) => {
  const { statusLoading } = state;
  const { input, feedback, sendButton } = elements;
  if (value === 'succsess') {
    feedback.textContent = i18nextInstance.t('success');
    feedback.classList.add('text-success');
    sendButton.removeAttribute('disabled');
    input.removeAttribute('disabled');
    input.value = '';
    input.focus();
  }
  if (value === 'failed') {
    feedback.textContent = i18nextInstance.t(statusLoading.error);
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
    input.removeAttribute('disabled');
    sendButton.removeAttribute('disabled');
  }
};

const renderCard = (title) => {
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const titleCard = document.createElement('h2');
  const list = document.createElement('ul');

  card.classList.add('card', 'border-0');
  cardBody.classList.add('card-body');
  titleCard.classList.add('card-title', 'h4');
  titleCard.textContent = title;
  list.classList.add('list-group', 'border-0', 'rounded-0');

  cardBody.append(titleCard, list);
  card.append(cardBody);

  return card;
};
const renderColFeeds = (state, elements) => {
  const { feedsCol } = elements;
  const { feeds } = state;
  if (!feedsCol.hasChildNodes()) {
    const card = renderCard('Фиды');
    feedsCol.append(card);
  }
  const card = feedsCol.querySelector('.card');
  const list = card.querySelector('ul');
  const items = feeds.map((feed) => {
    const li = document.createElement('li');
    const title = document.createElement('h3');
    const description = document.createElement('p');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    list.append(li);
    title.classList.add('h6', 'm-0');
    title.textContent = feed.title;
    description.classList.add('m-0', 'small', 'text-black-50');
    description.textContent = feed.description;
    li.append(title, description, feed.idFeeds);
    return li;
  });
  list.append(...items);
};

const renderPosts = (state, elements) => {
  const { postsCol } = elements;
  const { posts } = state;
  if (!postsCol.hasChildNodes()) {
    const card = renderCard('Посты');
    postsCol.append(card);
  }
  const card = postsCol.querySelector('.card');
  const list = card.querySelector('ul');
  const [post] = posts;
  const items = post.map((item) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    link.classList.add('fw-bold');
    link.setAttribute('href', `${item.link}`);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'nofollow noreferrer');
    link.textContent = item.titlePost;
    li.append(link);
    return li;
  });
  list.append(...items);
};

export default (state, elements, i18nextInstance) => (path, value) => {
  if (path === 'formState.status') {
    renderForm(state, elements, value, i18nextInstance);
  }
  if (path === 'statusLoading.status') {
    renderLoading(state, elements, value, i18nextInstance);
  }
  if (path === 'feeds') {
    renderColFeeds(state, elements);
  }
  if (path === 'posts') {
    renderPosts(state, elements);
  }
};
