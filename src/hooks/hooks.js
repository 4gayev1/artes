const {
  BeforeAll,
  Before,
  After,
  Status,
  setDefaultTimeout,
} = require("@cucumber/cucumber");
const { invokeBrowser } = require("../helper/contextManager/browserManager");
const { invokeRequest } = require("../helper/contextManager/requestManager");
const { pomCollector } = require("../helper/pomController/pomCollector");
const cucumberConfig = require("../../cucumber.config");
const { context } = require("./context");
const fs = require("fs");

let browser;
let request;

setDefaultTimeout(cucumberConfig.default.timeout * 1000);

BeforeAll(async function () {
  pomCollector();
});

Before(async function () {
  browser = await invokeBrowser();
  request = await invokeRequest();

  context.page = await browser.newPage();
  await context.page.setDefaultTimeout(cucumberConfig.default.timeout * 1000);

  context.request = await request;

  await browser.tracing.start({
    sources: true,
    screenshots: true,
    snapshots: true,
  });
});

After(async function ({ pickle, result }) {
  let img;

  if (result?.status != Status.PASSED) {
    img = await context.page.screenshot({
      path: `./test-results/visualReport/${pickle.name}/${pickle.name}.png`,
      type: "png",
    });
    await this.attach(img, "image/png");
  }

  await browser.tracing.stop({ path: "./trace.zip" });
  await context.page.close();
  await browser.close();

  if (result?.status != Status.PASSED) {
    const videoPath = await context.page.video().path();
    const webmBuffer = await fs.readFileSync(videoPath);
    await this.attach(webmBuffer, "video/webm");
  }
});
