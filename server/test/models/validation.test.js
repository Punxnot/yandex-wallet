const assert = require('assert');
const Card = require('../../models/card');
const Transaction = require('../../models/transaction');
const User = require('../../models/user');

describe('Card model validation tests', () => {
    it('it should get errors with messages about requeries fields', done => {
        const card = new Card({});

        card.validate(validationResult => {
            const {message} = validationResult;

            assert(message === "card validation failed: name: name is required, exp: exp date is required, balance: balance is required, currency: currency is required, cardNumber: cardNumber is required, userId: userId is required");
            done();
        });
    });

    it('it should get errors with messages about invalid fields', done => {
        const card = new Card({
            cardNumber: '15133306216010173046',
            balance: -1,
            exp: '04/17',
            name: 'ALYSSALIVINGSTON',
            userId: 'jdjdkdk22'
        });

        card.validate(validationResult => {
            const {balance, currency, cardNumber, exp, name, userId} = validationResult.errors;

            assert(balance.message === 'balance must be greater then 0 and must be a number');
            assert(currency.message === 'currency is required');
            assert(cardNumber.message === 'valid cardNumber required');
            assert(exp.message === 'non expired card required');
            assert(name.message === 'name must contains two words');
            assert(userId.message === 'Cast to ObjectID failed for value "jdjdkdk22" at path "userId"');

            done();
        });
    });

    it('it should get errors with messages about invalid fields 2', done => {
        const card = new Card({
            cardNumber: '5483874041820682',
            currency: 'JPY',
            balance: '-1',
            exp: '04/ss17',
            name: 'A A',
            userId: '59f299a4d611ad01d0115b09'
        });

        card.validate(validationResult => {
            const {balance, currency, exp, name} = validationResult.errors;

            assert(balance.message === 'balance must be greater then 0 and must be a number');
            assert(currency.message === 'valid currency is required');
            assert(exp.message === 'exp must be 10/17 pattern match');
            assert(name.message === 'name must contains two words');

            done();
        });
    });

    it('it should get errors with messages about doublicated cardNumber', done => {
        const card = new Card({
            cardNumber: '5469259469067206',
            currency: 'USD',
            balance: 10,
            exp: '12/18',
            name: 'AM AM',
            userId: '59f299a4d611ad01d0115b09'
        });

        card.validate(validationResult => {
            assert(validationResult.message === 'card validation failed: cardNumber: Error, expected `cardNumber` to be unique. Value: `5469259469067206`');

            done();
        });
    });

    it('it should get error about userId', done => {
        const card = new Card({
            cardNumber: '5483874041820682',
            currency: 'RUB',
            balance: 10,
            exp: '10/20',
            name: 'AM AM',
            userId: '59f299a4d611ad01d0115b03'
        });

        card.validate(validationResult => {
            assert(validationResult.message === 'card validation failed: userId: user not found');

            done();
        });
    });

    it('it should pass the verification', done => {
        const card = new Card({
            cardNumber: '5483874041820682',
            currency: 'EUR',
            balance: 10,
            exp: '10/20',
            name: 'AM AM',
            userId: '59f299a4d611ad01d0115b09'
        });

        card.validate(validationResult => {
            assert.strictEqual(validationResult, null);

            done();
        });
    });
});

describe('Transaction model validation tests', () => {
    it('it should get errors with messages about requeries fields', done => {
        const transaction = new Transaction({});

        transaction.validate(validationResult => {
            const {message} = validationResult;

            assert(message === 'transaction validation failed: sum: sum of transaction is required, data: data for transaction is required, type: type of transaction is required, cardId: cardId is required');
            done();
        });
    });

    it('it should get errors with messages about invalid fields', done => {
        const transaction = new Transaction({
            cardId: '59c784e',
            type: 'prepaidCard2ee',
            data: 'yandex money 33222335',
            sum: 'a'
        });

        transaction.validate(validationResult => {
            const {cardId, sum, type} = validationResult.errors;

            assert(cardId.message === 'Cast to ObjectID failed for value "59c784e" at path "cardId"');
            assert(sum.message === 'Cast to Number failed for value "a" at path "sum"');
            assert(type.message === '`prepaidCard2ee` is not a valid enum value for path `type`.');

            done();
        });
    });

    it('it should get errors with messages about not founded card', done => {
        const transaction = new Transaction({
            cardId: '59e9ce16131a183238cc7860',
            type: 'prepaidCard',
            data: 'yandex money 33222335',
            sum: 10
        });

        transaction.validate(validationResult => {
            const {cardId} = validationResult.errors;

            assert(cardId.message === 'card with this id not found');

            done();
        });
    });

    it('it should get errors with messages about not founded card in card2card transaction', done => {
        const transaction = new Transaction({
            cardId: '59e9ce16131a183238cc784e',
            type: 'card2Card',
            data: '59e9ce16131a183238cc7844',
            sum: -10
        });

        transaction.validate(validationResult => {
            assert(validationResult.message === 'transaction validation failed: type: receiver card not found');

            done();
        });
    });

    it('it should get errors with messages about invalid sum of the transaction', done => {
        const transaction = new Transaction({
            cardId: '59e9ce16131a183238cc784e',
            type: 'paymentMobile',
            data: '89214445599',
            sum: 10
        });

        transaction.validate(validationResult => {
            assert(validationResult.message === 'transaction validation failed: sum: invalid transaction sum');

            done();
        });
    });

    it('it should get errors with messages about invalid balance on the card', done => {
        const transaction = new Transaction({
            cardId: '59e9ce16131a183238cc784e',
            type: 'paymentMobile',
            data: '89214445599',
            sum: -16000
        });

        transaction.validate(validationResult => {
            assert(validationResult.message === 'transaction validation failed: sum: invalid transaction sum');

            done();
        });
    });
});

describe('User model validation tests', () => {
    it('it should get errors with messages about requeries fields', done => {
        const user = new User({});

        user.validate(validationResult => {
            const {message} = validationResult;

            assert(message === 'users validation failed: password: password is required, email: email is required');
            done();
        });
    });

    it('it should get errors with messages about email field', done => {
        const user = new User({
            email: 'test',
            password: ''
        });

        user.validate(validationResult => {
            const {message} = validationResult;

            assert(message === 'users validation failed: password: password is required, email: valid email address is requered');
            done();
        });
    });

    it('it should get errors with messages about password field', done => {
        const user = new User({
            email: 'test@test.ru',
            password: '123'
        });

        user.validate(validationResult => {
            const {message} = validationResult;

            assert(message === 'users validation failed: password: valid password field is required');
            done();
        });
    });

    it('it should not get errors with messages', done => {
        const user = new User({
            email: 'test@test.ru',
            password: 'jjsKKskjdkK45&'
        });

        user.validate(validationResult => {
            assert.equal(validationResult, null);
            done();
        });
    });
});
