import express from 'express';
import cors from 'cors';
import * as captureWebsite from 'capture-website';
import fs from 'fs';
import temp from 'temp';
import { Page } from 'puppeteer';

require('dotenv').config();

const app = express();
app.use(cors())
let port = process.env.PORT;
if (port === undefined || port === '') {
  port = 80 as any;
}

app.listen(port, () => {
  console.info(`App Listening on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('wecome to zombocom!')
});

app.get('/spy', (req, res) =>  {
    const imageName = temp.path({suffix: '.png'});
    captureWebsite.file('https://finviz.com/map.ashx', imageName, {
        width: 1200,
        height: 2000,
        timeout: 90000,
        element: 'canvas.chart',
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
          ],
        },
      }).then( ()=> {
        const img = fs.readFileSync(imageName, { encoding: 'base64'})

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        });
        res.end(img); 
        fs.unlink(imageName, () => {});
      })
});

app.get('/etf', (req, res) =>  {
    const imageName = temp.path({suffix: '.png'});
    captureWebsite.file('https://finviz.com/map.ashx?t=etf', imageName, {
        width: 1200,
        height: 2000,
        timeout: 90000,
        element: 'canvas.chart',
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
          ],
        },
      }).then( ()=> {
        const img = fs.readFileSync(imageName, { encoding: 'base64'})

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        });
        res.end(img); 
        fs.unlink(imageName, () => {});
      })
});

interface Tweet {
  nickname: string;
  name: string;
  avatar: string;
  text: string;
  retweets?: number;
  retweetsWithComments?: number;
  likes?: number;
}

let setValue = async function (page: Page, selector: string, value: string): Promise<void> {
  await page.evaluate((selectorName) => {
    document.querySelector(selectorName).value = '';
  }, selector);
  await page.type(selector, value);
}


///tweet?color1=red&color2=blue
app.get('/tweet', (req, res) =>  {
  const tweet = req.query as any;
  const imageName = temp.path({suffix: '.png'});
  captureWebsite.file('https://lluiscamino.github.io/fake-tweet/', imageName, {
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
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    },
  }).then( ()=> {
    const img = fs.readFileSync(imageName, { encoding: 'base64'})

    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });
    res.end(img); 
    fs.unlink(imageName, () => {});
  })
});
