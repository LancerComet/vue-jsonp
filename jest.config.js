const { jsWithBabel: tsjPreset } = require('ts-jest/presets')

module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ["**/?(*.)+(spec|test).(j|t)s"],
  testTimeout: 10000,
  transform: {
    ...tsjPreset.transform
  }
}
