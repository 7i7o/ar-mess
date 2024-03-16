import { createContext } from 'react';

export interface Config {
    CU_URL: string;
    MU_URL: string;
    GATEWAY_URL: string;
}

export const defaultConfig: Config = {
    CU_URL: 'https://cu.ao-testnet.xyz',
    MU_URL: 'https://mu.ao-testnet.xyz',
    GATEWAY_URL: 'https://g8way.io:443',
};

export const ConfigContext = createContext<[Config, (val: Config) => void]>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [] as any
);

// export const STORAGE_KEY = "BARK_CONFIG";

export function gatewayFromURL(url: string): Gateway {
    const gatewayURL = new URL(url);

    return {
        host: gatewayURL.host,
        port: gatewayURL.port === '' ? '443' : gatewayURL.port,
        protocol: gatewayURL.protocol.replace(':', ''),
    };
}

export interface Gateway {
    host: string;
    port: string;
    protocol: string;
}
