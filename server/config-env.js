/*** Define CONST */
const MONGO = process.env.NODE_MONGO || 'mongodb://localhost/nodeschool';
const JWT_SECRET = process.env.NODE_JWT_SECRET || 'jjskskKKKAjajenwfpaP';
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '248027235:AAFbrU-WVBSp__tmgEoU-6nJb82LKiTbc3E';

module.exports = {
    MONGO,
    JWT_SECRET,
    TELEGRAM_TOKEN
};

