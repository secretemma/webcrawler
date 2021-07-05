import axios from "axios";
import { parse } from "node-html-parser";

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export default class Crawler {
  constructor(url) {
    this.urlQueue = [url];
    this.visitedUrls = new Set();
    this.phoneNumbers = [];
  }

  // 1. Fetch first URL in queue (and remove from queue)
  // 2. Find phone numbers
  // 3. Find links, add to queue
  // Stop when queue is empty.
  crawl = async () => {
    while (this.urlQueue.length > 0) {
      const urlToFetch = this.urlQueue[0];
      await this.crawlPage(urlToFetch);
    }
    console.log(this.phoneNumbers);
  };

  crawlPage = async url => {
    console.log("Visiting ", url);
    try {
      const pageContent = await this.fetchPage(url);
      const urls = this.getPageUrls(pageContent, url);
      const dedupedUrls = [...new Set(urls)].filter(
        url => !this.visitedUrls.has(url)
      );
      this.urlQueue = [...this.urlQueue, ...dedupedUrls];

      this.phoneNumbers = [
        ...this.phoneNumbers,
        ...this.getPagePhoneNumbers(pageContent)
      ];
    } catch (e) {
      // TODO: handle diff errors differently
      console.log("Error visiting ", url);
      console.log(e);
      return;
    } finally {
      this.urlQueue = this.urlQueue.slice(1);
      this.visitedUrls.add(url);
    }
  };

  fetchPage = async url => {
    const response = await axios.get(url);
    return response.data;
  };

  getPageUrls = (pageContent, pageUrl) => {
    const parsedPage = parse(pageContent);
    return parsedPage.querySelectorAll("a").map(link => {
      const urlOrPath = link.getAttribute("href");
      // TODO: make sure all URL types are handled
      if (urlRegex.test(urlOrPath)) {
        return urlOrPath;
      } else {
        const [protocol, _, host] = pageUrl.split("/");
        return `${protocol}//${host}/${urlOrPath}`;
      }
    });
  };

  getPagePhoneNumbers = pageContent => {
    // TODO: extract phone numbers
    return [];
  };
}
