const axios = require("axios");
const moment = require("moment");
const colors = require("colors");

const { spinnerObj } = require("./loader");
const { table } = require("./table");

const urlMap = {
  baseUrl: "https://api.covid19api.com",
  summary: "/world/total",
  country: `/total/dayone/country`,
};

const getCovidSummary = async () => {
    console.log("111")
  try {
    spinnerObj.start();
    const url = `${urlMap.baseUrl}${urlMap.summary}`;
    const result = await axios({
      method: "get",
      url,
      headers: { Accept: "application/json" },
    });

    spinnerObj.stop(true);
    if (result) {
      console.log("\nCovid-19 live world's summary:\n ");
      console.log("Total Confirmed: " + result.data.TotalConfirmed);
      console.log("Total Death    : " + result.data.TotalDeaths);
      console.log("Total Recovered: " + result.data.TotalRecovered);
    }
  } catch (err) {
    spinnerObj.stop(true);
    console.error(err);
  }
};

const getSpecificCountrySummary = async (name) => {
    console.log("TWO");
  try {
    spinnerObj.start();
    const url = `${urlMap.baseUrl}${urlMap.country}/${name}`;
    const result = await axios({
      method: "get",
      url,
      headers: { Accept: "application/json" },
    });

    spinnerObj.stop(true);
    if (result) {
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
          recovered,
        ]);
      }

      table.unshift([
        colors.bold("Date"),
        colors.bold("Confirmed"),
        colors.bold("Death"),
        colors.bold("Recovered"),
      ]);
      console.log(table.toString());
    }
  } catch (err) {
    spinnerObj.stop(true);
    // console.error(err);
  }
};

module.exports = {
  getCovidSummary,
  getSpecificCountrySummary,
};
