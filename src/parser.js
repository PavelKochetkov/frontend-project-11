import _ from 'lodash';

const parse = (data) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(data, 'application/xml');
  const rss = document.querySelector('rss');
  if (!document.contains(rss)) {
    const error = new Error('parserError');
    error.isParserError = true;
    throw error;
  }
  const title = rss.querySelector('title').textContent;
  const description = rss.querySelector('description').textContent;
  const feedId = _.uniqueId();
  const feed = { title, description, feedId };
  const items = [...document.querySelectorAll('item')];
  const posts = items.map((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    const postId = _.uniqueId();
    return {
      postTitle,
      postDescription,
      link,
      postId,
    };
  });
  return { feed, posts };
};

export default parse;
