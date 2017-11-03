const mongoose = require('mongoose');
const bankUtils = require('../libs/utils');
const uniqueValidator = require('mongoose-unique-validator');

const User = require('./user');

const Schema = mongoose.Schema;

const cardSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'userId is required'],
        index: true,
        validate: {
            validator: async value => {
                const card = await User.findById(value);
                return card;
            },
            message: 'user not found'
        }
    },
    cardNumber: {
        type: String,
        required: [true, 'cardNumber is required'],
        index: true,
        unique: [true, 'non doublicated cardNumber required'],
        validate: {
            validator: value => bankUtils.getCardType(value) !== '' && bankUtils.moonCheck(value),
            message: 'valid cardNumber required'
        }
    },
    currency: {
        type: String,
        required: [true, 'currency is required'],
        enum: {
            values: ['RUB', 'USD', 'EUR'],
            message: 'valid currency is required',
        },
    },
    balance: {
        type: Number,
        required: [true, 'balance is required'],
        validate: {
            validator: balance => balance >= 0 && !isNaN(balance),
            message: 'balance must be greater then 0 and must be a number'
        }
    },
    exp: {
        type: String,
        required: [true, 'exp date is required'],
        uppercase: true,
        match: [new RegExp('^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$'), 'exp must be 10/17 pattern match'],
        validate: {
            validator: value => {
                // проверяем срок действия карты
                const date = new Date();
                const currentYear = date.getFullYear();
                const currentMonth = date.getMonth() + 1;
                const parts = value.split('/');
                const year = parseInt(parts[1], 10) + 2000;
                const month = parseInt(parts[0], 10);

                return year < currentYear || (year === currentYear && month < currentMonth) ? false : true;
            },
            message: 'non expired card required'
        }
    },
    name: {
        type: String,
        required: [true, 'name is required'],
        uppercase: true,
        validate: {
            validator: value => {
                const [name, surname] = value.split(' ');
                return name.length > 1 && surname.length > 1
            },
            message: 'name must contains two words'
        }
    },
}, {
    toObject: {
        transform: (doc, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    }
});

cardSchema.plugin(uniqueValidator);

module.exports = mongoose.model('card', cardSchema);
