
## "covid-summary" Simple CLI app
"covid-summary" is a simple cli app to show live updates of covid-19. You can check live updates for whole worlds or specify by country.

## Features
* Live covid-19 updates of total death, active cases, confirm & recovered count for whole world.
* Specific Countries covid-19 latest live updates for total death, active cases, confirm & recovered count


## Installation

```
$ npm i -g covid-summary
```

### Available Options
Usage: covid-summary [OPTIONS] [FILTER_NAMES]...

To check world's live updates, run:
```
$ covid-summary live
```
or,
```
$ covid-summary --help
```
This should show:

```
Filters:
  -v, --version      Show version number
  -c, --country      Show Specific country to show summary 
  -h, --help         Show help
```