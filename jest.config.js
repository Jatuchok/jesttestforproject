/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  // Use this configuration option to add custom reporters to Jest
  reporters: ['default', ['jest-html-reporters', {
    publicPath: './html-report',
    filename: 'report.html',
    pageTitle: 'Test Report',
    openReport: true
  }]],

  // The test environment that will be used for testing
  testEnvironment: 'node',
};