import * as actions from '../actions/types';

const prepaidPaymentReducerInitialState = {
    stage: 'contract',
    transaction: null,
    error: null
};

const prepaidPaymentReducer = (state = prepaidPaymentReducerInitialState, {type, payload}) => {
    switch (type) {
        case actions.PREPAID_PAY_REPEAT:
            return prepaidPaymentReducerInitialState

        case actions.PREPAID_PAY_SUCCESS:
            return {
                ...state,
                stage: 'success',
                transaction: payload,
                error: null
            }

        case actions.PREPAID_PAY_FAILED:
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

export default prepaidPaymentReducer;
