const PassThrough = require('stream').PassThrough;
const moment = require('moment');
const transactionsToCSV = require('../transactions-to-CSV');

module.exports = async (ctx) => {
	const cursor = await ctx.transactions.getByCardIdStream(ctx.params.id);
	const stream = new PassThrough();

	transactionsToCSV(cursor, stream, ctx);
	ctx.type = 'csv';
	ctx.set('Content-disposition', `attachment; filename=${moment().format('DD-MM-YYYY')}-transactions-history.csv`);
	ctx.body = stream;
};
