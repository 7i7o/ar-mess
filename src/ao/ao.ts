import { ConfigContext, defaultConfig } from '../contexts/config';
// import { type Tag } from 'arweave/web/lib/transaction';
import { connect } from '@permaweb/aoconnect';
import { useContext, useMemo } from 'react';

export function useAo() {
    // config
    const [config] = useContext(ConfigContext);

    // ao instance
    const ao = useMemo(() => connect(config || defaultConfig), [config]);

    return ao;
}

/**
 * ao connect() instance
 */
export type AoInstance = ReturnType<typeof connect>;

/**
 * Returned message object(s) from dryRun
 */
// export interface Message {
//   Anchor: string;
//   Tags: Tag[];
//   Target: string;
//   Data: string;
// }
