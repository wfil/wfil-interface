import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Flex, Box, Card, Heading, Text, Icon, Input, Button, Modal, Loader } from 'rimble-ui';

import AppIcon from '../Icon';
import { friendlyAmount } from '../../helpers/filecoin';
import { askForWrap, checkTransactionStatus } from '../../services/api';
import Clipboard from '../../utilities/components/CopyToClipboard';
import { getWallet } from '../Wallet/db';

const INTERVAL_CHECK = 5000;
const WFIL_ADDRESS = process.env.REACT_APP_FIL_WALLET;
let intervalHandler = null;

const AppLink = styled.a`
  color: ${props => props.theme.colors.primary};
`;

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

const FEE_ROUND_DIGITS = 6;

const Wrap = () => {
  const { account, currentFee } = useSelector(state => state.web3)
  const lsWallet = getWallet();
  const address = lsWallet?.address ?? '';
  const filBalance = friendlyAmount(lsWallet?.balance ?? 0);
  const [modalOpen, setModalOpen] = useState(false)
  const [txResult, setTxResult] = useState('')
  const [formData, setFormData] = useState({ amount: '', destination: '', origin: address });
  const [feeAmount, setFeeAmount] = useState(0);

  useEffect(() => {
    const feeAbs = currentFee / 100;
    setFeeAmount((feeAbs * formData.amount).toFixed(FEE_ROUND_DIGITS));
  }, [formData.amount]);

  useEffect(() => {
    return () => intervalHandler && clearInterval(intervalHandler);
  }, []);

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

  const handleUseMaxFilValue = () => {
    onWrapValueChange({ target: { name: 'amount', value: filBalance }});
  }


  const handleWrap = async () => {
    const { amount, destination, origin } = formData;
    console.log("WRAPPPP!!", amount, destination, origin)
    if (amount > 0) {
      setModalOpen(true)
      const filAmount = amount.replace(',', '.');
      const { success, data } = await askForWrap({ origin, amount: filAmount, destination });
      const transactionId = data && data.id ? data.id : null;

      if (success && transactionId) {
        intervalHandler && clearInterval(intervalHandler);
        intervalHandler = setInterval(async() => {
          const { success: statusSuccess, data: dataTransaction } = await checkTransactionStatus(transactionId);
          console.log("intervalHandler -> success", statusSuccess, dataTransaction)
          if (statusSuccess && dataTransaction && dataTransaction.status === 'success') {
            setTxResult(dataTransaction.txHash);
            clearInterval(intervalHandler);
          }
        }, INTERVAL_CHECK);
      }

    }
  }

  const closeModal = () => setModalOpen(false);

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
          <SetInputValue onClick={handleUseMaxFilValue}>max</SetInputValue>
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
            You Will Receive: {feeAmount > 0 ? `${(formData.amount - feeAmount).toFixed(FEE_ROUND_DIGITS)} WFIL` : '-'}
          </Text>
        </Box>
        <Box px={4}>
          <Button onClick={handleWrap} width="100%">GET WFIL</Button>
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
            onClick={closeModal}
          />

          <Box p={4} mb={3}>
            <Heading.h3>Wrapping FIL into WFIL</Heading.h3>
            {txResult 
              ? (
                <Text mt={4}>
                  <span>Success! </span>
                  <AppLink href={`https://rinkeby.etherscan.io/tx/${txResult}`} target="_blank" rel="noopener noreferrer">Check transaction</AppLink>
                </Text>
              )
              : (
              <>
                <Text mt={4}>Send {formData.amount}FIL to:</Text>
                <Clipboard text={WFIL_ADDRESS}>
                  {isCopied => (
                    <Box
                      color={'inherit'}
                      position={'relative'}
                      display={'flex'}
                      alignItems={'center'}
                    >
                      <Input
                        readOnly
                        value={WFIL_ADDRESS}
                        width={1}
                        p={'auto'}
                        pl={3}
                        pr={'5rem'}
                        fontWeight={3}
                      />
                      <Button
                        size={'small'}
                        width={'4rem'}
                        mx={2}
                        position={'absolute'}
                        right={0}
                      >
                        {!isCopied ? 'Copy' : <Icon name={'Check'} />}
                      </Button>
                    </Box>
                  )}
                </Clipboard>
              </>
            )}
            
          </Box>

          <Flex
            px={4}
            py={3}
            borderTop={1}
            borderColor={"#E8E8E8"}
            justifyContent="space-between"
          >
            {!txResult && <Button.Outline onClick={closeModal}>Cancel</Button.Outline>}

            {txResult 
             ? (
              <Button onClick={closeModal} width="100%">Close</Button>
             )
             : (
              <Flex
                px={4}
                py={3}
                justifyContent="flex-end"
                alignItems="center"
              >
                <Loader />
                <Text ml={1}>Waiting</Text>
              </Flex>
            )}
          </Flex>
        </Card>
      </Modal>
    </>
  )
}
 
export default Wrap;