import { createDataItemSigner } from '@permaweb/aoconnect';
import { useActiveAddress } from 'arweave-wallet-kit';
import { AoInstance, useAo, Message } from './ao';
import { getTagValue } from '../utils/arweave';
import { useEffect, useState } from 'react';

export type RefreshFunction = () => Promise<void>;

/**
 * Get info about a token
 * @param id Token ID
 */
export async function getTokenInfo(
    id: string,
    ao: AoInstance
): Promise<TokenInfo> {
    const res = await ao.dryrun({
        Id: '0000000000000000000000000000000000000000001',
        Owner: '0000000000000000000000000000000000000000001',
        process: id,
        tags: [{ name: 'Action', value: 'Info' }],
    });

    for (const msg of res.Messages as Message[]) {
        const Ticker = getTagValue('Ticker', msg.Tags);
        const Name = getTagValue('Name', msg.Tags);
        const Denomination = getTagValue('Denomination', msg.Tags);
        const Logo = getTagValue('Logo', msg.Tags);

        if (!Ticker && !Ticker) continue;
        const adjustedDenomination = Math.pow(10, Number(Denomination || '0'));

        return {
            id,
            Name,
            Ticker,
            Denomination: adjustedDenomination,
            Logo,
        };
    }

    return { id, Denomination: 1 };
}

/**
 * Token info hook
 */
export function useTokenInfo(id: string): [TokenInfo | undefined, boolean] {
    // token information
    const [tokenInfo, setTokenInfo] = useState<TokenInfo>();

    // loading
    const [loading, setLoading] = useState(true);

    // ao instance
    const ao = useAo();

    useEffect(() => {
        let load = true;

        (async () => {
            if (!id || id === '') return;

            setLoading(true);
            setTokenInfo(undefined);

            const retry = async (tries = 0) => {
                try {
                    // fetch info
                    const token = await getTokenInfo(id, ao);

                    if (load) setTokenInfo(token);
                } catch {
                    if (tries >= 5) return;
                    await retry(tries + 1);
                }
            };
            await retry();

            setLoading(false);
        })();

        return () => {
            load = false;
        };
    }, [ao, id]);

    return [tokenInfo, loading];
}

/**
 * Result of token info message
 */
export interface TokenInfo {
    id: string;
    Name?: string;
    Ticker?: string;
    Logo?: string;
    Denomination: number;
}

/**
 * Get balance for address
 * @param id ID of the token
 * @param address Target address
 */
export async function getBalance(
    id: string,
    address: string,
    ao: AoInstance
): Promise<number> {
    const res = await ao.dryrun({
        Id: '0000000000000000000000000000000000000000001',
        Owner: address,
        process: id,
        tags: [{ name: 'Action', value: 'Balance' }],
    });

    for (const msg of res.Messages as Message[]) {
        const balance = getTagValue('Balance', msg.Tags);

        if (balance) return Number(balance);
    }

    return 0;
}

/**
 * Token balance hook (integer balance)
 */
export function useBalance(id: string): [number, boolean, RefreshFunction] {
    // balance
    const [balance, setBalance] = useState(0);

    // active address
    const activeAddr = useActiveAddress();

    // loading
    const [loading, setLoading] = useState(true);

    // ao instance
    const ao = useAo();

    /**
     * Load balance
     */
    async function load() {
        if (!activeAddr || !id || id === '') return;
        setLoading(true);

        const retry = async (tries = 0) => {
            try {
                const bal = await getBalance(id, activeAddr, ao);

                setBalance(bal || 0);
            } catch (e) {
                if (tries >= 5) return;
                await retry(tries + 1);
            }
        };
        await retry();

        setLoading(false);
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, activeAddr, ao]);

    return [balance, loading, load];
}

/**
 * Get token total supply
 */
export async function getTotalSupply(id: string, ao: AoInstance) {
    const res = await ao.dryrun({
        Id: '0000000000000000000000000000000000000000001',
        Owner: '0000000000000000000000000000000000000000001',
        process: id,
        tags: [{ name: 'Action', value: 'Total-Supply' }],
    });

    for (const msg of res.Messages as Message[]) {
        const totalSupply = getTagValue('Total-Supply', msg.Tags);
        if (totalSupply) return Number(totalSupply);
    }

    return 0;
}

/**
 * Total supply hook
 */
export function useTotalSupply(id: string): [number, boolean, RefreshFunction] {
    // balance
    const [totalSupply, setTotalSupply] = useState(0);

    // loading
    const [loading, setLoading] = useState(true);

    // ao instance
    const ao = useAo();

    /**
     * Load total supply
     */
    async function load() {
        if (!id || id === '') return;
        setLoading(true);

        const retry = async (tries = 0) => {
            try {
                const res = await getTotalSupply(id, ao);

                setTotalSupply(res);
            } catch (e) {
                if (tries >= 5) return;
                await retry(tries + 1);
            }
        };
        await retry();

        setLoading(false);
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, ao]);

    return [totalSupply, loading, load];
}

/**
 * Token transfer function
 */
export async function transfer(
    data: TransferParams,
    signer: ReturnType<typeof createDataItemSigner>,
    ao: AoInstance
) {
    // execute the transfer
    return await ao.message({
        process: data.token,
        signer,
        tags: [
            { name: 'Action', value: 'Transfer' },
            { name: 'Recipient', value: data.recipient },
            {
                name: 'Quantity',
                value: Math.floor(Number(data.quantity)).toString(),
            },
        ],
    });
}

interface TransferParams {
    token: string;
    quantity: string;
    recipient: string;
}
