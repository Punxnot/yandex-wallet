import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';

import Card from '../../cards/card';
import Island from '../../misc/island';
import Title from '../../misc/title';
import Button from '../../misc/button';
import Input from '../../misc/input';

import { convertCurrency } from '../../../selectors/currency';

const WithdrawTitle = styled(Title)`
	text-align: center;
`;

const WithdrawLayout = styled(Island)`
	margin: 0px;
	width: 440px;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-sizing: border-box;
`;

const InputField = styled.div`
	margin: 20px 0;
	position: relative;
`;

const SumInput = styled(Input)`
	max-width: 200px;
	padding-right: 20px;
	background-color: rgba(0, 0, 0, 0.08);
	color: '#000';
`;

const Currency = styled.span`
	font-size: 12px;
	position: absolute;
	right: 10;
	top: 8px;
`;

/**
 * Класс компонента Withdraw
 */
class WithdrawContract extends Component {
	/**
	 * Конструктор
	 * @param {Object} props свойства компонента Withdraw
	 */
	constructor(props) {
		super(props);

		this.state = {
			withdrawCardIndex: 0,
			sumFrom: 0,
			sumTo: 0,
		};
	}
  
  componentWillUpdate(nextProps) {
    const isNewCard = nextProps.activeCard.id !== this.props.activeCard.id;
    const areNewCurrencies = nextProps.currencyState.timestamp !== this.props.currencyState.timestamp;
    if (isNewCard || areNewCurrencies) {
    	const sumTo = convertCurrency({
				currencyState: nextProps.currencyState,
				sum: this.state.sumFrom,
				convertFrom: nextProps.activeCard.currency,
				convertTo: nextProps.inactiveCardsList[this.state.withdrawCardIndex].currency,
      });
    	
    	this.setState({ sumTo });
    }
  }

	/**
	 * Обработчик переключения карты
	 *
	 * @param {Number} withdrawCardIndex индекс выбранной карты
	 */
	onCardChange(withdrawCardIndex) {
    const sumTo = convertCurrency({
      currencyState: this.props.currencyState,
      sum: this.state.sumFrom,
      convertFrom: this.props.activeCard.currency,
      convertTo: this.props.inactiveCardsList[withdrawCardIndex].currency,
    });
    
		this.setState({
			withdrawCardIndex,
			sumTo,
		});
	}

	/**
	 * Обработка изменения значения в input
	 * @param {Event} event событие изменения значения input
	 */
	onChangeInputValue(event) {
		if (!event) return;
		
		const {name, value} = event.target;
		const { currencyState, activeCard, inactiveCardsList } = this.props;
		const { withdrawCardIndex } = this.state;
		const withdrawCard = inactiveCardsList[withdrawCardIndex];
		
		let otherName, otherValue, convertFrom, convertTo;
		
		if (name === 'sumFrom') {
			otherName = 'sumTo';
			convertFrom = activeCard.currency;
			convertTo = withdrawCard.currency;
		} else {
			otherName = 'sumFrom';
			convertFrom = withdrawCard.currency;
			convertTo = activeCard.currency;
		}
		
		otherValue = convertCurrency({ currencyState, sum: value, convertFrom, convertTo });
		
		if (isNaN(otherValue)) otherValue = '?';

		this.setState({
			[name]: value,
			[otherName]: otherValue,
		});
	}

	/**
	 * Отправка формы
	 * @param {Event} event событие отправки формы
	 */
	onSubmitForm(event) {
		if (event) event.preventDefault();
		
		const { activeCard, inactiveCardsList, onPaymentSubmit } = this.props;
		const { sumFrom, sumTo, withdrawCardIndex } = this.state;

		const isNumberFrom = !isNaN(parseFloat(sumFrom)) && isFinite(sumFrom);
		const isNumberTo = !isNaN(parseFloat(sumTo)) && isFinite(sumTo);
		if (!isNumberFrom || sumFrom <= 0 || !isNumberTo) return;

		const withdrawCard = inactiveCardsList[withdrawCardIndex];
		
		onPaymentSubmit(
			{
				sum: sumFrom,
				to: withdrawCard.cardNumber
			},
			activeCard.id,
			withdrawCard.id,
		);

		this.setState({sumFrom: 0, sumTo: 0});
	}

	/**
	 * Функция отрисовки компонента
	 * @returns {JSX}
	 */
	render() {
		const { inactiveCardsList, activeCard } = this.props;

		if (inactiveCardsList.length === 0) return (<div></div>);
    
    const { sumFrom, sumTo, withdrawCardIndex } = this.state;
    const withdrawCard = inactiveCardsList[withdrawCardIndex];

		return (
			<WithdrawLayout>
				<form onSubmit={event => this.onSubmitForm(event)}>
					<WithdrawTitle>Вывести деньги на карту</WithdrawTitle>
					<Card
						type='select' 
						data={inactiveCardsList}
						activeCardIndex={withdrawCardIndex}
						onCardChange={id => this.onCardChange(id)} />
					<InputField>
						<SumInput
							name='sumFrom'
							value={sumFrom}
							onChange={event => this.onChangeInputValue(event)}
						/>
						<Currency>{activeCard.currencySign}</Currency>
					</InputField>
					{
						(activeCard.currencySign !== withdrawCard.currencySign) &&
						<InputField>
							<SumInput
								name='sumTo'
								value={sumTo}
								onChange={event => this.onChangeInputValue(event)}
							/>
							<Currency>{withdrawCard.currencySign}</Currency>
						</InputField>
          }
					<Button type='submit'>Перевести</Button>
				</form>
			</WithdrawLayout>
		);
	}
}

WithdrawContract.propTypes = {
  activeCard: PropTypes.object,
	currencyState: PropTypes.object,
	inactiveCardsList: PropTypes.arrayOf(PropTypes.object),
  onPaymentSubmit: PropTypes.func.isRequired,
}

export default WithdrawContract;
