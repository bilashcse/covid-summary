#! /usr/bin/env node
const program = require("commander");

const pkg = require("./package.json");
const { getCovidSummary, getSpecificCountrySummary } = require("./src/covid");



program.version(pkg.version);
program
  .command("live")
  .description("Show live covid-19 worlds summary")
  .action(getCovidSummary);
program
  .option('-c, --country <value>', "Show country status")
  .action(async function () {
    if(program.country) await getSpecificCountrySummary(program.country);
  })

program.parse(process.argv);

yargs