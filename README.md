# Africa Electricity Grids Explorer
[The World Bank](http://www.worldbank.org/) has created the **Africa Electricity Grids Explorer** as a way to navigate the most up to date collection of open data on grid networks in Sub-Saharan Africa. This effort intends to support initiatives in grid and off-grid electricity access, grid infrastructure upgrading, renewable energy, sector planning as well as overall energy sector dialogue. It also constitutes part of a push to increase the openness and accessibility of energy data for Sustainable Development Goals, building on the [ENERGYDATA.INFO](https://energydata.info/) platform, along with long-standing platforms like [World Bank Open Data](http://data.worldbank.org/).

This flagship dataset is based on a wide variety of sources, some already open, some open but hard to find, and many that have not been made publicly available before. Apart from highlighting the important progress that has been made in opening grid and other energy-related data globally, this tool also serves to identify current gap in data availability and helps inform further efforts in the space. For more information and copyright information, please visit the full source dataset: [Africa - Electricity Transmission and Distribution (2017)](https://energydata.info/dataset/africa-electricity-transmission-and-distribution-2017) on [ENERGYDATA.INFO](https://energydata.info/). Please also explore the many other [datasets](https://energydata.info/dataset) and [apps](https://energydata.info/apps) that have been made available on this platform.

The World Bank welcomes the opportunity to collaborate further with data providers and users in making more data, visualizations and tools publicly available. Please contact our team at [energydata@worldbankgroup.org](mailto:energydata@worldbankgroup.org) if you are interested in collaborating further with energydata.info.

## Installation and Usage

The steps below will walk you through setting up your own instance of the project.

### Install Project Dependencies
To set up the development environment for this website, you'll need to install the following on your system:

- [Node](http://nodejs.org/) v6 (To manage multiple node versions we recommend [nvm](https://github.com/creationix/nvm))
- [Yarn](https://yarnpkg.com/) Package manager

### Install Application Dependencies

If you use [`nvm`](https://github.com/creationix/nvm), activate the desired Node version:

```
nvm install
```

Install Node modules:

```
yarn install
```

### Usage

#### Config files
All the config files can be found in `app/assets/scripts/config`.
After installing the projects there will be 3 main files:
  - `local.js` - Used only for local development. On production this file should not exist or be empty.
  - `staging.js`
  - `production.js`

The `production.js` file serves as base and the other 2 will override it as needed:
  - `staging.js` will be loaded whenever the env variable `DS_ENV` is set to staging.
  - `local.js` will be loaded if it exists.

The following options must be set: (The used file will depend on the context):
  - `value` - Description

Example:
```
module.exports = {
  value: 'some-value'
};
```

#### Starting the app

```
yarn run serve
```
Compiles the sass files, javascript, and launches the server making the site available at `http://localhost:3000/`
The system will watch files and execute tasks whenever one of them changes.
The site will automatically refresh since it is bundled with livereload.

# Deployment
To prepare the app for deployment run:

```
yarn run build
```
or
```
yarn run stage
```
This will package the app and place all the contents in the `dist` directory.
The app can then be run by any web server.
