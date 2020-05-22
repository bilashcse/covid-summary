#! /usr/bin/env node
const axios = require("axios");
const yargs = require("yargs");
const Table = require("cli-table");
const moment = require("moment");

Spinner = require("cli-spinner").Spinner;

const table = new Table({
  chars: {
    top: "═",
    "top-mid": "╤",
    "top-left": "╔",
    "top-right": "╗",
    bottom: "═",
    "bottom-mid": "╧",
    "bottom-left": "╚",
    "bottom-right": "╝",
    left: "║",
    "left-mid": "╟",
    mid: "─",
    "mid-mid": "┼",
    right: "║",
    "right-mid": "╢",
    middle: "│"
  }
});

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
      console.log("Covid-19 live world's summary:\n");
      console.log("Total Confirmed: " + result.data.TotalConfirmed);
      console.log("Total Death    : " + result.data.TotalDeaths);
      console.log("Total Recovered: " + result.data.TotalRecovered);
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
      console.log(`Covid-19 ${name} summary:\n`);
      
      for (let i = 0; i < result.data.length; i++) {
        let current = result.data[i];
        let yesterday = result.data[i - 1] || {};
        const confirmed = current.Confirmed - (yesterday.Confirmed || 0);
        const death = current.Deaths - (yesterday.Deaths || 0);
        const recovered = current.Recovered - (yesterday.Recovered || 0);

        table.unshift([
          moment(current.Date).local().format("DD MMM, YYYY"),
          confirmed,
          death,
          recovered
        ]);
      }

      table.unshift(["Date", "Confirmed", "Death", "Recovered"]);
      console.log(table.toString());
    }
  } catch (err) {
    spinnerObj.stop(true);
    console.error(err);
  }
};

async function init() {
  const yargs = require("yargs");

  const argv = yargs
    .command("live", "Show live covid-19 summary", {
      country: {
        alias: "c",
        description: "Show Specific country to show summary",
        type: "string"
      }
    })
    .option("country", {
      alias: "c",
      description: "Show Specific country to show summary",
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
