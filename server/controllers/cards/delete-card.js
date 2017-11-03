module.exports = async (ctx) => {
    await ctx.cards.remove(ctx.params.id);

    ctx.body = {
        result: 'success'
    };

    ctx.status = 200;
};
