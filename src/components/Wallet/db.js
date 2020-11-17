import { friendlyAmount } from '../../helpers/filecoin';

const LOCAL_STORAGE_KEY = 'wfil_wallet_v0_1';

export function getWallet() {
  const lsData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  return lsData ? JSON.parse(lsData) : null;
}

export function saveWallet(wallet) {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wallet));
}

export function getWalletInfo() {
  const lsWallet = getWallet();
  const address = lsWallet?.address ?? '';
  const filBalance = friendlyAmount(lsWallet?.balance ?? 0);
  return { address, filBalance }
}