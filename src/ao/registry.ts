import { createDataItemSigner } from '@permaweb/aoconnect';
import { AoInstance, useAo } from './ao';
import { useEffect, useState } from 'react';

export type RefreshFunction = () => Promise<void>;

/**
 * Get registered key for address
 * @param id ID of the token
 * @param address Target address
 */
export async function getKey(
    id: string,
    address: string,
    ao: AoInstance
): Promise<string> {
    const res = await ao.dryrun({
        Id: '0000000000000000000000000000000000000000001',
        Owner: address,
        process: id,
        tags: [
            { name: 'Action', value: 'Key' },
            { name: 'Target', value: address },
        ],
    });

    if (res.Messages?.length) return res.Messages[0].Data;

    return '';
}

/**
 * Registry key hook (string w/public key)
 */
export function useKey(
    id: string,
    target: string
): [string, boolean, RefreshFunction] {
    // balance
    const [key, setKey] = useState('');

    // loading
    const [loading, setLoading] = useState(false);

    // ao instance
    const ao = useAo();

    /**
     * Load key
     */
    async function load() {
        // const targetAddr = target; // ?? activeAddr;
        if (!target || !id || target === '' || id === '') return;
        setLoading(true);

        const retry = async (tries = 0) => {
            try {
                const key = await getKey(id, target, ao);
                setKey(key || '');
            } catch (e) {
                if (tries >= 3) return;
                await retry(tries + 1);
            }
        };
        await retry();

        setLoading(false);
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, target, ao]); //, activeAddr

    return [key, loading, load];
}

/**
 * Register key function
 */
export async function register(
    data: RegisterParams,
    signer: ReturnType<typeof createDataItemSigner>,
    ao: AoInstance
) {
    // call register in the registry
    return await ao.message({
        process: data.id,
        signer,
        tags: [
            { name: 'Action', value: 'Register' },
            { name: 'Key', value: data.key },
        ],
    });
}

interface RegisterParams {
    id: string;
    key: string;
}

/**
 * Unregister function
 */
export async function unregister(
    data: UnregisterParams,
    signer: ReturnType<typeof createDataItemSigner>,
    ao: AoInstance
) {
    // call unregister in the registry
    return await ao.message({
        process: data.id,
        signer,
        tags: [{ name: 'Action', value: 'Unregister' }],
    });
}

interface UnregisterParams {
    id: string;
}
