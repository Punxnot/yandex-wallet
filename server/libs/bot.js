const TelegramBot = require('node-telegram-bot-api');
const token = '248027235:AAFbrU-WVBSp__tmgEoU-6nJb82LKiTbc3E';
const url = "https://api.telegram.org/bot248027235:AAFbrU-WVBSp__tmgEoU-6nJb82LKiTbc3E/"
const bot = new TelegramBot(token);

const telegramBot = {
	/**
	 * Отправляет сообщение заданному пользователю
	 *
	 * @param {String} chatId id чата
	 * @param {String} message текст сообщения
	 */
	sendNotification(chatId, message) {
    bot.sendMessage(chatId, message);
	}
};

module.exports = telegramBot;