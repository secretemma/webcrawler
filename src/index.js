import "@babel/polyfill";

import Crawler from "./crawler";

const args = process.argv.slice(2);
if (args.length < 1) {
  console.log("Must pass a starting URL");
  process.exit(1);
}

const startURL = args[0];

// TODO: validate URL

const crawler = new Crawler(startURL);
crawler.crawl();
