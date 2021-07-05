import "regenerator-runtime";
import { expect } from "chai";

import Crawler from "../src/crawler";

describe("Crawler", function() {
  describe("crawl", function() {});

  describe("crawlPage", function() {});

  describe("fetchPage", function() {});

  describe("getPageUrls", function() {
    it("finds a link to an absolute URL", function() {
      const pageContent = `
        <html>
          <body>
            <p>This is a page!</p>
            <p><a href="https://therecount.github.io/interview-materials/project-a/2.html">Page #2</a></p>
          </body>
        </html>
      `;
      const crawler = new Crawler();
      const urls = crawler.getPageUrls(
        pageContent,
        "https://therecount.github.io"
      );
      expect(urls).to.have.length(1);
      expect(urls[0]).to.equal(
        "https://therecount.github.io/interview-materials/project-a/2.html"
      );
    });
  });
});
