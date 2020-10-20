import express from 'express';
import cors from 'cors';
import * as captureWebsite from 'capture-website';
import { Page } from 'puppeteer';

require('dotenv').config();

// Special options when we are running inside docker container
const launchOptions = process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD === 'true' ? { executablePath: 'google-chrome-stable' } : {};
const apiKey = process.env.API_KEY;

const app = express();
app.use(cors());
let port = process.env.PORT;
if (port === undefined || port.trim() === '') {
  port = 8080 as any;
}

app.listen(port, () => {
  console.info(`App Listening on port ${port}`);
});

app.get('/', (req, res): void => {
  res.send('wecome to zombocom!');
});

app.get('/spy', (req, res): void => {
  if (apiKey !== undefined && res.getHeader('API_KEY') !== apiKey) {
    res.status(403);
    res.end('API_KEY required');
    return;
  }

  captureWebsite.buffer('https://finviz.com/map.ashx', {
    width: 1200,
    height: 2000,
    timeout: 90000,
    element: 'canvas.chart',
    launchOptions: {
      ...launchOptions,
      args: ['--no-sandbox'],
    },
  }).then((buffer) => {
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': Buffer.byteLength(buffer),
    });
    res.end(buffer);
  });
});

app.get('/etf', (req, res): void => {
  if (apiKey !== undefined && res.getHeader('API_KEY') !== apiKey) {
    res.status(403);
    res.end('API_KEY required');
    return;
  }

  captureWebsite.buffer('https://finviz.com/map.ashx?t=etf', {
    width: 1200,
    height: 2000,
    timeout: 90000,
    element: 'canvas.chart',
    launchOptions: {
      ...launchOptions,
      args: ['--no-sandbox'],
    },
  }).then((buffer) => {
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': Buffer.byteLength(buffer),
    });
    res.end(buffer);
  });
});

const setValue = async (page: Page, selector: string, value: string): Promise<void> => {
  await page.evaluate((selectorName) => {
    document.querySelector(selectorName).value = '';
  }, selector);
  await page.type(selector, value);
};

app.get('/tweet', (req, res): void => {
  if (apiKey !== undefined && res.getHeader('API_KEY') !== apiKey) {
    res.status(403);
    res.end('API_KEY required');
    return;
  }

  const tweet = req.query as any;
  captureWebsite.buffer('https://lluiscamino.github.io/fake-tweet/', {
    height: 1200,
    element: '.tweet',
    beforeScreenshot: async (page) => {
      await setValue(page, 'input#nickname', tweet.nickname);
      await setValue(page, 'input#name', tweet.name);
      await setValue(page, 'input#avatar', tweet.avatar);
      await page.select('select#display', 'lightsout');

      const date = new Date();
      await setValue(page, 'input#date',
        date.toLocaleString('en-US', { timeZone: 'America/Chicago' }));

      await setValue(page, 'textarea#text', tweet.text);

      if (tweet.retweets) {
        await setValue(page, 'input#retweets', tweet.retweets.toString());
      }
      if (tweet.retweetsWithComments) {
        await setValue(page, 'input#retweetsWithComments', tweet.retweetsWithComments.toString());
      }
      if (tweet.likes) {
        await setValue(page, 'input#likes', tweet.likes.toString());
      }
    },
    launchOptions: {
      ...launchOptions,
      args: ['--no-sandbox'],
    },
  }).then((buffer) => {
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': Buffer.byteLength(buffer),
    });
    res.end(buffer);
  });
});
