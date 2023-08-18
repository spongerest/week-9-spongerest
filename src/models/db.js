const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'containers-us-west-114.railway.app',
    port: "6063",
    user: 'root',
    password: '5uStIarJrHVZgHV95uev',
    database: 'railway'
});

module.exports = db;