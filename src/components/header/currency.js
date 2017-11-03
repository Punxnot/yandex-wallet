import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import styled from 'emotion/react';

const CurrencyLayout = styled.div`
  display: flex;
  align-items: center;
`;

const CurrencyTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #000;
  margin-right: 30px;
`;

const Currencies = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const CurrencyItem = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const Currency = ({ currencyState }) => (
  <CurrencyLayout>
    <CurrencyTitle>Курсы валют:</CurrencyTitle>
    <Currencies>
      <CurrencyItem>{currencyState.timestamp ? moment(currencyState.timestamp).format('HH:mm:ss') : ''}</CurrencyItem>
      <CurrencyItem>$ {currencyState.USD}</CurrencyItem>
      <CurrencyItem>€ {currencyState.EUR}</CurrencyItem>
    </Currencies>
  </CurrencyLayout>
);

const mapStateToProps = state => ({
  currencyState: state.currency,
});

export default connect(mapStateToProps)(Currency);