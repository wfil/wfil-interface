import React from 'react';
import Filecoin from './Filecoin';
import RightArrow from './RightArrow';

const icons = {
  filecoin: Filecoin,
  rightArrow: RightArrow
}

const Icon = ({ name, ...rest }) => {
  const IconComponent = icons[name];
  return <IconComponent {...rest} />;
}
 
export default Icon;