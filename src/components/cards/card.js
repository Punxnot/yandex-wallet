import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import Select from './select';
import CardEdit from './card_edit';

const CardLayout = styled.div`
	position: relative;
	width: 270px;
	height: 164px;
	box-sizing: border-box;
	margin-bottom: ${({isSingle}) => (isSingle ? 0 : '15px')};
	padding: 25px 20px 20px 25px;
	border-radius: 4px;
	background-color: ${({bgColor, active}) => active ? bgColor : 'rgba(255, 255, 255, 0.1)'};
	cursor:${({cursor})=> cursor? cursor :'pointer'};
`;

const CardLogo = styled.div`
	height: 28px;
	margin-bottom: ${({ isTight }) => isTight ? '20px' : '25px'};
	background-image: url(${({url}) => url});
	background-size: contain;
	background-repeat: no-repeat;
	filter: ${({active}) => active ? 'none' : 'grayscale(100%) opacity(60%)'};
`;

const CardNumber = styled.div`
	margin-bottom: 20px;
	color: ${({active, textColor}) => active ? textColor : 'rgba(255, 255, 255, 0.6)'};
	font-size: 16px;
	font-family: 'OCR A Std Regular';
`;

const CardNumberInput = styled.input`
	margin-bottom: ${({ isTight }) => isTight ? '10px' : '20px'};
	color: ${({active, textColor}) => active ? textColor : 'rgba(255, 255, 255, 0.6)'};
	font-size: 16px;
	font-family: 'OCR A Std Regular';
	background: transparent;
	border: none;
`;

const CardType = styled.div`
	height: 26px;
	background-image: url(${({url}) => url});
	background-size: contain;
	background-repeat: no-repeat;
	background-position-x: right;
	opacity: ${({active}) => active ? '1' : '0.6'};

	padding-right: 60px;
	padding-top: 4px;

	color: ${({active, textColor}) => active ? textColor : 'rgba(255, 255, 255, 0.6)'};
	font-size: 16px;
	font-family: 'OCR A Std Regular';
`;

const CardCurrency = styled.div`
  display: inline-block;
  width: 105px;
  font-weight: bold;
  font-size: 16px;
  font-family: 'OCR A Std Regular';
  text-align: left !important;
  color: ${({ color }) => color ? color : 'inherit'};
`;

const NewCardLayout = styled(CardLayout)`
	background-color: transparent;
	background-image: url('/assets/cards-add.svg');
	background-repeat: no-repeat;
	background-position: center;
	box-sizing: border-box;
	border: 2px dashed rgba(255, 255, 255, 0.2);
`;

const CardSelect = styled(Select)`
	width: 100%;
	margin-bottom: 15px;
`;

const CurrencySelect = styled(Select)`
  width: 60px;
  float: left;
  margin-right: 30px;
`;

class Card extends Component {
	render() {
        const { type } = this.props;

        if (type === 'new')
			return (<NewCardLayout onClick={this.props.onChangeAddMode} />);
			
		const {data, isCardsEditable, isSingle} = this.props;

        if (type === 'select') {
			const {activeCardIndex} = this.props;
			const selectedCard = data[activeCardIndex];
			const {bgColor, bankLogoUrl, brandLogoUrl} = selectedCard.theme;

			return (
				<CardLayout active={true} bgColor={bgColor} isCardsEditable={isCardsEditable} isSingle={isSingle}>
					<CardLogo url={bankLogoUrl} active={true} />
					<CardSelect value={selectedCard.number} onChange={id => this.props.onCardChange(id)}>
						{data.map((card, index) => (
							<Select.Option key={index} value={`${index}`}>{card.number}</Select.Option>
						))}
					</CardSelect>
					<CardType url={brandLogoUrl} active={true} >
            <CardCurrency color={'#fff'}>{selectedCard.currencySign}</CardCurrency>
          </CardType>
				</CardLayout>
			);
		}

		if (type === 'form'){
			const {cardNumber, exp, currencySign, theme} = data;
			const {bgColor, textColor, bankLogoUrl, brandLogoUrl} = theme;
			const {onCardNumberChange, onCardCurrencyChange} = this.props;

			return (
				<CardLayout active={true} bgColor={bgColor} isCardsEditable={false} isSingle={true} cursor={'auto'}>
					<CardLogo url={bankLogoUrl} active={true} isTight={true} />
					<CardNumberInput textColor={textColor} active={true} value={cardNumber} onChange={onCardNumberChange} isTight={true} />
          <CurrencySelect value={currencySign} onChange={sign => onCardCurrencyChange(sign)}>
            {
              ['₽', '$', '€'].map((sign, index) => (
                <Select.Option key={index} value={sign}>{sign}</Select.Option>
              ))
            }
          </CurrencySelect>
          <CardType url={brandLogoUrl} active={true} textColor={textColor}>{exp}</CardType>
				</CardLayout>
			);
		}

		const {active, onClick, onChangeDeleteMode} = this.props;
        const {number, theme, id, exp, currencySign} = data;
        const {bgColor, textColor, bankLogoUrl, brandLogoUrl} = theme;
        const themedBrandLogoUrl = active ? brandLogoUrl : brandLogoUrl.replace(/-colored.svg$/, '-white.svg');

        return (
			<CardLayout active={active} bgColor={bgColor} onClick={onClick} isCardsEditable={isCardsEditable} isSingle={isSingle}>
				<CardEdit editable={isCardsEditable} id={id} onChangeBarMode={onChangeDeleteMode}/>
				<CardLogo url={bankLogoUrl} active={active} />
				<CardNumber textColor={textColor} active={active}>
					{number}
				</CardNumber>
				<CardType url={themedBrandLogoUrl} active={active} textColor={textColor}>
          <CardCurrency>{currencySign}</CardCurrency>
          <span>{exp}</span>
        </CardType>
			</CardLayout>
		);
    }
}

Card.propTypes = {
	data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	type: PropTypes.string,
	active: PropTypes.bool,
	isCardsEditable: PropTypes.bool,
	onClick: PropTypes.func,
	onChangeBarMode:PropTypes.func,
	isSingle: PropTypes.bool,
}

export default Card;
