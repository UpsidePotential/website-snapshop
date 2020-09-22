import express from 'express';
import * as captureWebsite from 'capture-website';
import fs from 'fs';

require('dotenv').config();

const app = express();
let port = process.env.PORT;
if (port === undefined || port === '') {
  port = 8000 as any;
}

app.listen(port, () => {
  console.info(`App Listening on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('wecome to zombocom!')
});

app.get('/spy', (req, res) =>  {
    captureWebsite.file('https://finviz.com/map.ashx', 'screenshot.png', {
        width: 1200,
        height: 2000,
        element: 'canvas.chart',
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
          ],
        },
      }).then( ()=> {
        const img = fs.readFileSync('screenshot.png')

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        });
        res.end(img); 
        fs.unlink('screenshot.png', () => {});
      })
  
      
      


});
