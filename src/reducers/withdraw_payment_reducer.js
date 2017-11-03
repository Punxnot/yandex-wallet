import * as actions from '../actions/types';

const withdrawPaymentReducerInitialState = {
    stage: 'contract',
    transaction: null,
    error: null
};

const withdrawPaymentReducer = (state = withdrawPaymentReducerInitialState, {type, payload}) => {
    switch (type) {
        case actions.WITHDRAW_PAY_REPEAT:
            return withdrawPaymentReducerInitialState

        case actions.WITHDRAW_PAY_SUCCESS:
            return {
                ...state,
                stage: 'success',
                transaction: payload,
                error: null
            }

        case actions.WITHDRAW_PAY_FAILED:
            return {
                ...state,
                stage: 'error',
                transaction: payload.transaction,
                error: payload.error
            }
            
        case actions.ACTIVE_CARD_CHANGED:
            return {
              ...state,
              stage: 'contract',
              transaction: null,
              error: null,
            }
            
        default:
            return state
    }
}

export default withdrawPaymentReducer;
