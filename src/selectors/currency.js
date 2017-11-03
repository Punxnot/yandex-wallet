/**
 * Converts sum between currencies
 * @param {{currencyState: Object, sum: Number, convertFrom: String, convertTo: String, roundPositions: Number}]
 * @returns {Number|String}
 */
export const convertCurrency = ({ currencyState, sum, convertFrom, convertTo, roundPositions }) => {
  if (convertFrom === convertTo) return sum;
  const rateFrom = currencyState[convertFrom];
  const rateTo = currencyState[convertTo];
  if (rateFrom === null || rateTo === null) return '?';
  const convertedSum = rateFrom * sum / rateTo;
  return Number(convertedSum.toFixed(roundPositions || 4));
};