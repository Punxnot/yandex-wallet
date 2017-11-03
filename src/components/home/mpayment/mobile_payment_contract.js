import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';

import Island from '../../misc/island';
import Title from '../../misc/title';
import Button from '../../misc/button';
import Input from '../../misc/input';

import { convertCurrency } from '../../../selectors/currency';

const MobilePaymentLayout = styled(Island)`
	width: 440px;
	background: #108051;
`;

const MobilePaymentTitle = styled(Title)`
	color: #fff;
`;

const InputField = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 26px;
	position: relative;
	padding-left: 150px;
`;

const Label = styled.div`
	font-size: 15px;
	color: #fff;
	position: absolute;
	left: 0;
`;

const Currency = styled.span`
	font-size: 13px;
	color: #fff;
	margin-left: 12px;
`;

const Commission = styled.div`
	color: rgba(255, 255, 255, 0.6);
	font-size: 13px;
	text-align: right;
	margin: 35px 0 20px;
`;

const Underline = styled.div`
	height: 1px;
	margin-bottom: 20px;
	background-color: rgba(0, 0, 0, 0.16);
`;

const PaymentButton = styled(Button)`
	float: right;
`;

const InputPhoneNumber = styled(Input)`
	width: 225px;
`;

const InputSum = styled(Input)`
	width: 160px;
`;

const InputCommision = styled(Input)`
	cursor: no-drop;
	width: 160px;
	border: dotted 1.5px rgba(0, 0, 0, 0.2);
	background-color: initial;
`;

/**
 * Компонент MobilePaymentContract
 */
class MobilePaymentContract extends Component {
	/**
	 * Конструктор
	 * @param {Object} props свойства компонента MobilePaymentContract
	 */
	constructor(props) {
		super(props);
		
		const { activeCard, currencyState } = props;
		
		this.defaultRoubleComission = 3;

		this.state = {
			phoneNumber: '+79218908064',
			sum: 10,
			commission: convertCurrency({ currencyState, sum: this.defaultRoubleComission, convertFrom: 'RUB', convertTo: activeCard.currency }),
		};
	}
	
	componentWillUpdate(nextProps) {
		const isNewCurrencyCard = nextProps.activeCard.currency !== this.props.activeCard.currency;
		const areNewCurrencies = nextProps.currencyState.timestamp !== this.props.currencyState.timestamp;
		if (isNewCurrencyCard || areNewCurrencies) {
			this.setState({
        commission: convertCurrency({
					currencyState: nextProps.currencyState,
					sum: this.defaultRoubleComission,
					convertFrom: 'RUB',
					convertTo: nextProps.activeCard.currency,
        }),
			});
		}
	}

	/**
	 * Получить цену с учетом комиссии
	 * @returns {Number}
	 */
	getSumWithCommission() {
		const {sum, commission} = this.state;

		const isNumber = !isNaN(parseFloat(sum)) && isFinite(sum);
		if (!isNumber || sum <= 0) {
			return 0;
		}
		
		if (isNaN(commission)) return '?';

		return Number(sum) + Number(commission);
	}

	/**
	 * Отправка формы
	 * @param {Event} event событие отправки формы
	 */
	handleSubmit(event) {
		if (event) {
			event.preventDefault();
		}

		const {sum, phoneNumber, commission} = this.state;

		const isNumber = !isNaN(parseFloat(sum)) && isFinite(sum);
		const isCommission = !isNaN(parseFloat(commission)) && isFinite(commission);
		if (!isNumber || sum === 0 || !isCommission) {
			return;
		}

		this.props.onPaymentSubmit({
			sum: this.getSumWithCommission(),
			phoneNumber,
			commission
		}, this.props.activeCard.id);
	}

	/**
	 * Обработка изменения значения в input
	 * @param {Event} event событие изменения значения input
	 */
	handleInputChange(event) {
		if (!event)
			return;

		const {name, value} = event.target;

		this.setState({
			[name]: value
		});
	}

	/**
	 * Рендер компонента
	 *
	 * @override
	 * @returns {JSX}
	 */
	render() {
		const {commission} = this.state;
		const { currencySign } = this.props.activeCard;

		return (
			<MobilePaymentLayout>
				<form onSubmit={ (event) => this.handleSubmit(event) }>
				<MobilePaymentTitle>Пополнить телефон</MobilePaymentTitle>
				<InputField>
					<Label>Телефон</Label>
					<InputPhoneNumber name='phoneNumber' value={ this.state.phoneNumber } readOnly='true' />
				</InputField>
				<InputField>
					<Label>Сумма</Label>
					<InputSum name='sum' value={ this.state.sum } onChange={ (event) => this.handleInputChange(event) } />
					<Currency>{ currencySign }</Currency>
				</InputField>
				<InputField>
					<Label>Спишется</Label>
					<InputCommision value={ this.getSumWithCommission() } readOnly='true' />
					<Currency>{ currencySign }</Currency>
				</InputField>
				<Commission>Размер коммиссии составляет { commission } { currencySign }</Commission>
				<Underline />
				<PaymentButton bgColor='#fff' textColor='#108051'>Заплатить</PaymentButton>
				</form>
			</MobilePaymentLayout>
			);
	}
}

MobilePaymentContract.propTypes = {
	activeCard: PropTypes.object,
	currencyState: PropTypes.object,
	onPaymentSubmit: PropTypes.func.isRequired
};

export default MobilePaymentContract;
