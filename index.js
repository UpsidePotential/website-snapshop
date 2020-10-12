import express from 'express';
import cors from 'cors';

require('dotenv').config();

const app = express();
app.use(cors())
let port = process.env.PORT;
if (port === undefined || port === '') {
  port = 80;
}

app.listen(port, () => {
  console.info(`App Listening on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('wecome to docker!')
});


console.log('hello internet')