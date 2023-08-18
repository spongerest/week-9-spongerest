const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const bodyParser = require('body-parser');
const Redis = require('ioredis');

const app = express();
const port = 6063;

const r = new Redis({
    host: 'containers-us-west-118.railway.app',
    password : "PioptdoxC4ErQ58Ucra1",
    port: 5910,
});

// const redisClient = new Redis();

app.use(bodyParser.json());

app.use('/api', apiRoutes);

r.on("connect", () =>{
    console.log("Connected Redis")
})

const db = require('./models/db');
db.connect(err => {
    if (err) {
        console.error('Error MySQL: ' + err.stack);
        return;
    }
    console.log('Connected MySQL as id ' + db.threadId);
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});