import express from 'express';
import cors from 'cors';
import * as captureWebsite from 'capture-website';
import fs from 'fs';
import temp from 'temp';

require('dotenv').config();

const app = express();
app.use(cors())
let port = process.env.PORT;
if (port === undefined || port === '') {
  port = 8080 as any;
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
