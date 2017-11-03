/*** Define CONST */
const MONGO = process.env.NODE_MONGO || "mongodb://localhost/nodeschool";
const JWT_SECRET = process.env.NODE_JWT_SECRET || 'jjskskKKKAjajenwfpaP';

module.exports = {
    MONGO,
    JWT_SECRET
};

