import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import Card from './card';
import Button from '../misc/button';
import CardInfo from 'card-info';

const CardAddLayout = styled.div`
	flex: 1;
	width: 260px;
`;

const Title = styled.div`
	font-size: 20px;
	font-weight: 500;
	letter-spacing: 0.9px;
	color: #ffffff;
	margin-bottom: 10px;
`;

const LinkCardText = styled.div`
	opacity: 0.4;
	font-size: 11px;
	line-height: 2.18;
	letter-spacing: 0.5px;
	color: #ffffff;
	margin-top: 4px;
`;

const Footer = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 35px;
`;

class CardAdd extends Component {
	constructor(props) {
		super(props);

		this.state = {
			cardNumber: '5269673919202365',
			exp: '10/20'
		};

		this.onCardNumberChange = this.onCardNumberChange.bind(this);
		this.onAddClick = this.onAddClick.bind(this);
	}

	onAddClick(e) {
		const {cardNumber, exp} = this.state;

		if (cardNumber && exp)
			this.props.addCard(cardNumber, exp, 'FIRST LAST');
	}

	onCardNumberChange(e) {
		this.setState({
			cardNumber: e.target.value
		});
	}

	getDisplayValues(cardNumber, exp) {
		const {numberNice, backgroundColor, textColor, bankLogoSvg, brandLogoSvg, bankAlias} = new CardInfo(cardNumber, {
			banksLogosPath: '/assets/',
			brandsLogosPath: '/assets/'
		});

		return {
			cardNumber: numberNice,
			exp,
			theme: {
				bgColor: backgroundColor,
				textColor: textColor,
				bankLogoUrl: bankLogoSvg,
				brandLogoUrl: brandLogoSvg,
				bankSmLogoUrl: `/assets/${bankAlias}-history.svg`
			}
		}
	}

	render() {
		const {onCancelClick} = this.props;

		return (
			<CardAddLayout>
				<Title>Привязать новую карту</Title>
				<Card type='form' data={ this.getDisplayValues(this.state.cardNumber, this.state.exp) } onCardNumberChange={ this.onCardNumberChange } />
				<LinkCardText>Удалить карту можно в любой момент</LinkCardText>
				<Footer>
				<div onClick={ this.onAddClick }>
					<Button bgColor='#d3292a' textColor='#fff'>Добавить</Button>
				</div>
				<div onClick={ () => onCancelClick(true) }>
					<Button bgColor='#1F1F1F' textColor='#fff'>Вернуться</Button>
				</div>
				</Footer>
			</CardAddLayout>
			);
	}
}

CardAdd.propTypes = {
	onCancelClick: PropTypes.func.isRequired,
	addCard: PropTypes.func.isRequired
};

export default CardAdd;
