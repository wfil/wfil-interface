import React from 'react';
import styled from 'styled-components';
import { Button, Heading, Text } from 'rimble-ui';

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
        WFIL Bistrot ☕️&nbsp;🥐
      </Heading>
      <Text mb="20px" fontFamily="sansSerif" fontWeight="300">Coming soon...</Text>
      <Text fontFamily="sansSerif" fontWeight="300">
        <Button as="a" href="https://wfil.substack.com/welcome" target="\_blank" width="100%">Subscribe for News! 🚀</Button>
      </Text>
    </Wrapper>
  )
}
 
export default ComingSoon;