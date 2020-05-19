#! /usr/bin/env node
const axios = require("axios");
Spinner = require("cli-spinner").Spinner;

const urlMap = {
  baseUrl: "https://api.covid19api.com",
  summary: "/world/total"
};

const spinnerObj = new Spinner({
  text: "processing.. %s",
  stream: process.stderr,
  onTick: function(msg) {
    this.clearLine(this.stream);
    this.stream.write(msg);
  }
});

const getCovidSummary = async () => {
  try {
    spinnerObj.start();
    const url = `${urlMap.baseUrl}${urlMap.summary}`;
    const result = await axios({
      method: "get",
      url,
      headers: { Accept: "application/json" }
    });

    spinnerObj.stop(true);
    if (result) {
      console.log(result.data);
    }
  } catch (err) {
    spinnerObj.stop(true);
    console.error(err);
  }
};

getCovidSummary();
