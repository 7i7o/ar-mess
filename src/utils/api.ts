import axios from 'axios';
import { GW } from '../contexts/config';

export const fetchWalletBalance = async (walletAddress: string) => {
    const url = `${GW}/wallet/${walletAddress}/balance`;
    console.log(url);

    const response = await axios.get(url);
    return response.data;
};
