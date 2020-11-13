import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import {ThemeProvider} from 'styled-components'
import {theme} from 'rimble-ui'

import { Reset } from './components/ResetStyles';
import Wallet from './components/Wallet';
import Routes from './Routes';
import customTheme from './theme';
import {
  setNetwork,
  setTotalSupply,
  setAccount,
  setUserTokenBalance,
  setCurrentFee
} from './redux/actions/web3';
import {
  getTokenSupply,
  getNetwork,
  setupEventHandlers,
  isConnected,
  getUserAccount,
  getUserTokenBalance,
  getCurrentFee
} from './services/web3';

const appTheme = { ...theme, ...customTheme };
const ROUND_DECIMALS = process.env.REACT_APP_ROUND_DECIMALS

const App = () => {
  const dispatch = useDispatch();

  const initWeb3 = async () => {
    const [totalSupply, network, fee] = await Promise.all([
      getTokenSupply(),
      getNetwork(),
      getCurrentFee()
    ])
    dispatch(setTotalSupply(parseFloat(totalSupply).toFixed(ROUND_DECIMALS)));
    dispatch(setNetwork(network));
    dispatch(setCurrentFee(fee));
    if (isConnected()) {
      const account = getUserAccount();
      dispatch(setAccount(account));
      registerUserTokenBalance(account);
    }
  };
  
  const registerUserTokenBalance = async (account) => {
    const balance = await getUserTokenBalance(account);
    dispatch(setUserTokenBalance(parseFloat(balance).toFixed(ROUND_DECIMALS)));
  }

  const registerAccount = (accounts) => {
    const userAccount = accounts[0];
    dispatch(setAccount(userAccount));
    registerUserTokenBalance(userAccount);
  }

  useEffect(() => {
    initWeb3();
    setupEventHandlers({
      onNetworkChanged: initWeb3,
      onAccountsChanged: registerAccount
    });
  }, []);

  return (
    <ThemeProvider theme={appTheme}>
      <Reset />
      <Routes /> 
      <Wallet />
    </ThemeProvider>
  );
}

export default App;
