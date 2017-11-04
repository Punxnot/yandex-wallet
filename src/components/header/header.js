import React from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import styled from 'emotion/react';
import Title from '../misc/title';
import UserInfo from './user-info';
import Button from '../misc/button';
import Currency from './currency';

import { signOutUser } from '../../actions/auth';
import {getTelegramKey} from '../../actions/user';


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

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
		this.state = {
			isTelegramModalVisible: false
		}
	}

	componentWillUpdate(nextProps) {
		if (this.props.auth.userName !== nextProps.auth.userName && nextProps.auth.userName) {
			this.props.getTelegramKey(nextProps.auth.userName);
		}
	}

	onClick() {
		this.setState({
			isTelegramModalVisible: !this.state.isTelegramModalVisible
		});
	}
	renderBalance() {
		const {activeCard, auth} = this.props;
		if (activeCard) return (
		<Balance>
			{`${activeCard.bankName}: `}
			<BalanceSum>{`${Number(activeCard.balance.toFixed(4))} ${activeCard.currencySign}`}</BalanceSum>
		</Balance>)
	}

	render() {
		const {user, auth, dispatch} = this.props;

		return (
			<HeaderLayout>
				{this.renderBalance()}
				{!auth.isAuth && <Balance>Электронный кошелек</Balance>}
				{auth.isAuth && 
					<Button bgColor='#0088cc' textColor='#fff' onClick={this.onClick}>Telegram</Button>
				}
				{this.state.isTelegramModalVisible ? <span>{user.telegramKey}</span> : null}
				{auth.isAuth && <Currency />}
				<UserInfo isAuth={auth.isAuth} userName={auth.userName} onSignOutClick={()=> dispatch(signOutUser())}/>
			</HeaderLayout>
		)
	}
};

const mapStateToProps = state => ({
	activeCard: getActiveCard(state),
	auth: state.auth,
	user: state.user
});

const mapDispatchToProps = dispatch => ({
	getTelegramKey: bindActionCreators(getTelegramKey, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
