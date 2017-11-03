import React from 'react';
import {connect} from 'react-redux';
import styled from 'emotion/react';
import Title from '../misc/title';
import UserInfo from './user-info';
import Button from '../misc/button';
import Currency from './currency';

import { signOutUser } from '../../actions/auth';

import { getActiveCard } from '../../selectors/cards';

const HeaderLayout = styled.header`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 74px;
	background: #fff;
	padding: 20px 30px;
	box-sizing: border-box;
	border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

const Balance = styled(Title)`
	margin: 0;
`;

const BalanceSum = styled.span`
	font-weight: bold;
`;

const Header = ({activeCard, auth, dispatch}) => {
	const renderBalance = () => {
		if (activeCard) return (
		<Balance>
			{`${activeCard.bankName}: `}
			<BalanceSum>{`${Number(activeCard.balance.toFixed(4))} ${activeCard.currencySign}`}</BalanceSum>
		</Balance>)
	};

	return (
		<HeaderLayout>
			{renderBalance()}
			{!auth.isAuth && <Balance>Электронный кошелек</Balance>}
			{auth.isAuth && 
				<div>
					<Button bgColor='#0088cc' textColor='#fff'><a style={{color:'#fff'}} target="_blank" href={`http://telegram.me/@PicturerBot`}>Телеграм</a></Button>
				</div>
			}
			{auth.isAuth && <Currency />}
			<UserInfo isAuth={auth.isAuth} userName={auth.userName} onSignOutClick={()=> dispatch(signOutUser())}/>
		</HeaderLayout>
	)
};

const mapStateToProps = state => ({
	activeCard: getActiveCard(state),
	auth: state.auth
});

export default connect(mapStateToProps)(Header);
