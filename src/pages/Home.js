import React, { useState } from 'react';
import styled from 'styled-components';
import { Flex, Box, Card, Heading, Text } from 'rimble-ui';

import MainLayout from '../components/layouts';
import Wrap from '../components/Wrap';
import Unwrap from '../components/Unwrap';
import { ReactComponent as Logo } from '../components/Icon/logo.svg';
import Icon from '../components/Icon';
import UserTransactions from '../components/UserTransactions';

const Tab = styled(Box)`
  cursor: pointer;
  text-align: center;
  border-bottom: ${(props) => props.active ? '' : `1px solid ${props.theme.colors.primary}`};
`;

const TabLeft = styled(Tab)`
  box-shadow: ${({active}) => active ? 'none': 'inset -5px -5px 11px -2px rgba(0,0,0,0.2)'};
`

const TabRight = styled(Tab)`
  box-shadow: ${({active}) => active ? 'none': 'inset 5px -5px 11px -2px rgba(0,0,0,0.2)'};
`

const VLine = styled.div`
  width: 1px;
  background-color: ${(props) => props.theme.colors.primary};
`;

const Home = () => {
  const [tab, setTab] = useState('wrap');

  return (
    <MainLayout>
      <Flex flexDirection={['column', 'row']} justifyContent="space-between" width="98%" maxWidth={['98%', '1200px']} mx="auto">
        <Card width={['100%', '30%']} mx={"auto"} my={5} p={0}>
          <Flex>
            <TabLeft
              p={3}
              width={1 / 2}
              color="primary"
              active={tab === 'wrap'}
              onClick={() => setTab('wrap')}
            >
              <Heading as="h3" fontFamily="sansSerif" fontWeight="300">
                <Flex justifyContent="center" alignItems="center">
                  <Logo style={{ width: '35px', height: '35px' }} />
                  <Box ml="0.4rem">GET WFIL</Box>
                </Flex>
              </Heading>
            </TabLeft>
            <VLine />
            <TabRight
              px={3}
              pb={3}
              pt="18px"
              width={1 / 2}
              color="primary"
              active={tab === 'unwrap'}
              onClick={() => setTab('unwrap')}
            >
              <Heading as="h3" fontFamily="sansSerif" fontWeight="300">
                <Flex justifyContent="center" alignItems="center">
                  <Icon name="filecoin" width="30px" height="30px" />
                  <Box ml="0.4rem">GET FIL</Box>
                </Flex>
              </Heading>
            </TabRight>
          </Flex>
          {tab === 'wrap' ? <Wrap /> : <Unwrap />}
        </Card>
        <Card width={['100%', '68%']} mx={"auto"} my={5} p={0} style={{ 'max-height': '580px', 'overflow': 'scroll'}}>
          <UserTransactions />
        </Card>
      </Flex>
      <Flex flexDirection="column" justifyContent="center" alignItems="center">
        <Text mt="10px" fontFamily="sansSerif" fontSize={1} mb="20px">Wrapped Filecoin is currently in beta. Please don't use Mainnet FIL on this project.</Text>
        <Text color="primary" fontFamily="sansSerif" fontSize={1}>Current networks: Calibration - Rinkeby</Text>
      </Flex>
    </MainLayout>
  );
}
 
export default Home;
