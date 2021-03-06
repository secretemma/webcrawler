import axios from "axios";
import { parse } from "node-html-parser";

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const phoneNumberRegex = /[(]{0,1}[0-9]{3}[)]{0,1}[-]{0,1}[0-9]{3}[-]{0,1}[0-9]{4}/g;

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
      this.urlQueue = this.urlQueue.slice(1);
      this.visitedUrls.add(url);
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
      const pagePhoneNumbers = this.getPagePhoneNumbers(pageContent);
      if (pagePhoneNumbers) {
        this.phoneNumbers = [...this.phoneNumbers, ...pagePhoneNumbers];
      }
    } catch (e) {
      // TODO: handle diff errors differently
      console.log("Error visiting ", url);
      console.log(e);
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
      if (urlRegex.test(urlOrPath)) {
        // absolute url
        return urlOrPath;
      } else {
        // relative url
        const [protocol, _, host] = pageUrl.split("/");
        return `${protocol}//${host}${urlOrPath}`;
      }
    });
  };

  getPagePhoneNumbers = pageContent => {
    return pageContent.match(phoneNumberRegex);
  };
}
