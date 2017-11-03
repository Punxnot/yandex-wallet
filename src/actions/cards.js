import * as action from './types';
import { signOutUser } from './auth';
import { fetchTransactions } from './transactions';

import axios from 'axios';

const ROOT_URL = '/api';

/**
* Добавляет новую карту пользователю
* 
*/
export const addCard = (cardNumber, currency, exp, name) => {
    return async dispatch => {
        try {
            dispatch({
                type: action.CARD_ADD_STARTED
            });

            const data = {
                cardNumber,
                currency,
                exp,
                name
            };

            const response = await axios
                .post(`${ROOT_URL}/cards`, data, {
                    headers: {
                        authorization: 'JWT ' + localStorage.getItem('token')
                    }
                });

            if (response.status === 201) {
                dispatch({
                    type: action.CARD_ADD_SUCCESS
                });
                dispatch(fetchCards());
            }
            else dispatch({
                    type: action.CARD_ADD_FAILED,
                    payload: 'Что то пошло не так...'
                });
        } catch (err) {
            if (err.response.status === 401)
                dispatch(signOutUser('Ошибка авторизации'));

            dispatch({
                type: action.CARD_ADD_FAILED,
                payload: err.response.data.message ? err.response.data.message : err.response.data
            });
            console.log(err.response.data.message ? err.response.data.message : err.response.data);
        }
    }
}

/**
* Вытаскивает данные по картам пользователя
* 
*/
export const fetchCards = () => {
    return async dispatch => {
        try {
            dispatch({
                type: action.CARDS_FETCH_STARTED
            });

            const response = await axios
                .get(`${ROOT_URL}/cards`, {
                    headers: {
                        authorization: 'JWT ' + localStorage.getItem('token')
                    }
                });

            dispatch({
                type: action.CARDS_FETCH_SUCCESS,
                payload: response.data
            });

            if (response.data.length > 0)
                if (response.data[0].id)
                    dispatch(changeActiveCard(response.data[0].id));

        } catch (err) {
            if (err.response.status === 401)
                dispatch(signOutUser('Ошибка авторизации'));

            dispatch({
                type: action.CARDS_FETCH_FAILED,
                payload: err.response.data.message ? err.response.data.message : err.response.data
            });
            console.log(err.response.data.message ? err.response.data.message : err.response.data);
        }
    }
}

/**
* Вытаскивает данные по карте пользователя
* 
* @param {Number} id 
*/
export const fetchCard = id => {
    return async dispatch => {
        try {
            const response = await axios
                .get(`${ROOT_URL}/cards/${id}`, {
                    headers: {
                        authorization: 'JWT ' + localStorage.getItem('token')
                    }
                });

            dispatch({
                type: action.CARD_FETCH_SUCCESS,
                payload: response.data
            });
        } catch (err) {
            if (err.response.status === 401)
                dispatch(signOutUser('Ошибка авторизации'));

            dispatch({
                type: action.CARD_FETCH_FAILED,
                payload: err.response.data.message ? err.response.data.message : err.response.data
            });
            console.log(err.response.data.message ? err.response.data.message : err.response.data);
        }
    }
}

/**
* Удаляет карту пользователя
* 
* @param {Number} id 
* @returns 
*/
export const deleteCard = id => {
    return async dispatch => {
        try {
            dispatch({
                type: action.CARD_DELETE_STARTED
            });

            const response = await axios
                .delete(`${ROOT_URL}/cards/${id}`, {
                    headers: {
                        authorization: 'JWT ' + localStorage.getItem('token')
                    }
                });

            if (response.status === 200) {
                dispatch({
                    type: action.CARD_DELETE_SUCCESS
                });
                dispatch(fetchCards());
            }
            else dispatch({
                    type: action.CARD_DELETE_FAILED,
                    payload: 'Что то пошло не так...'
                });
        } catch (err) {
            if (err.response.status === 401)
                dispatch(signOutUser('Ошибка авторизации'));

            dispatch({
                type: action.CARD_DELETE_FAILED,
                payload: err.response.data.message ? err.response.data.message : err.response.data
            });
            console.log(err.response.data.message ? err.response.data.message : err.response.data);
        }
    }
}

export const changeActiveCard = id => (dispatch, getState) => {
    const {activeCardId} = getState().cards;

    if (activeCardId === id) return;

    dispatch({
        type: action.ACTIVE_CARD_CHANGED,
        payload: id
    });
    dispatch(fetchTransactions(id));
}
