#! /usr/bin/env node
const axios = require('axios');

const urlMap = {
  baseUrl: 'https://api.covid19api.com',
  summary: '/world/total',
};

const getCovidSummary = async () => {
  try {
    const url = `${urlMap.baseUrl}${urlMap.summary}`;
    const result = await axios({
      method: 'get',
      url,
      headers: { Accept: 'application/json' }, // this api needs this header set for the request
    });
    console.log(result.data);
  } catch (err) {
    console.error(err);
  }
};


getCovidSummary();
