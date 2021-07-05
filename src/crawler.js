import axios from "axios";

class Crawler {
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
      await this.readPage(urlToFetch);
      this.urlQueue = this.urlQueue.slice(1);
    }
    console.log(this.phoneNumbers);
  };

  readPage = async url => {
    const response = await axios.get(url);
    this.visitedUrls.add(url);
  };
}

const args = process.argv.slice(2);
if (args.length < 1) {
  console.log("Must pass a starting URL");
  process.exit(1);
}

const startURL = args[0];

// TODO: validate URL

const crawler = new Crawler(startURL);
crawler.crawl();
