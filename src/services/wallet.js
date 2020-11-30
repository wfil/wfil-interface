import axios from 'axios';

import { parseResponse } from './utils';

const BASE_URL = process.env.REACT_APP_WALLET_API;

export async function createWallet() {
  try {
    const result = await axios.post(`${BASE_URL}/create`);
    const { privateKey, address } = result.data;
    return parseResponse(true, { privateKey, address }, '');
  } catch (error) {
    console.log("createWallet -> error", error)
    return parseResponse(false); 
  }
}

export async function getBalance(address) {
  try {
    const result = await axios.get(`${BASE_URL}/balance?address=${address}`);
    return parseResponse(true, result.data, '');
  } catch (error) {
    console.log("getBalance -> error", error)  
    return parseResponse(false);  
  }
}

export async function sendFil(from, to, value) {
  try {
    const result = await axios.post(`${BASE_URL}/send`,{ from, to, value });
    console.log("sendFil -> result", result);
    return parseResponse(true, true, '');
  } catch (error) {
    console.log("sendFil -> error", error)
    return parseResponse(false);
  }
}
