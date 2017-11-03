import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'emotion/react';

import { changeActiveCard, deleteCard, addCard } from '../../actions/cards';
import { getPreparedCards } from '../../selectors/cards';

import Card from './card';
import CardDelete from './card_delete';
import CardAdd from './card_add';

const Layout = styled.div`
width: 310px;
display: flex;
flex-direction: column;
position: relative;
background-color: #242424;
padding: 20px;
`;

const Logo = styled.div`
width: 147px;
height: 28px;
margin-bottom: 55px;
background-image: url('/assets/yamoney-logo.svg');
`;

const Edit = styled.div`
  position: absolute;
  top: 17px;
  right: 12px;
  width: 34px;
  height: 35px;
  cursor: pointer;
  background-image: url('/assets/${({editable}) => editable ? 'cards-edit-active' : 'cards-edit'}.svg');
  background-repeat: no-repeat;
  background-position: center center;
`;

const CardsList = styled.div`
  flex: 1;
  font-size: 15px;
`;

const Footer = styled.footer`
color: rgba(255, 255, 255, 0.2);
font-size: 15px;
`;

class CardsBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      removeCardId: 0,
      isCardRemoving: false,
      isCardsEditable: false,
      isCardAdding: false
    }
  }

  /**
	* Обработчик события редактирования карт
	* @param {Boolean} isEditable Признак редактируемости
	*/
  onEditChange = isEditable => {
    const isCardsEditable = !isEditable;
    this.setState({
      isCardsEditable,
      isCardRemoving: false
    });
  }

  onSetDeleteMode = (event, removeCardId) => {
    event.stopPropagation();
    this.setState({
      isCardRemoving: true,
      removeCardId
    });
  }

  onSetAddMode = event => {
    event.stopPropagation();
    this.setState({
      isCardAdding: true
    });
  }

  onCancelMode = () => {
    this.setState({
      isCardRemoving: false,
      isCardsEditable: false,
      isCardAdding: false
    });
  }

  onDeleteClickWrapper = id => {
    this.setState({
      isCardRemoving: false,
      removeCardId: 0,
      isCardsEditable: false
    });
    this.props.onDeleteClick(id);
  }

  onAddClickWrapper = (cardNumber, currency, exp, name) => {
    this.setState({
      isCardAdding: false
    });
    this.props.onAddClick(cardNumber, currency, exp, name);
  }

  renderCards = () => {
    const {isLoading, cards, activeCardId, onClick} = this.props;

    return isLoading ? (<div/>)
      : (cards.map(card => (
        <Card key={ card.id } data={ card } active={ card.id === activeCardId } onClick={ () => onClick(card.id) } onChangeDeleteMode={ (e, id) => this.onSetDeleteMode(e, id) } isCardsEditable={ this.state.isCardsEditable }
        />
      )))
  };

  render = () => {
    const {isCardsEditable, isCardRemoving, isCardAdding, removeCardId} = this.state;
    const {isLoading, cards, isAuth} = this.props;

    if (!isAuth)
      return (
        <Layout>
          <Logo />
        </Layout>);

    if (isCardRemoving)
      return (
        <Layout>
          <Logo />
          <CardDelete onCancelClick={ () => this.onCancelMode() } deleteCard={ id => this.onDeleteClickWrapper(id) } data={ cards.filter((item) => item.id === removeCardId)[0] } />
          <Footer>Yamoney Node School</Footer>
        </Layout>);

    if (isCardAdding)
      return (
        <Layout>
          <Logo />
          <CardAdd onCancelClick={ () => this.onCancelMode() } addCard={ (cardNumber, currency, exp, name) => this.onAddClickWrapper(cardNumber, currency, exp, name) } />
          <Footer>Yamoney Node School</Footer>
        </Layout>);

    return (
      <Layout>
        <Logo />
        <Edit onClick={ () => this.onEditChange(isCardsEditable) } editable={ isCardsEditable } />
        <CardsList>
          { this.renderCards() }
          { isLoading ? <div/> : <Card type='new' onChangeAddMode={ (e) => this.onSetAddMode(e) } /> }
        </CardsList>
        <Footer>Yamoney Node School</Footer>
      </Layout>
    )
  }
}

CardsBar.propTypes = {
  cards: PropTypes.array.isRequired,
  activeCardId: PropTypes.string,
  error: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  cards: getPreparedCards(state),
  error: state.cards.error,
  activeCardId: state.cards.activeCardId,
  isLoading: state.cards.isLoading,
  isAuth: state.auth.isAuth
});

const mapDispatchToProps = dispatch => ({
  onClick: id => dispatch(changeActiveCard(id)),
  onDeleteClick: id => dispatch(deleteCard(id)),
  onAddClick: (cardNumber, currency, exp, name) => dispatch(addCard(cardNumber, currency, exp, name))
});

export default connect(mapStateToProps, mapDispatchToProps)(CardsBar);
