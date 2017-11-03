const router = require('koa-router')();

// Cards Controllers
const getCards = require('../controllers/cards/get-cards');
const getCard = require('../controllers/cards/get-card');
const addCard = require('../controllers/cards/add-card');
const deleteCard = require('../controllers/cards/delete-card');

// Transactions Controllers
const getTransactions = require('../controllers/transactions/get-transactions');
const getTransactionsFile = require('../controllers/transactions/get-transactions-file');
const addTransaction = require('../controllers/transactions/add-transaction');
const addPayment = require('../controllers/transactions/add-payment');
const addTransfer = require('../controllers/transactions/add-transfer');
const deleteTransaction = require('../controllers/transactions/delete-transaction');


//****************************** ROUTES *************************************/
// Cards
router.get('/',getCards);

router.get('/:id', getCard);

router.post('/', addCard);

router.delete('/:id', deleteCard);

// Transactions
router.get('/:id/transactions', getTransactions);

router.get('/:id/file-transactions', getTransactionsFile);

router.post('/:id/transactions', addTransaction);

router.delete('/:id/transactions/:tranId', deleteTransaction);

router.post('/:id/pay', addPayment);

router.post('/:id/transfer', addTransfer);

module.exports = router;
