const router = require('koa-router')();
const currency = require('../services/currency');

router.get('/', ctx => ctx.body = currency.getCurrencies());

module.exports = router;
