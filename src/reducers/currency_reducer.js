import * as actions from '../actions/types';

export const currencyInitialState = {
    timestamp: null,
    RUB: null,
    USD: null,
    EUR: null,
};

const currencyReducer = (state = currencyInitialState, {type, payload}) => {
    switch (type) {
        case actions.CURRENCY_RECEIVED:
          return {
            ...state,
            ...payload,
          };
          
        default:
          return state;
    }
};

export default currencyReducer;
