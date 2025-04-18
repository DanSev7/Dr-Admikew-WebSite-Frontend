const axios = require('axios');

const chapa = axios.create({
  baseURL: 'https://api.chapa.co/v1',
  headers: {
    'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});

module.exports = chapa; 