import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ArweaveWalletKit } from 'arweave-wallet-kit';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ArweaveWalletKit
            config={{
                permissions: [
                    'ACCESS_ADDRESS',
                    'ACCESS_ALL_ADDRESSES',
                    'ACCESS_PUBLIC_KEY',
                    'DISPATCH',
                    'SIGN_TRANSACTION',
                ],
                ensurePermissions: true,
            }}
        >
            <App />
        </ArweaveWalletKit>
    </React.StrictMode>
);
