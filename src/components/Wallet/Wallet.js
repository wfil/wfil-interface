import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Flex, Box, Heading, Button, Text, Field, Input, Icon } from 'rimble-ui';

import { createWallet, getBalance, sendFil } from '../../services/wallet';
import Clipboard from '../../utilities/components/CopyToClipboard';
import { autoRound } from '../../helpers/filecoin';
import AppLink from '../AppLink';

import { getWallet, saveWallet } from './db';

const WalletContainer = styled.div`
  position: fixed;
  bottom: 5px;
  right: 5px;
  max-width: 320px;
  box-shadow: 0 0 8px 0 grey;
  z-index: 99999;
`;

const WalletHeader = styled(Box)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
`;

const WalletHeaderAddress = styled(Box)`
  max-width: 70%;
  > div {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const WalletBoddy = styled.div`
  overflow: hidden;
  transition: max-height 0.3s;
  background-color: white;
  max-height: ${({isOpen}) => isOpen ? '550px' : 0};
`;

const WalletSection = styled(Box)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};

  &:last-child {
    border: none;
  }
`;

const LinkAction = styled(Text)`
  cursor: pointer;
`;

let intervalHandler;
const CHECK_BALANCE_INTERVAL = 10000;
const defaultSendFilData = { amount: '', destination: '' };

const Wallet = () => {
  const dbWallet = getWallet();
  const [wallet, setWallet] = useState(dbWallet);
  const [isOpen, setIsOpen] = useState(false);
  const [sendFilData, setSendFilData] = useState(defaultSendFilData);
  const [sendFilSuccess, setSendFilSuccess] = useState(false);

  const updateWalletBalance = async (wallet) => {
    const { success, data: balance } = await getBalance(wallet.address);
    if (success){
      setWallet(wallet => ({ ...wallet, balance }))
      saveWallet({ ...wallet, balance });
    }
  }

  useEffect(() => {
    if (wallet) {
      intervalHandler = setInterval(() => updateWalletBalance(wallet), CHECK_BALANCE_INTERVAL);
    }
    return () => intervalHandler && clearInterval(intervalHandler);
  }, []);

  const handleCreateWallet = async () => {
    const { success, data } = await createWallet();
    if (success) {
      saveWallet(data);
      setWallet(data);
      intervalHandler = setInterval(() => updateWalletBalance(data), CHECK_BALANCE_INTERVAL);
    }
  }

  const handleSendFil = async () => {
    const { destination, amount } = sendFilData;
    if (!wallet || !destination || !amount) return;
    const { success } = await sendFil(wallet.address, destination, amount);
    setSendFilSuccess(success);
    setSendFilData(defaultSendFilData);
  }

  const handleResetWallet = () => {
    console.log("handleResetWal -> handleResetWallet")
    intervalHandler && clearInterval(intervalHandler);
    saveWallet(null);
    setWallet(null);
  }

  return (
    <WalletContainer>
      {!wallet 
        ? <Flex justifyContent="flex-end"><Button ml="auto" onClick={handleCreateWallet}>Create Wallet</Button></Flex>
        : (
          <>
            <WalletHeader p={3} onClick={() => setIsOpen(!isOpen)}>
              <Flex>
                <WalletHeaderAddress flex="0 1 70%">
                  <Text fontFamily="sansSerif" fontSize={1}>Connected: {wallet.address}</Text>
                </WalletHeaderAddress>
                <Box flex="1 0 30%">
                  <Text textAlign="right" fontFamily="sansSerif" fontSize={1}>{autoRound(wallet.balance || 0, 8)}&nbsp;FIL</Text>
                </Box>
              </Flex>
            </WalletHeader>
            <WalletBoddy isOpen={isOpen}>
              <WalletSection p={3}>
                <Heading Heading as={"h2"} mb={1} fontFamily="sansSerif">Your Wallet</Heading>
                <Clipboard text={wallet.address}>
                  {isCopied => (
                    <Box
                      color={'inherit'}
                      position={'relative'}
                      display={'flex'}
                      alignItems={'center'}
                    >
                      <Input
                        readOnly
                        value={wallet.address}
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
              </WalletSection>
              <WalletSection p={3}>
                <Heading Heading as={"h2"} mb={1} fontFamily="sansSerif">Send FIL</Heading>
                {sendFilSuccess && <Text textAlign="center" fontFamily="sansSerif" fontSize={1}>Successfully sent!</Text>}
                <Box mb={2}>
                  <Field label="Destination" fontFamily="sansSerif" width="100%" color="primary">
                    <Input
                      name="destination"
                      onChange={({ target: { value }}) => setSendFilData({ ...sendFilData, destination: value })}
                      placeholder="Wallet to send FIL"
                      required={true}
                      type="text"
                      value={sendFilData.destination}
                      width="100%"
                    />
                  </Field>
                </Box>
                <Box mb={2}>
                  <Field label="Amount" fontFamily="sansSerif" width="100%" color="primary">
                    <Input
                      name="amount"
                      onChange={({ target: { value }}) => setSendFilData({ ...sendFilData, amount: value })}
                      placeholder="0 FIL"
                      required={true}
                      type="text"
                      value={sendFilData.amount}
                      width="100%"
                    />
                  </Field>
                </Box>
                <Box>
                  <Button onClick={handleSendFil} width="100%">SEND</Button>
                </Box>
                <Box mt={4}>
                  <Text color="primary" fontFamily="sansSerif" fontSize={1}>
                    <span>Do you need test FIL?</span>&nbsp;
                    <AppLink href="https://faucet.calibration.fildev.network/funds.html" target="_blank" rel="noopener noreferrer">Faucet</AppLink>
                  </Text>
                </Box>
                <Box mb={2} mt={3}>
                  <LinkAction textAlign="center" fontFamily="sansSerif" fontSize={1} onClick={handleResetWallet}>reset wallet</LinkAction>
                </Box>
              </WalletSection>
            </WalletBoddy>
          </>
        )
      }
    </WalletContainer>
  )
}
 
export default Wallet;