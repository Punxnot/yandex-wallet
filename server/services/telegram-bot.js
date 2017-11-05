const CardsContext = require('../data/cards_context');
const TransactionsContext = require('../data/transactions_context');
const UsersContext = require('../data/users_context');
const ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const axios = require('axios');


const CURRENCY_ENUM = {
    'RUB': '🇷🇺 р.',
    'USD': '🇺🇸 $',
    'EUR': '🇪🇺 €'
}

class TelegramBot {
    constructor() {
        this.bot = require('../libs/bot');
        this.initBotCommands();
    }

    /**
    * Контекст пользователя
    * @param {String} id идентификатор пользователя
    * @returns {Context} Контекст транзакций
    */
    transactions(id) {
        return new TransactionsContext(id);
    }

    /**
    * Контекст пользователя
    * @param {String} id идентификатор пользователя
    * @returns {Context} Контекст карт
    */
    cards(id) {
        return new CardsContext(id);
    }

    /**
    * Контекст пользователя
    * @returns {Context} Контекст пользователей
    */
    users() {
        return new UsersContext();
    }

    /**
    * Находит пользователя по id
    * @param {String} id идентификатор пользователя
    * @returns {Object} Объект пользователя
    */
    async userInstance(id) {
        const _id = id.toString();
        return await this.users().getOne({chatId: _id});
    }

    /**
    * Находит пользователя по секретному ключу
    * @param {String} telegramKey Секретный ключ
    * @returns {Object} Объект пользователя
    */
    async getUserByTelegramKey(telegramKey) {
        const _key = telegramKey.toString();
        return await this.users().getOne({telegramKey: _key});
    }

    /**
    * Инициализирует стартовую команду
    * @param {Object} user Объект пользователя
    * 
    */
    initBotCommands() {
        this.setUserChatId();
    }

    /**
    * Инициализирует чат с ботом
    * @param {Object} user Объект пользователя
    * 
    */
    initChatId(user) {
        if (user && user.chatId) {
            this.commandsList(user);
            this.getCardsListСommand(user);
            this.getTransactionsCommand(user);
            this.cardsButtonsCommand(user);
            this.mobilePaymentCommand(user);
        }
    }

     /**
    * Команда списка транзакций по карте
    * @param {Object} user Объект пользователя
    * 
    */
    mobilePaymentCommand(user) {
        this.bot.command('/mobile', async (ctx) => {
            const params = ctx.message.text.split(' ');
            const pay = await this.makePayment("59e9ce16131a183238cc784e", params[1], params[2]);
            ctx.reply(pay);
        });
    }

    async makePayment (id, phone, amount) {
        const payment = {
            phone: '89211234567',
            amount: 500
        };
        const token = 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU5ZjI5OWE0ZDYxMWFkMDFkMDExNWIwOSIsImV4cCI6MTUxMDQwMTY1NjI1NH0.snewL_Rkavr_DYQilo5tb3K4fqSphWx3Mkb8tjYEkmI';
        try {
            const { data } = await axios
                .post(`http://localhost:3000/api/cards/${id}/pay`, payment, {
                    headers: {
                        authorization: token
                    }
                });
            if (data.status === 'success' || data.status === 200) {
                return `Mobile payment to the 📱 ${payment.phone} was fullfilled for amount of 💰 ${payment.amount}`
            } else {
                return '🙄 Something bad happened with request'
            }
        } catch (err) {
            return err.message;
        }
    }

    /**
    * Команда списка транзакций по карте
    * @param {Object} user Объект пользователя
    * 
    */
    getTransactionsCommand(user) {
        this.bot.command('/last', async (ctx) => {
            const _card = ctx.message.text.substr(ctx.message.text.length - 4);
            await this.getTransactions(_card, user, ctx);
        });
    }


    /**
    * Список транзакций по карте
    * @param {String} cardNumber карта пользователья
    * @param {Object} user Объект пользователя
    * @param {Context} ctx контекст бота
    * 
    */
    async getTransactions(cardNumber, user, ctx) {
        const cards = await this.cards(user.id);
        const card = await cards.getOne({cardNumber: {'$regex': `${cardNumber}$`}});
        if (card) {
            const transactions = this.transactions(user.id);
            const allTransactions = await transactions.getTransactions(card.id);
            if(allTransactions && allTransactions.length > 0) {
                ctx.reply(`Here is some of your latest transactions from
💳 **** **** **** ${cardNumber} 💳 

Transactions:
${allTransactions.map((transaction) => `Sum: ${transaction.sum} ${CURRENCY_ENUM[card.currency]} | Type: ${transaction.type} | Time: ${moment(transaction.time).format('H:mm DD/MM/YY ')}`).join('\n')}`);
            } else {
                ctx.reply(`🙄 There are no transactions with this card.`);
            }
        } else {
            ctx.reply(`🙄 There are no such card assigned for you.`);
        }
    }

    /**
    * Команда списка карт пользователя
    * @param {Object} user Объект пользователя
    * 
    */
    getCardsListСommand(user) {
        this.bot.command('/allcards', async (ctx) => {
            await this.getCardsList(user, ctx);
        });
    }

    /**
    * Команда списка карт пользователя
    * @param {Object} user Объект пользователя
    * @param {Context} ctx контекст бота
    * 
    */
    async getCardsList(user, ctx) {
        const allCards = await this.cards(user.id).getAll();
        if(allCards && allCards.length > 0) {
            ctx.reply(allCards.map((card) => `
💳 **** **** **** ${card.cardNumber.substr(card.cardNumber.length - 4)}
Money availvable: ${card.balance} ${CURRENCY_ENUM[card.currency]}
Card will expire ${card.exp}
__________________________
            `).join('\n'));
        } else {
            ctx.reply(`🙄 There are no such card assigned for you.`);
        }
    }

    /**
    * Команда списка команд доступных у бота
    * @param {Object} user Объект пользователя
    * 
    */
    commandsList(user) {
        this.bot.command('commands', (ctx) => {
            return ctx.reply('Available commands', Markup
                .keyboard([
                    ['💳  Cards by buttons', '💳  Inline cards list']
                ])
                .oneTime()
                .resize()
                .extra()
            );
        });
        this.bot.hears('💳  Cards by buttons', async ctx => await this.cardsButtons(user, ctx));
        this.bot.hears('💳  Inline cards list', async ctx => await this.getCardsList(user, ctx))
    }

    /**
    * Проводит верификацию секретного ключа пользователя
    *
    */
    setUserChatId() {
        this.bot.command('/getupdates', async (ctx) => {
            const inputTelegramKey = ctx.message.text.split("/getupdates ")[1];
            if (inputTelegramKey) {
                const user = await this.getUserByTelegramKey(inputTelegramKey);
                if (user && user.email) {
                  await this.users().addField({"email": user.email}, "chatId", ctx.chat.id);
                  this.initChatId(user);
                  ctx.reply(`✅ Cool, you are now signed in!
Type: 
/commands — to see available UI commands
/cards — to see all availaible cards
/allcards — to see all availaible cards in inline mode
/last <Last 4 digits of your 💳  number> — to get list of transactions`);
                } else {
                  ctx.reply(`❌ Sorry, this is not valid secret Telegram key.
Make sure you inserted correct key.`);
                }
            }
        })
    }

    /**
    * Команда списка карт пользователя в виде кнопок
    * @param {Object} user Объект пользователя
    * 
    */
    cardsButtonsCommand(user) {
        this.bot.command('/cards', async (ctx) => {
            await this.cardsButtons(user, ctx);
        });
    }

    /**
    * Команда списка карт пользователя в виде кнопок
    * @param {Object} user Объект пользователя
    * @param {Context} ctx контекст бота
    * 
    */
    async cardsButtons(user, ctx) {
        this.bot.action(/.+/, async (ctx) => {
            await this.getTransactions(ctx.match[0], user, ctx);
        });
        const allCards = await this.cards(user.id).getAll();
        return ctx.reply('<b>Select card to view transactions</b>', Extra.HTML().markup((m) =>
            m.inlineKeyboard(allCards.map((card) => m.callbackButton(`💳  ${card.cardNumber.substr(card.cardNumber.length - 4)} — ${CURRENCY_ENUM[card.currency]}`, `${card.cardNumber.substr(card.cardNumber.length - 4)}`)))
        ));
    }

    /**
    * Команда списка карт пользователя для пополнения мобильного
    * @param {Object} user Объект пользователя
    * @param {Context} ctx контекст бота
    * 
    */
    async cardsButtonsMobilePayment(user, ctx) {
        this.bot.action(/.+/, async (ctx) => {
            await this.getTransactions(ctx.match[0], user, ctx);
        });
        const allCards = await this.cards(user.id).getAll();
        return ctx.reply('<b>Select card to make mobile payment</b>', Extra.HTML().markup((m) =>
            m.inlineKeyboard(allCards.map((card) => m.callbackButton(`💳  ${card.cardNumber.substr(card.cardNumber.length - 4)} — ${CURRENCY_ENUM[card.currency]}`, `${card.cardNumber.substr(card.cardNumber.length - 4)}`)))
        ));
    }

    /**
    * Отправляет Telegram-оповещение пользователю
    *
    * @param {Object} notificationParams параметры нотификации
    */
  	sendNotification(notificationParams) {
        const {chatId} = notificationParams.user;
        const {card, phone, amount}= notificationParams;
        const cardNumberSecure = card.cardNumber.substr(card.cardNumber.length - 4);
    		var message;
    		if (notificationParams.type == 'paymentMobile') {
    			message = `С вашей карты **** **** **** ${cardNumberSecure} было переведено ${amount}${card.currency} на телефон ${phone}`;
    		} else {
    			message = `На вашу карту **** **** **** ${cardNumberSecure}  поступило ${amount}${card.currency}`;
    		}
    		if (chatId) {
    			this.bot.telegram.sendMessage(chatId, message);
    		}
    }

}

module.exports = new TelegramBot();