import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Flex, Box, Text, Input, Button, Modal } from 'rimble-ui';

import AppIcon from '../Icon';
import { askForWrap } from '../../services/api';
import { getWalletInfo } from '../Wallet/db';
import WrapSendFil from '../WrapSendFil';

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

const Wrap = () => {
  const { account, currentFee } = useSelector(state => state.web3)
  const { address } = getWalletInfo();
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({ amount: '', destination: '', origin: address });
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

  const handleUseEthWallet = () => {
    onWrapValueChange({ target: { name: 'destination', value: account }});
  }

  const handleUseFilWallet = () => {
    onWrapValueChange({ target: { name: 'origin', value: address }});
  }

  const handleWrap = async () => {
    const { amount, destination, origin } = formData;
    console.log("WRAPPPP!!", amount, destination, origin)
    if (amount > 0) {
      setModalOpen(true)
      const filAmount = amount.replace(',', '.');
      const { success, data } = await askForWrap({ origin, amount: filAmount, destination });
      // TODO: inform error to user
    }
  }

  return (
    <>
      <Flex flexDirection="column" alignItems="stretch" py={4}>
        <Box position="relative" mx={4} mb={4}>
          <Text fontWeight="300" fontFamily="sansSerif" width="100%" color="primary">Wrap Amount</Text>
          <Input
            name="amount"
            onChange={onWrapValueChange}
            placeholder="Amount of FIL to wrap"
            required={true}
            type="number"
            value={formData.amount}
            width="100%"
          />
          <Box position="absolute" top="33px" right="0">
            <Flex alignItems="center" justifyContent="flex-end">
              <AppIcon name="filecoin" width="30px" height="30px" />
              <Text fontWeight="300" fontFamily="sansSerif" width="100%" color="primary" ml="5px">FIL</Text>
            </Flex>
          </Box>
        </Box>
        <Box position="relative" mx={4} mb={4}>
          <Text fontWeight="300" fontFamily="sansSerif" width="100%" color="primary">Filecoin Sending Address</Text>
          <Input
            name="origin"
            onChange={onWrapValueChange}
            placeholder="e.g. t3sajrvgya262eypuvzdbfc4n2me..."
            required={true}
            type="text"
            value={formData.origin}
            width="100%"
          />
          <SetInputValue onClick={handleUseFilWallet}>use wallet</SetInputValue>
        </Box>
        <Box position="relative" mx={4} mb={4}>
          <Text fontWeight="300" fontFamily="sansSerif" width="100%" color="primary">Ethereum Destination Address</Text>
          <Input
            name="destination"
            onChange={onWrapValueChange}
            placeholder="e.g. 0xE24904d381D075cf0c8912Bc3..."
            required={true}
            type="text"
            value={formData.destination}
            width="100%"
          />
          <SetInputValue onClick={handleUseEthWallet}>use wallet</SetInputValue>
        </Box>
        <Box position="relative" mx={4} mb={4}>
          <Text fontWeight="300" fontFamily="sansSerif" width="100%" color="primary">
            Fee ({currentFee}%): {feeAmount > 0 ? `${feeAmount} WFIL` : '-'}
          </Text>
          <Text fontWeight="300" fontFamily="sansSerif" width="100%" color="primary">
            You Will Receive: {feeAmount > 0 ? `${(formData.amount - feeAmount).toFixed(ROUND_DECIMALS)} WFIL` : '-'}
          </Text>
        </Box>
        <Box px={4}>
          <Button onClick={handleWrap} width="100%">GET WFIL</Button>
        </Box>
      </Flex>
      <Modal isOpen={modalOpen}>
        <WrapSendFil amount={formData.amount} onCloseModal={() => setModalOpen(false)} />
      </Modal>
    </>
  )
}
 
export default Wrap;