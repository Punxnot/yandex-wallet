module.exports = async (ctx) => {
	ctx.body = await ctx.cards.getAll()
};
