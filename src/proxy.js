import axios from 'axios';

export default (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
  .then((response) => {
    if (response.status >= 200 && response.status < 300) return response;
    throw new Error(response.status);
  })
  .catch((error) => {
    throw error;
  });
