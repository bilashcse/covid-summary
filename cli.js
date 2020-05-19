#! /usr/bin/env node
const axios = require("axios");
const yargs = require("yargs");

Spinner = require("cli-spinner").Spinner;

const urlMap = {
  baseUrl: "https://api.covid19api.com",
  summary: "/world/total",
  country: `/total/dayone/country`
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
      console.log("Covid-19 live world summary: ");
      console.log(result.data);
    }
  } catch (err) {
    spinnerObj.stop(true);
    console.error(err);
  }
};

const getSpecificCountrySummary = async name => {
  try {
    spinnerObj.start();
    const url = `${urlMap.baseUrl}${urlMap.country}/${name}`;
    const result = await axios({
      method: "get",
      url,
      headers: { Accept: "application/json" }
    });

    spinnerObj.stop(true);
    if (result) {
      const data = result.data;
      const lastIndex = result.data.length - 1;
      console.log(`Covid-19 ${name} summary:`);
      console.log({
        "Total Confirmed": data[lastIndex].Confirmed,
        "Total Death": data[lastIndex].Deaths,
        "Total Recovered": data[lastIndex].Recovered,
        "Total Active": data[lastIndex].Active
      });
    }
  } catch (err) {
    spinnerObj.stop(true);
    console.error(err);
  }
}

async function init() {
  const yargs = require("yargs");

  const argv = yargs
    .command("live", "Show live covid-19 summary", {
      country: {
        alias: "c",
        description: "Specific country to show summary",
        type: "string"
      }
    })
    .option("country", {
      alias: "c",
      description: "Specific country to show summary",
      type: "string"
    })
    .help()
    .alias("help", "h").argv;

  if (argv._.includes("live")) {
    const country = argv.country || null;
    if (country) {
      await getSpecificCountrySummary(country);
    } else {
      await getCovidSummary();
    }
  }
}

(function() {
  init();
})();
