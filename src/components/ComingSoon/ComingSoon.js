import React from 'react';
import styled from 'styled-components';
import { Box, Heading, Text } from 'rimble-ui';

import AppLink from '../AppLink';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
  position:absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

const ComingSoon = () => {
  return (
    <Wrapper>
      <Heading mb="30px" as="h1" fontFamily="sansSerif" fontWeight="300" textAlign="center" fontSize="3rem">
        Coming Soon...
      </Heading>
      <Text fontFamily="sansSerif" fontWeight="300">
        <span>Stay Tuned for Mainnet Launch</span>&nbsp;
        <AppLink href="https://twitter.com/wrappedfil" target="_blank" rel="noopener noreferrer">@WrappedFIL</AppLink>
      </Text>
    </Wrapper>
  )
}
 
export default ComingSoon;