module.exports = async (ctx) => {
    const {id} = ctx.params;
	const doc = await ctx.cards.get(id);

	if (!doc) ctx.throw(404, `card with id=${id} not found`);
	ctx.body = doc;
};
