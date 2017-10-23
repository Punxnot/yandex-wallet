import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';

import Card from '../../cards/card';
import Island from '../../misc/island';
import Title from '../../misc/title';
import Button from '../../misc/button';
import Input from '../../misc/input';

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
			activeCardIndex: 0,
			sum: 0
		};
	}

	/**
	 * Обработчик переключения карты
	 *
	 * @param {Number} activeCardId индекс выбранной карты
	 */
	onCardChange(activeCardIndex) {
		this.setState({activeCardIndex});
	}

	/**
	 * Обработка изменения значения в input
	 * @param {Event} event событие изменения значения input
	 */
	onChangeInputValue(event) {
		if (!event) return;
		
		const {name, value} = event.target;

		this.setState({
			[name]: value
		});
	}

	/**
	 * Отправка формы
	 * @param {Event} event событие отправки формы
	 */
	onSubmitForm(event) {
		if (event) event.preventDefault();

		const {sum} = this.state;

		const isNumber = !isNaN(parseFloat(sum)) && isFinite(sum);
		if (!isNumber || sum <= 0) return;

		const toCard = this.props.inactiveCardsList[this.state.activeCardIndex];
		
		this.props.onPaymentSubmit({
			sum,
			to: toCard.cardNumber
		}, this.props.activeCardId, toCard.id);

		this.setState({sum: 0});
	}

	/**
	 * Функция отрисовки компонента
	 * @returns {JSX}
	 */
	render() {
		const {inactiveCardsList} = this.props;

		if (inactiveCardsList.length === 0) return (<div></div>);

		return (
			<WithdrawLayout>
				<form onSubmit={event => this.onSubmitForm(event)}>
					<WithdrawTitle>Вывести деньги на карту</WithdrawTitle>
					<Card
						type='select' 
						data={inactiveCardsList}
						activeCardIndex={this.state.activeCardIndex} 
						onCardChange={id => this.onCardChange(id)} />
					<InputField>
						<SumInput
							name='sum'
							value={this.state.sum}
							onChange={event => this.onChangeInputValue(event)} />
						<Currency>₽</Currency>
					</InputField>
					<Button type='submit'>Перевести</Button>
				</form>
			</WithdrawLayout>
		);
	}
}

WithdrawContract.propTypes = {
	activeCardId: PropTypes.string,
	inactiveCardsList: PropTypes.arrayOf(PropTypes.object)
}

export default WithdrawContract;
