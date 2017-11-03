import * as actions from '../actions/types';

const mobilePaymentReducerInitialState = {
    stage: 'contract',
    transaction: null,
    error: null
};

const mobilePaymentReducer = (state = mobilePaymentReducerInitialState, {type, payload}) => {
    switch (type) {
        case actions.MOBILE_PAY_REPEAT:
            return mobilePaymentReducerInitialState
        case actions.MOBILE_PAY_SUCCESS:
            return {
                ...state,
                stage: 'success',
                transaction: payload,
                error: null
            }
        case actions.MOBILE_PAY_FAILED:
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

export default mobilePaymentReducer;
