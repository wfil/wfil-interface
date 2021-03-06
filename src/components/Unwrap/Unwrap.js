import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Flex, Box, Card, Heading, Text, Input, Button, Modal, Loader } from 'rimble-ui';

import { checkTransactionStatus, askForUnwrap } from '../../services/api';
import { sendUnwrapTransaction } from '../../services/web3';
import { getWalletInfo } from '../Wallet/db';
import { ReactComponent as Logo } from '../Icon/logo.svg';

const INTERVAL_CHECK = 5000;
let intervalHandler = null;
const TX_STATUSES = {
  PENDING_COMPLETION: 'pending-completion',
  PENDING_ETH_TX: 'pending-eth-tx',
  PENDING_METAMASK: 'pending-metamask',
  SUCCESS: 'success'
}

const SetInputValue = styled.a`
  position: absolute;
  top: 10px;
  right: 0;
  text-decoration: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-family: sans-serif;
  font-size: .8rem;
`;

const ROUND_DECIMALS = process.env.REACT_APP_ROUND_DECIMALS

const Unwrap = () => {
  const { address } = getWalletInfo();
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({ amount: '', destination: address});
  const [success, setSuccess] = useState(false);
  const [txStatus, setTxStatus] = useState('');
  const { account, userBalance, currentFee } = useSelector(state => state.web3);
  const [feeAmount, setFeeAmount] = useState(0);

  useEffect(() => {
    const feeAbs = currentFee / 100;
    setFeeAmount((feeAbs * formData.amount).toFixed(ROUND_DECIMALS));
  }, [formData.amount]);

  const onWrapValueChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'amount' && Number(value) < 0) return;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleUseMaxWFilValue = () => {
    onWrapValueChange({ target: { name: 'amount', value: userBalance }});
  };

  const handleUseFilWallet = () => {
    onWrapValueChange({ target: { name: 'destination', value: address }});
  };

  const handleUnWrap = async () => {
    const { amount, destination } = formData;
    console.log("UNWRAPPPP!!", amount, destination, account)

    if (amount > 0) {
      const filAmount = amount.replace(',', '.');
      const { success, data } = await askForUnwrap({ origin: account, amount: filAmount, destination });
      
      if (!success) return;
      const transactionId = data.id;
      const filAmountAbs = String(amount.replace(',', '.') * 1e18);
      setTxStatus(TX_STATUSES.PENDING_METAMASK);
      
      sendUnwrapTransaction({
        destination,
        amount: filAmountAbs,
        account,
        callback: ({ status, transactionHash }) => {
          setTxStatus(TX_STATUSES.PENDING_ETH_TX);
          if (status === 'success') {
            setTxStatus(TX_STATUSES.PENDING_COMPLETION);
            intervalHandler && clearInterval(intervalHandler);
            intervalHandler = setInterval(async() => {
              const { success: statusSuccess, data: dataTransaction } = await checkTransactionStatus(transactionId);
              console.log("intervalHandler -> success", statusSuccess, dataTransaction)
              if (statusSuccess && dataTransaction && dataTransaction.status === 'success') {
                setTxStatus(TX_STATUSES.SUCCESS);
                setSuccess(true);
                clearInterval(intervalHandler);
              }
            }, INTERVAL_CHECK);
          }
        }
      })
      setModalOpen(true)
    }
  }

  return (
    <>
      <Flex flexDirection="column" alignItems="stretch" py={4}>
        <Box position="relative" mx={4} mb={4}>
          <Text fontWeight="300" fontFamily="sansSerif" width="100%" color="primary">Unwrap Amount</Text>
          <Input
            name="amount"
            onChange={onWrapValueChange}
            placeholder="Amount of WFIL to unwrap"
            required={true}
            type="number"
            value={formData.amount}
            width="100%"
          />
          <Box position="absolute" top="30px" right="0">
            <Flex alignItems="center" justifyContent="flex-end">
              <Logo style={{ width: '35px', height: '35px' }} />
              <Text fontWeight="300" fontFamily="sansSerif" width="100%" color="primary" ml="5px">WFIL</Text>
            </Flex>
          </Box>
          <SetInputValue onClick={handleUseMaxWFilValue}>max</SetInputValue>
        </Box>
        <Box position="relative" mx={4} mb={4}>
          <Text fontWeight="300" fontFamily="sansSerif" width="100%" color="primary">Filecoin Receiving Address</Text>
          <Input
            name="destination"
            onChange={onWrapValueChange}
            placeholder="e.g. t3sajrvgya262eypuvzdbfc4n2me..."
            required={true}
            type="text"
            value={formData.destination}
            width="100%"
          />
          <SetInputValue onClick={handleUseFilWallet}>use wallet</SetInputValue>
        </Box>
        <Box position="relative" mx={4} mb={4}>
          <Text fontWeight="300" fontFamily="sansSerif" width="100%" color="primary">
            Fee ({currentFee}%): {feeAmount > 0 ? `${feeAmount} FIL` : '-'}
          </Text>
          <Text fontWeight="300" fontFamily="sansSerif" width="100%" color="primary">
            You Will Receive: {feeAmount > 0 ? `${(formData.amount - feeAmount).toFixed(ROUND_DECIMALS)} FIL` : '-'}
          </Text>
        </Box>
        <Box px={4}>
          <Button onClick={handleUnWrap} width="100%">GET FIL</Button>
        </Box>
      </Flex>
      <Modal isOpen={modalOpen}>
        <Card width={"420px"} p={0}>
          <Button.Text
            icononly
            icon={"Close"}
            color={"moon-gray"}
            position={"absolute"}
            top={0}
            right={0}
            mt={3}
            mr={3}
            onClick={() => setModalOpen(false)}
          />

          <Box p={4} mb={3}>
            <Heading.h3>Unwrapping WFIL into FIL</Heading.h3>
            {txStatus === TX_STATUSES.SUCCESS && <Text mt={4}>Success</Text>}
            {txStatus === TX_STATUSES.PENDING_METAMASK && <Text mt={4}>Please confirm transaction on Metamask</Text>}
            {txStatus === TX_STATUSES.PENDING_ETH_TX && <Text mt={4}>Waiting for transaction to be confirmed</Text>}
            {txStatus === TX_STATUSES.PENDING_COMPLETION && <Text mt={4}>Unwrapping</Text>}
          </Box>

          <Flex
            px={4}
            py={3}
            borderTop={1}
            borderColor={"#E8E8E8"}
            justifyContent="space-between"
          >
            <Button onClick={() => setModalOpen(false)} width="100%">Continue</Button>
          </Flex>
        </Card>
      </Modal>
    </>
  )
}
 
export default Unwrap;