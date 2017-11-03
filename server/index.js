const http = require('http');
const Koa = require('koa');
const router = require('koa-router')();
const koaBody = require('koa-body')();
const cors = require('koa2-cors');
const serve = require('koa-static');
const mongoose = require('mongoose');

// Turn on auth strategies
const passport = require('koa-passport');

const logger = require('./libs/logger')('app');
const cardsRoute = require('./routes/cards');
const authRoute = require('./routes/auth');
const currencyRoute = require('./routes/currency');

const CardsContext = require('./data/cards_context');
const TransactionsContext = require('./data/transactions_context');
const UsersContext = require('./data/users_context');

// env config
const {MONGO} = require('./config-env');
const PORT = process.env.NODE_PORT || 4000;

mongoose.Promise = global.Promise;
const app = new Koa();

app.use(cors());
app.use(koaBody);
app.use(passport.initialize());

require('./services/passport');

// currency service
require('./services/currency');

// Логгер работает только для нетестовых окружений
if (process.env.NODE_ENV !== 'test')
	app.use(async (ctx, next) => {
		const start = new Date();
		await next();
		const ms = new Date() - start;
		logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
	});

// id param auto-loading
router.param('id', async (id, ctx, next) => {
	var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

	if (!checkForHexRegExp.test(id)) ctx.throw(400, 'id is invalid');
	ctx.params.id = id;

	await next();
});

// Обработчик ошибок
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		ctx.status = err.statusCode || err.status || 500;
		ctx.body = {
			message: err.message
		};
		if (err.isNotLogged) logger.error('Error detected', err);
		if (process.env.NODE_ENV !== 'test') console.error('Error detected', err);
	}
});

/************************ Middlewares **********************/
// Вставка контекста пользователей
app.use(async (ctx, next) => {
	ctx.users = new UsersContext();
	await next();
});

// Вставка данных пользователя и связанных контекстов
const requiredAuth = async (ctx, next) => await passport.authenticate('jwt', async (err, user) => {
		if (!user)
			ctx.throw(401, err || 'auth is required');

		ctx.params.userId = user.id;
		ctx.cards = new CardsContext(user.id);
		ctx.transactions = new TransactionsContext(user.id);

		await next();
	})(ctx, next);

router.use('/api/auth', authRoute.routes());
router.use('/api/cards', requiredAuth, cardsRoute.routes());
router.use('/api/currency', requiredAuth, currencyRoute.routes());

app.use(router.routes());
app.use(router.allowedMethods());

if (process.env.NODE_ENV !== 'test')
	app.use(serve(__dirname + '/../build'));

//********************** Mongo connections and server starts ***************************** */
if (process.env.NODE_ENV !== 'test') {
	const notifyStarting = port => {
		console.log(`YM Node School App listening on port ${port}!`)
		logger.info(`YM Node School App listening on port ${port}!`);
	}

	mongoose.connect(MONGO, {
		useMongoClient: true,
		config: {
			autoIndex: true
		}
	});

	mongoose.connection
		.once('open', () => {
			console.log(`YM Node School APP connected to DB successfully. ADDR= ${MONGO}`)
			logger.info(`YM Node School APP connectsed to DB successfully. ADDR= ${MONGO}`);

			http.createServer(app.callback()).listen(PORT, notifyStarting(PORT));
		})
		.once('error', error => {
			console.error('Mongo Error: ', error);
			logger.error('Mongo error: ', error);
		});
} else
	module.exports = http.createServer(app.callback()).listen(PORT);
