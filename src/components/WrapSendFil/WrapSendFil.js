import React from 'react';
import { Flex, Box, Card, Heading, Text, Icon, Input, Button, Modal } from 'rimble-ui';
import Clipboard from '../../utilities/components/CopyToClipboard';

const WFIL_ADDRESS = process.env.REACT_APP_FIL_WALLET;

const WrapSendFil = ({ onCloseModal, amount }) => {
  return (
    <Card width={"420px"} p={0}>
      <Box p={4} mb={3}>
        <Heading.h3>Wrapping FIL into WFIL</Heading.h3>
        <>
          <Text mt={4}>Send {amount}FIL to:</Text>
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
      </Box>

      <Flex
        px={4}
        py={3}
        borderTop={1}
        borderColor={"#E8E8E8"}
        justifyContent="center"
      >
        <Button onClick={onCloseModal}>Continue</Button>
      </Flex>
    </Card>
  )
}
 
export default WrapSendFil;