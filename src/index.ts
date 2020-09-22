import express from 'express';

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
  res.send('Hello World!!');
});
