const { expect } = require("playwright/test");
const { Given, When, Then } = require("@cucumber/cucumber");
const { getElement } = require("../pomController/elementController");
const { context } = require("../../hooks/context");

const element = getElement;
const page = context.page;
const request = context.request;

const path = require("path");
const modulePath = process.cwd();
const projectPath = modulePath.split(/[/\\]/).slice(0, -2).join("/");

const moduleConfig = {
  projectPath: projectPath,
  modulePackageJsonPath: path.join(modulePath, "/package.json"),
  modulePath: path.join(modulePath, "/node_modules/artes"),
  reportPath: path.join(modulePath, "/report"),
  cucumberConfigPath: path.join(projectPath, "/artes.config.js"),
  featuresPath: path.join(projectPath, "/tests/features/"),
  stepsPath: path.join(projectPath, "/tests/steps/*.js"),
  pomPath: path.join(projectPath, "/tests/POMs"),
  cleanUpPaths: "allure-result test-results @rerun.txt",
};

module.exports = {
  expect,
  Given,
  When,
  Then,
  element,
  page,
  request,
  context,
  moduleConfig,
};