// src/newsService.js

import axios from 'axios';

const API_KEY = 'gpVtrC7Id8I4Y8fMLZLzVvfXBSRt5Qe_akVVaUlIO5s6-VVd'; // ה-API key שלך
const BASE_URL = 'https://api.currentsapi.services/v1';

export const fetchNews = async (query = '', page = 1) => {
  const url = query
    ? `${BASE_URL}/search?keywords=${query}&apiKey=${API_KEY}&page=${page}`
    : `${BASE_URL}/latest-news?apiKey=${API_KEY}&page=${page}`;

  try {
    const response = await axios.get(url);
    return response.data.news;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};
