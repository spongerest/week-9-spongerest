const db = require('../models/db');
const Redis = require('ioredis');


exports.createTransaction = (req, res) => {
    const { user_id, type, amount } = req.body;
    const sql = 'INSERT INTO transactions (user_id, type, amount) VALUES (?, ?, ?)';
    db.query(sql, [user_id, type, amount], (err, result) => {
        if (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while adding the transaction' });
        } else {
        res.json({ message: 'Transaction Added', id: result.insertId });
        }
    });
};


exports.updateTransaction = (req, res) => {
    const transactionId = req.params.id;
    const { type, amount } = req.body;
    const sql = 'UPDATE transactions SET type = ?, amount = ? WHERE id = ?';
    db.query(sql, [type, amount, transactionId], (err) => {
        if (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the transaction' });
        } else {
        res.json({ message: 'Transaction updated successfully' });
        }
    });
};


exports.deleteTransaction = (req, res) => {
    const transactionId = req.params.id;
    const sql = 'DELETE FROM transactions WHERE id = ?';
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
    const sql = 'SELECT * FROM transactions';
    
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
    const sql = 'SELECT * FROM transactions WHERE user_id = ?';
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
    const sql = 'SELECT * FROM transactions WHERE type = ?';
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
    const sql = 'SELECT * FROM transactions WHERE type = ? AND user_id = ?';
    db.query(sql, [type, userId], (err, result) => {
    if (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching transactions' });
    } else {
        res.json(result);
    }
    });
};