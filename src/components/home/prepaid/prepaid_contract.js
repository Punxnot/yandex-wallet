import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';

import Island from '../../misc/island';
import Title from '../../misc/title';
import Button from '../../misc/button';
import Input from '../../misc/input';

import { convertCurrency } from '../../../selectors/currency';

const PrepaidLayout = styled(Island)`
	width: 350px;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #353536;
	box-sizing: border-box;
`;

const PrepaidTitle = styled(Title)`
	color: #fff;
`;

const PrepaidItems = styled.div`
	width: 285px;
	margin-bottom: 40px;
`;

const PrepaidItem = styled.div`
	height: 65px;
	display: flex;
	align-items: center;
	border-radius: 3px;
	cursor: pointer;
	background-color: ${({selected, bgColor}) => selected ? bgColor : 'rgba(0, 0, 0, 0.05)'};
`;

const PrepaidItemIcon = styled.div`
	width: 42px;
	height: 42px;
	margin: 18px;
	border-radius: 21px;
	background-image: url(${({bankSmLogoUrl}) => bankSmLogoUrl});
	background-size: contain;
	background-repeat: no-repeat;
	filter: ${({selected}) => selected ? 'none' : 'grayscale(100%)'};
`;

const PrepaidItemTitle = styled.div`
	font-size: 13px;
	color: ${({selected, textColor}) => selected ? textColor : 'rgba(255, 255, 255, 0.6)'};
`;

const PrepaidItemDescription = styled.div`
	color: ${({selected, textColor}) => selected ? textColor : 'rgba(255, 255, 255, 0.4)'};
`;

const PrepaidItemCurrency = styled.div`
  font-size: 16px;
  font-family: 'OCR A Std Regular';
  color: #fff;
  margin-left: 20px;
`;

const InputField = styled.div`
	margin: 20px 0;
	position: relative;
`;

const SumInput = styled(Input)`
	max-width: 200px;
	padding-right: 20px;
	background-color: rgba(0, 0, 0, 0.08);
	color: #fff;
`;

const Currency = styled.span`
	font-size: 12px;
	position: absolute;
	right: 10;
	top: 8px;
	color: #fff;
`;

/**
 * Класс компонента PrepaidContract
 */
class PrepaidContract extends Component {
	/**
	 * Конструктор
	 * @param {Object} props свойства компонента PrepaidContract
	 */
	constructor(props) {
		super(props);

		this.state = {
			prepaidCardIndex: 0,
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
        convertFrom: nextProps.inactiveCardsList[this.state.prepaidCardIndex].currency,
        convertTo: nextProps.activeCard.currency,
      });
      
      this.setState({ sumTo });
    }
  }
  
  /**
   * Обработчик переключения карты
   *
   * @param {Number} prepaidCardIndex индекс выбранной карты
   */
  onCardChange(prepaidCardIndex) {
    const sumTo = convertCurrency({
      currencyState: this.props.currencyState,
      sum: this.state.sumFrom,
      convertFrom: this.props.inactiveCardsList[prepaidCardIndex].currency,
      convertTo: this.props.activeCard.currency,
    });
    
    this.setState({
      prepaidCardIndex,
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
    const { prepaidCardIndex } = this.state;
    const prepaidCard = inactiveCardsList[prepaidCardIndex];
    
    let otherName, otherValue, convertFrom, convertTo;
    
    if (name === 'sumFrom') {
      otherName = 'sumTo';
      convertFrom = prepaidCard.currency;
      convertTo = activeCard.currency;
    } else {
      otherName = 'sumFrom';
      convertFrom = activeCard.currency;
      convertTo = prepaidCard.currency;
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
    const { sumFrom, sumTo, prepaidCardIndex } = this.state;
    
    const isNumberFrom = !isNaN(parseFloat(sumFrom)) && isFinite(sumFrom);
    const isNumberTo = !isNaN(parseFloat(sumTo)) && isFinite(sumTo);
    if (!isNumberFrom || sumFrom <= 0 || !isNumberTo) return;
    
    const prepaidCard = inactiveCardsList[prepaidCardIndex];
		
		onPaymentSubmit(
			{
				sum: sumFrom,
				to: activeCard.cardNumber,
				from: prepaidCard.number,
        currency: prepaidCard.currency,
			},
			prepaidCard.id,
			activeCard.id,
		);
    
    this.setState({sumFrom: 0, sumTo: 0});
	}

	/**
	 *
	 * @returns {XML}
	 */
	render() {
		const { inactiveCardsList, activeCard } = this.props;

		if (inactiveCardsList.length === 0) return (<div></div>);

		const { sumFrom, sumTo, prepaidCardIndex } = this.state;
		const prepaidCard = inactiveCardsList[prepaidCardIndex];

		return (
				<PrepaidLayout><form onSubmit={(event) => this.onSubmitForm(event)}>
					<PrepaidTitle>Пополнить карту</PrepaidTitle>

					<PrepaidItems>
						{
							inactiveCardsList.map((card, index) => (
								<PrepaidItem
									bgColor={card.theme.bgColor}
									key={card.id}
									onClick={() => this.onCardChange(index)}
									selected={prepaidCardIndex === index}>
									<PrepaidItemIcon
										bankSmLogoUrl={card.theme.bankSmLogoUrl}
										selected={prepaidCardIndex === index} />
									<PrepaidItemTitle
										textColor={card.theme.textColor}
										selected={prepaidCardIndex === index}>
										C банковской карты
										<PrepaidItemDescription
											textColor={card.theme.textColor}
											selected={prepaidCardIndex === index}>
											{card.number}
										</PrepaidItemDescription>
									</PrepaidItemTitle>
									<PrepaidItemCurrency>
										{card.currencySign}
									</PrepaidItemCurrency>
								</PrepaidItem>
							))
						}
					</PrepaidItems>

					<InputField>
						<SumInput
							name='sumFrom'
							value={sumFrom}
							onChange={(event) => this.onChangeInputValue(event)} />
						<Currency>{prepaidCard.currencySign}</Currency>
					</InputField>
          {
            (activeCard.currencySign !== prepaidCard.currencySign) &&
						<InputField>
							<SumInput
								name='sumTo'
								value={sumTo}
								onChange={event => this.onChangeInputValue(event)}
							/>
							<Currency>{activeCard.currencySign}</Currency>
						</InputField>
          }
					<Button
						type='submit'
						bgColor={prepaidCard.theme.bgColor}
						textColor={prepaidCard.theme.textColor}>
						Пополнить
					</Button></form>
				</PrepaidLayout>
		);
	}
}

PrepaidContract.propTypes = {
	activeCard: PropTypes.shape({
		id: PropTypes.string,
		theme: PropTypes.object
	}),
	currencyState: PropTypes.object,
	inactiveCardsList: PropTypes.arrayOf(PropTypes.object),
	onPaymentSubmit: PropTypes.func.isRequired
};

export default PrepaidContract;
