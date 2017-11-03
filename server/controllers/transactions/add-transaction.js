const addTransaction = require('../add-transaction-method');

module.exports = async (ctx) => {
	const {id} = ctx.params;

	const {type, data, time, sum} = ctx.request.body;

	if (!type || !data || !sum)
		ctx.throw(400, 'properties required');

	const card = await ctx.cards.get(id);
	if (!card) ctx.throw(404, `card with id=${id} not found`);

	const transaction = {
		cardId: id,
		type,
		data,
		time: Number(time) || Math.floor(Date.now() / 1000),
		sum: Number(sum)
	};

	await addTransaction(transaction, ctx, card);

	ctx.body = {
		status: 'success'
	};

	ctx.status = 201;
};
