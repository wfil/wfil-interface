const ROUND_DECIMALS = process.env.REACT_APP_ROUND_DECIMALS;

export const formatAddress = (address) => `f${address.slice(1)}`;

export const absoluteAmount = (amount) => (amount * 1000000000000000000).toString();
export const friendlyAmount = (amount) => (amount / 1000000000000000000).toFixed(ROUND_DECIMALS);