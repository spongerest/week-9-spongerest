const db = require('../models/db');
const Redis = require('ioredis');



exports.getUserInfo = (req, res) => {
    const userId = req.params.id;

    const redisKey = `user:${userId}`
    const r = new Redis({
        host: 'containers-us-west-118.railway.app',
        password : "PioptdoxC4ErQ58Ucra1",
        port: 5910,
    });


    r.get(redisKey, (redisErr, cachedData) => {
        if (cachedData) {
        res.json(JSON.parse(cachedData));
        console.log('get data from cache');
        } else {
        const sql = 'SELECT users.id, name, address, ' +
                    'SUM(CASE WHEN type="income" THEN amount ELSE 0 END) AS total_income, ' +
                    'SUM(CASE WHEN type="expense" THEN amount ELSE 0 END) AS total_expense ' +
                    'FROM users ' +
                    'LEFT JOIN transaction ON users.id = transaction.user_id ' +
                    'WHERE users.id = ? ' +
                    'GROUP BY users.id';
        db.query(sql, [userId], (err, result) => {
            if (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while fetching user information' });
            } else {
            const userData = {
                id: result[0].id,
                name: result[0].name,
                address: result[0].address,
                balance: result[0].total_income - result[0].total_expense,
                expense: result[0].total_expense
            };


            r.setex(redisKey, 300, JSON.stringify(userData));
            res.json(userData);
            console.log('add new data to cache');
            }
        });
        }
    });
}