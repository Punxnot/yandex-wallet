import React from 'react';
import styled from 'emotion/react';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';

import Island from '../misc/island';

const HistoryLayout = styled(Island)`
	width: 530px;
	max-height: 622px;
	overflow-y: scroll;
	padding: 0;
	background-color: rgba(0, 0, 0, 0.05);
	display: flex;
	flex-direction: column;
`;

const HistoryTitle = styled.div`
	padding-left: 12px;
	color: rgba(0, 0, 0, 0.4);
	font-size: 15px;
	line-height: 30px;
	text-transform: uppercase;
`;

const HistoryItem = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 74px;
	min-height: 74px;
	font-size: 15px;
	font-weight: bold;
	white-space: nowrap;

	&:nth-child(even) {
		background-color: #fff;
	}

	&:nth-child(odd) {
		background-color: rgba(255, 255, 255, 0.72);
	}

	color: ${({isInvalid}) => isInvalid ? '#F44336' : '#000'};
`;

const HistoryItemIcon = styled.div`
	width: 50px;
	height: 50px;
	border-radius: 25px;
	background-color: #159761;
	background-image: url(${({bankSmLogoUrl}) => bankSmLogoUrl});
	background-size: contain;
	background-repeat: no-repeat;
`;

const HistoryItemTitle = styled.div`
	width: 290px;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const HistoryItemTime = styled.div`
	width: 50px;
`;

const HistoryItemSum = styled.div`
	width: 85px;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const History = ({transactions, activeCard, isLoading}) => {
	const renderCardsHistory = () => {
		if (isLoading) return (<HistoryItem>Загрузка...</HistoryItem>);

		const result = [];
		const today = moment().format('L');

		if (transactions.length === 0)
			result.push(<HistoryItem key={today+'HistoryItem'}>Операций не найдено</HistoryItem>)
		else {
			transactions.forEach(item=> {
				if (item.key === today) result.push(<HistoryTitle key={item.key}>Сегодня</HistoryTitle>);
				else {
					if (result.length === 0) 
						{
							result.push(<HistoryTitle key={today+'HistoryTitle'}>Сегодня</HistoryTitle>)
							result.push(<HistoryItem key={today+'HistoryItem'}>Операций за этот день нет</HistoryItem>)
						}

					result.push(<HistoryTitle key={item.key}>{item.key}</HistoryTitle>);}

				result.push(renderCardsDay(item.data));
			});
			result.push(<HistoryItem key={today+'LoadItem'}><a href={`/api/cards/${activeCard.id}/file-transactions`}>Зарузить в CSV</a></HistoryItem>);
		}

		return result;
	};

	const renderCardsDay = (arr) => 
		arr.map(item => {
			return (
				<HistoryItem key={ item.id } isInvalid={item.invalidInfo && item.invalidInfo.isInvalid} data-tip={item.invalidInfo && item.invalidInfo.error}>
					{item.invalidInfo && <ReactTooltip />}
					<HistoryItemIcon bankSmLogoUrl={ activeCard.theme.bankSmLogoUrl } />
						<HistoryItemTitle>
							{item.title}
						</HistoryItemTitle>
					<HistoryItemTime>
						{ item.hhmm}
					</HistoryItemTime>
					<HistoryItemSum>
						{ `${Number(item.sum.toFixed(4))} ${activeCard.currencySign}` }
					</HistoryItemSum>
				</HistoryItem>
		);
	});

	return (
		<HistoryLayout>
			{ renderCardsHistory() }
		</HistoryLayout>
		);
};

export default History;
