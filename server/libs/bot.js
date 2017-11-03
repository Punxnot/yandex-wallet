const axios = require('axios');
const UsersContext = require('../data/users_context');
const TelegramBot = require('node-telegram-bot-api');
const {TELEGRAM_TOKEN} = require('../config-env');
const bot = new TelegramBot(TELEGRAM_TOKEN);
const baseTelegramUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/`;

const telegramBot = {
	/**
	 * Отправляет Telegram-оповещение пользователю
	 *
	 * @param {Object} notificationParams параметры нотификации
	 */
	sendNotification(notificationParams) {
		const chatId = notificationParams.user.chatId;
		var message;
		if (notificationParams.type == 'paymentMobile') {
			message = `С вашей карты ${notificationParams.card.cardNumber} было переведено ${notificationParams.amount}${notificationParams.card.currency} на телефон ${notificationParams.phone}`;
		} else {
			message = `На вашу карту ${notificationParams.card.cardNumber} поступило ${notificationParams.amount}${notificationParams.card.currency}`;
		}
		if (chatId) {
			bot.sendMessage(chatId, message);
		}
	}
};

module.exports = telegramBot;