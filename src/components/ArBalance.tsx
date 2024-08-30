import { useState, useEffect } from 'react';
import { fetchWalletBalance } from '../utils/api';
import { useActiveAddress } from 'arweave-wallet-kit';
import { getArweave } from '../utils/arweave';
import ArTokenTransfer from './ArTokenTranfer';

const ArBalance = () => {
    const [balance, setBalance] = useState('0');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const walletAddress = useActiveAddress();

    useEffect(() => {
        const getBalance = async () => {
            if (!walletAddress) return;
            setLoading(true);
            setError(null);
            try {
                const fetchedBalance = await fetchWalletBalance(walletAddress);
                const arFetchedBalance =
                    getArweave().ar.winstonToAr(fetchedBalance);
                setBalance(arFetchedBalance);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch balance');
            } finally {
                setLoading(false);
            }
        };

        getBalance();
    }, [walletAddress]);

    if (loading) return <>Loading...</>;

    if (error) return <>{error}</>;

    return (
        <>
            Wallet: {walletAddress}
            <br />
            Balance: {balance !== null ? `${balance} AR` : 'Not available.'}
            {balance !== null && balance > '0' && <ArTokenTransfer />}
        </>
    );
};

export default ArBalance;
