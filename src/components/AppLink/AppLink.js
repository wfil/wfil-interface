import React from 'react';
import styled from 'styled-components';

const Link = styled.a`
  color: ${({theme}) => theme.colors.primary};
`;

const AppLink = ({ children, ...rest }) => {
  return (
    <Link {...rest}>{children}</Link>
  )
}
 
export default AppLink;