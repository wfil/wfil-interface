import React from 'react';
import Filecoin from './Filecoin';

const icons = {
  filecoin: Filecoin
}

const Icon = ({ name, ...rest }) => {
  const IconComponent = icons[name];
  return <IconComponent {...rest} />;
}
 
export default Icon;