const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const userController = require('../controllers/userController');


router.post('/transactions', transactionController.createTransaction);


router.put('/transactions/:id', transactionController.updateTransaction);


router.delete('/transactions/:id', transactionController.deleteTransaction);


router.get('/transactions', transactionController.getAllTransactions);


router.get('/transactions/user/:userId', transactionController.getTransactionsByUser);


router.get('/transactions/type/:type', transactionController.getTransactionsByType);


router.get('/transactions/type/:type/user/:userId', transactionController.getTransactionsByTypeAndUser);


router.get('/users/:id', userController.getUserInfo);

module.exports = router;