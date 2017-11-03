const axios = require('axios');
const logger = require('../libs/logger')('currency-service');

let currencyState = {
  timestamp: null,
  RUB: null,
  USD: null,
  EUR: null,
};

const getCurrencies = () => {
  return currencyState;
};

const convert = ({ sum, convertFrom, convertTo }) => {
  if (convertFrom === convertTo) return sum;
  const rateFrom = currencyState[convertFrom];
  const rateTo = currencyState[convertTo];
  if (rateFrom === null || rateTo === null) return false;
  const convertedSum = rateFrom * sum / rateTo;
  return Number(convertedSum.toFixed(4));
};

const receiveCurrencies = async () => {
  for (let receiver of receivers) {
    currencyState = await receiver();
    if (currencyState) return;
  }
};

const receivers = [
  
  // async () => {
  //   const url = 'https://query.yahooapis.com/v1/public/yql/wallet-app/currencies?format=json&env=store://datatables.org/alltableswithkeys';
  //   try {
  //     const { data } = await axios.get(url);
  //     const { created, results } = data.query;
  //
  //     const [USD, EUR] = ['USD', 'EUR']
  //     .map(val => results.rate.find(obj => obj.id === `${val}RUB`))
  //     .map(obj => Number(obj.Rate));
  //
  //     const state = {
  //       timestamp: new Date(created).getTime(),
  //       RUB: 1,
  //       USD,
  //       EUR,
  //     };
  //
  //     logger.info('Received currencies from yahoo');
  //
  //     return state;
  //   } catch (err) {
  //     logger.error(`Can not receive yahoo currencies: ${err.message}`);
  //   }
  // },
  //
  // async () => {
  //   const url = 'http://api.fixer.io/latest?symbols=USD,EUR&base=RUB';
  //   try {
  //     const { data } = await axios.get(url);
  //
  //     const state = {
  //       timestamp: new Date(data.date).getTime(),
  //       RUB: 1,
  //       USD: Number((1 / data.rates.USD).toFixed(4)),
  //       EUR: Number((1 / data.rates.EUR).toFixed(4)),
  //     };
  //
  //     logger.info('Received currencies from fixer');
  //
  //     return state;
  //   } catch (err) {
  //     logger.error(`Can not receive fixer currencies: ${err.message}`);
  //   }
  // },
  
  async () => {
    const state = {
      timestamp: new Date().getTime(),
      RUB: 1,
      USD: Number((60 + Math.random()).toFixed(4)),
      EUR: Number((70 + Math.random()).toFixed(4)),
    };
    
    logger.info('Received fake currencies');
    
    return state;
  },

];

receiveCurrencies();

setInterval(() => receiveCurrencies(), 1000 * 15);

module.exports = {
  getCurrencies,
  convert,
};
