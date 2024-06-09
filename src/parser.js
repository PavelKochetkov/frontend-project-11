import _ from 'lodash';

const parse = (data) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(data, 'application/xml');
  const rss = document.querySelector('rss');
  if (!document.contains(rss)) {
    throw new Error('invalidRSS');
  }
  const title = rss.querySelector('title').textContent;
  const description = rss.querySelector('description').textContent;
  const idFeeds = Number(_.uniqueId());
  const feeds = { title, description, idFeeds };
  const items = document.querySelectorAll('item');
  const itemsList = Array.from(items);
  const posts = itemsList.map((item) => {
    const titlePost = item.querySelector('title').textContent;
    const descriptionPost = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    const idPost = Number(_.uniqueId());
    const post = {
      titlePost,
      descriptionPost,
      link,
      idPost,
    };
    return post;
  });
  return { feeds, posts };
};

export default parse;
