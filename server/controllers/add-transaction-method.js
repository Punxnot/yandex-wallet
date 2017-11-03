const logger = require('../libs/logger')('cards-router');
const currency = require('../services/currency');

/**
 * Добавление транзакции через контекст, переданный в контроллер
 * 
 * @param {Object} transaction Транзакция
 * @param {Object} ctx Контекс карт
 * @param {Object} card Карта инициатор
 * @param {Object} toCard Карта получатель - опционально
 * @returns 
 */
const addTransaction = async (transaction, ctx, card, toCard) => {
	// проверяем транзакцию
	try {
		await ctx.transactions.validate(transaction);
	} catch (err) {
		ctx.throw(400, err);
	}

	// добавляем транзакцию и сохраняем ссылку
	const savedTransaction = await ctx.transactions.add(transaction);

	try { // транзакция добавилась, необходимо обновить баланс карты
		await ctx.cards.affectBalance(card.id, transaction);

		// добавляем вторую транзакцию, если надо 
		if (transaction.type === 'card2Card') {
			const {time, sum} = transaction;

      const receiverSum = currency.convert({
        sum: Math.abs(sum),
        convertFrom: card.currency,
        convertTo: toCard.currency,
      });
      
      if (receiverSum === false) ctx.throw(500, 'payment error. currency operations are not available now. try again later');
      
      const receiverTransaction = {
        cardId: toCard.id,
        type: 'prepaidCard',
        data: card.cardNumber,
        time: time || Math.floor(Date.now() / 1000),
        sum: receiverSum,
      };

			await addTransaction(receiverTransaction, ctx, toCard);
		}
	} catch (err) {
		//помечаем транзакцию невалидной
		await ctx.transactions.setInvalid(savedTransaction.id, err);

		logger.error(`payment error with transaction= ${JSON.stringify(transaction)}`, err);
		ctx.throw(500, 'payment error. call to support');
	}
};

module.exports = addTransaction;
