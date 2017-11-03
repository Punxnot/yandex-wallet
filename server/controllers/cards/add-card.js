module.exports = async (ctx) => {
        const {cardNumber, currency, exp, name, balance} = ctx.request.body;
    
        if (!cardNumber || !currency || !exp || !name)
            ctx.throw(400, 'properties required');
    
        const card = {
            cardNumber,
            currency,
            exp,
            name,
            balance: Number(balance) || 0,
            userId: ctx.params.userId
        };
    
        try {
            await ctx.cards.validate(card);
        } catch (err) {
            ctx.throw(400, err);
        }
    
        ctx.body = await ctx.cards.add(card);
        ctx.status = 201;
};
