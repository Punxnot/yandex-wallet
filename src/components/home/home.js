import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'emotion/react';

import History from './history';
import MobilePayment from './mpayment/mobile_payment';
import Prepaid from './prepaid/prepaid';
import Withdraw from './withdraw/withdraw';

import { fetchCurrencies } from '../../actions/currency';

import { getActiveCard } from '../../selectors/cards';
import { getTransactionsByDays } from '../../selectors/transactions';

const Workspace = styled.div`
display: flex;
flex-wrap: wrap;
max-width: 970px;
padding: 15px;
`;

class Home extends Component {
  
  componentDidMount() {
    this.props.getCurrencies();
    this.currencyInterval = setInterval(() => this.props.getCurrencies(), 1000 * 15);
  }
  
  componentWillUnmount() {
    clearInterval(this.currencyInterval);
  }
  
  render() {
    const { transactions, activeCard, transactionsIsLoading } = this.props;
    if (activeCard) return (
      <Workspace>
        <History transactions={ transactions } activeCard={ activeCard } isLoading={ transactionsIsLoading } />
        <Prepaid />
        <MobilePayment />
        <Withdraw />
      </Workspace>
    )
    else return (<Workspace/>);
  }
  
}

Home.PropTypes = {
  transactions: PropTypes.arrayOf(PropTypes.object),
  activeCard: PropTypes.object,
  transactionsIsLoading: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  transactions: getTransactionsByDays(state),
  activeCard: getActiveCard(state),
  transactionsIsLoading: state.transactions.isLoading,
});

const mapDispatchToProps = dispatch => ({
  getCurrencies: () => dispatch(fetchCurrencies()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
