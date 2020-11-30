import axios from 'axios';

import { parseResponse } from './utils';

const BASE_URL = 'https://hyh3zeh3t7.execute-api.eu-west-3.amazonaws.com';

export async function askForWrap({origin, amount, destination}) {
  try {
    const result = await axios.post(`${BASE_URL}/wrap`, { origin, amount, destination });
    console.log("askForWrap -> result", result);
    return parseResponse(true, { id: result.data.data });
  } catch (error) {
    console.log("askForWrap -> error", error)
    return parseResponse(false); 
  }
}
export async function askForUnwrap({origin, amount, destination}) {
  try {
    const result = await axios.post(`${BASE_URL}/unwrap`, { origin, amount, destination });
    console.log("askForUnwrap -> result", result);
    return parseResponse(true, { id: result.data.data });
  } catch (error) {
    console.log("askForUnwrap -> error", error)
    return parseResponse(false); 
  }
}

export async function checkTransactionStatus(id) {
  try {
    const result = await axios.get(`${BASE_URL}/transaction/${id}`);
    console.log("checkTransactionStatus -> result", result);
    return parseResponse(true, { ...result.data.data });
  } catch (error) {
    console.log("checkTransactionStatus -> error", error)
    return parseResponse(false); 
  }
}

export async function getUserTransactions(ethAddress, filAddress) {
  try {
    const result = await axios.get(`${BASE_URL}/transaction?ethAddress=${ethAddress}&filAddress=${filAddress}`);
    console.log("getUserTransactions -> result", result);
    return parseResponse(true, result.data.data);
  } catch (error) {
    console.log("getUserTransactions -> error", error)
    return parseResponse(false); 
  }
}