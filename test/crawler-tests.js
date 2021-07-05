import "regenerator-runtime";
import axios from "axios";
import { expect } from "chai";
import sinon from "sinon";

import Crawler from "../src/crawler";

describe("Crawler", function() {
  describe("crawlPage", function() {
    let axiosStub;
    beforeEach(function() {
      axiosStub = sinon.stub(axios, "get").resolves({
        data: `
          <html>
            <body>
              <p>555-867-5309</p>
              <p><a href="https://www.anothercoolsite.com">Page #2</a></p>
            </body>
          </html>
        `
      });
    });
    afterEach(function() {
      axiosStub.restore();
    });

    it("fetches the page", function() {
      const crawler = new Crawler("https://www.coolsite.com");
      crawler.crawlPage("https://www.coolsite.com/coolpage");
      sinon.assert.calledWith(axiosStub, "https://www.coolsite.com/coolpage");
    });

    it("adds new urls to the queue", function() {
      const crawler = new Crawler("https://www.coolsite.com");
      crawler.crawlPage("https://www.coolsite.com/coolpage");
      console.log(crawler);
      expect(crawler.urlQueue).to.contain("https://www.anothercoolsite.com");
    });
  });

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

    it("finds a link to a relative URL", function() {
      const pageContent = `
        <html>
          <body>
            <p>This is a page!</p>
            <p><a href="/interview-materials/project-a/3.html">Page #2</a></p>
          </body>
        </html>
      `;
      const crawler = new Crawler();
      const urls = crawler.getPageUrls(
        pageContent,
        "https://therecount.github.io/interview-materials/project-a/2.html"
      );
      expect(urls).to.have.length(1);
      expect(urls[0]).to.equal(
        "https://therecount.github.io/interview-materials/project-a/3.html"
      );
    });
  });
});
