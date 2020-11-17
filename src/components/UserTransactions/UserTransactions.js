import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { space } from 'styled-system';
import { Flex, Box, Heading, Text, Pill, Modal } from 'rimble-ui';

import { getWalletInfo } from '../Wallet/db';
import { getUserTransactions } from '../../services/api';
import { autoRound } from '../../helpers/filecoin';
import Icon from '../Icon';
import { ReactComponent as Logo } from '../Icon/logo.svg';
import WrapSendFil from '../WrapSendFil';
import AppLink from '../AppLink';

const Header = styled(Flex)`
  ${space};
  border-bottom: 1px solid ${({theme}) => theme.colors.primary};
  height: 67px;
`;

const TransactionItem = styled(Flex)`
  border-bottom: 1px solid ${({theme}) => theme.colors.primary};
  &:hover {
    background-color: ${({theme}) => theme.colors.lightGrey};
  }
`;

const INTERVAL_CHECK = 5000;
let intervalHandler = null;

const UserTransactions = () => {
  const { address } = getWalletInfo();
  const { totalSupply, account } = useSelector(state => state.web3);
  const [userTransactions, setUserTransactions] = useState([]);
  const [modalData, setModalData] = useState({ open: false });
  
  useEffect(() => {
    fetchUserTransactions(account, address);

    intervalHandler && clearInterval(intervalHandler);
    intervalHandler = setInterval(async() => {
      fetchUserTransactions(account, address);
    }, INTERVAL_CHECK);
    
    return () => intervalHandler && clearInterval(intervalHandler);
  }, [account, address]);


  const fetchUserTransactions = async (account, address) => {
    const { success, data } = await getUserTransactions(account, address);
    if (success) {
      setUserTransactions(data);
    }
  }

  const openTransactionModal = ({ amount }) => {
    setModalData({
      amount: autoRound(amount),
      open: true
    })
  }

  const closeTransactionModal = () => {
    setModalData({ open: false });
  }

  return (
    <>
      <Header p={3} justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontFamily="sansSerif" fontWeight="300" color="primary">Recent Transactions</Heading>
        <Text color="primary" fontFamily="sansSerif" fontSize={1}>Total Supply: {totalSupply} WFIL</Text>
      </Header>
      <div>
        {userTransactions.map(tx => (
          <TransactionItem key={tx._id} p={3} justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              {tx.type === 'wrap'
                ? <Box><Logo style={{ width: '35px', height: '35px' }} /></Box>
                : <Box mx="6px"><Icon name="filecoin" width="25px" height="25px" /></Box>
              }
              <Text color="text" fontFamily="sansSerif" fontSize={1} ml={2}>{autoRound(tx.amount)}</Text>
              {tx.type === 'wrap'
                ? (<Text color="text" fontFamily="sansSerif" fontSize={1}>
                    <Flex alignItems="flex-start">&nbsp;FIL&nbsp;<Icon name="rightArrow"/>&nbsp;WFIL&nbsp;</Flex>
                  </Text>)
                : (<Text color="text" fontFamily="sansSerif" fontSize={1}>
                    <Flex alignItems="flex-start">&nbsp;WFIL&nbsp;<Icon name="rightArrow"/>&nbsp;FIL&nbsp;</Flex>
                  </Text>)
              }
            </Flex>
            <Flex justifyContent="flex-end" alignItems="center">
              {tx.type === 'wrap' && tx.status === 'pending' && (
                <Box mr={4}>
                  <AppLink href='#' onClick={() => openTransactionModal(tx)}>
                    <Text fontFamily="sansSerif" fontSize={1} color="primary">Instructions</Text>
                  </AppLink>
                </Box>
              )}
              {tx.status === 'success'
                ? (<Pill color="green">
                    <Text fontFamily="sansSerif" fontSize={1}>Completed</Text>
                  </Pill>)
                : (<Pill color="warning">
                    <Text fontFamily="sansSerif" fontSize={1}>Pending</Text>
                  </Pill>)}
              
            </Flex>
          </TransactionItem>
        ))}
      </div>
      <Modal isOpen={modalData.open}>
        <WrapSendFil amount={modalData.amount} onCloseModal={closeTransactionModal} />
      </Modal>
    </>
  )
}
 
export default UserTransactions;