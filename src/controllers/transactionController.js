const db = require('../models/db');
const Redis = require('ioredis');


exports.createTransaction = (req, res) => {
    const { user_id, type, amount } = req.body;
    const sql = 'INSERT INTO transaction (user_id, type, amount) VALUES (?, ?, ?)';
    db.query(sql, [user_id, type, amount], (err, result) => {
        if (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while adding the transaction' });
        } else {
            const insertedTransactionId = result.insertId;

            const redisClient = new Redis();
            const redisKey = `user:${user_id}`

            redisClient.del(redisKey, (delErr, deletedaccount) => {
                if(delErr){
                    console.error(delErr);
                }else{
                    console.log(`Delete Cache user_id : ${user_id}`)
                }
                redisClient.quit();
            });

        res.json({ message: 'Transaction Added', id: insertedTransactionId });
        }
    });
};


exports.updateTransaction = (req, res) => {
    const transactionId = req.params.id;
    const { type, amount } = req.body;
    let userId;

    const fetchTransactionSQL = "SELECT user_id FROM transaction WHERE id = ?";
    const updateTransactionSQL = "UPDATE transaction SET type = ?, amount = ? WHERE id = ?"

    // const sql = 'UPDATE transactions SET type = ?, amount = ? WHERE id = ?';
    db.query(fetchTransactionSQL, [transactionId], (fetchErr,fetchResult) => {
        if (fetchErr || fetchResult.length === 0) {
        console.error(fetchErr || "Transaction Not Found");
        res.status(404).json({ error: "Transaction Not Found" });
        return
        }
        userId = fetchResult[0].user_id

        

        db.query(
            updateTransactionSQL, [type,amount,transactionId],(updateErr) => {
                if (updateErr){
                    console.error(updateErr);
                    res.status(500).json({
                        error:"An ERROR occurred while updating transaction",
                    })
                }
                else {
                    res.json({ message: 'Transaction updated successfully' });

                    const redisClient = new Redis();
                    const redisKey = `user:${userId}`;

                    redisClient.del(redisKey, (delErr,deletedaccount) => {
                        if (delErr) {
                            console.error(delErr);
                        } else {
                            console.log(`Deleted Cache  for user id : ${userId}`)
                        }
                        redisClient.quit();
                    })
                }
            }
        )
    });
};


exports.deleteTransaction = (req, res) => {
    const transactionId = req.params.id;
    const sql = 'DELETE FROM transaction WHERE id = ?';
    db.query(sql, [transactionId], (err) => {
        if (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while deleting the transaction' });
        } else {
        res.json({ message: 'Transaction Deleted' });
        }
    });
};


exports.getAllTransactions = (req, res) => {
    const sql = 'SELECT * FROM transaction';
    
    db.query(sql, (err, result) => {
    if (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching transactions' });
    } else {
        res.json(result)
    }
    });
};


exports.getTransactionsByUser = (req, res) => {
    const userId = req.params.userId;
    const sql = 'SELECT * FROM transaction WHERE user_id = ?';
    db.query(sql, [userId], (err, result) => {
    if (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching user transactions' });
    } else {
        res.json(result);
    }
    });
};


exports.getTransactionsByType = (req, res) => {
    const type = req.params.type;
    const sql = 'SELECT * FROM transaction WHERE type = ?';
    db.query(sql, [type], (err, result) => {
    if (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching transactions' });
    } else {
        res.json(result);
    }
    });
};


exports.getTransactionsByTypeAndUser = (req, res) => {
    const type = req.params.type;
    const userId = req.params.userId;
    const sql = 'SELECT * FROM transaction WHERE type = ? AND user_id = ?';
    db.query(sql, [type, userId], (err, result) => {
    if (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching transactions' });
    } else {
        res.json(result);
    }
    });
};