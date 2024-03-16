import { useState } from 'react';
import { createDataItemSigner, message } from '@permaweb/aoconnect';
import { usePublicKey } from 'arweave-wallet-kit';
import { AO_ID } from '../App';

export function Register() {
    const publicKey = usePublicKey();

    const [sending, setSending] = useState(false);

    const handleClick = async () => {
        console.log('Public Key: ', publicKey);
        if (!publicKey) return;

        confirm(`Confirm registering for ArMessenger`);

        setSending(true);
        // Not Working:
        await message({
            process: AO_ID,
            tags: [
                { name: 'App-Name', value: 'Ar-Messenger' },
                { name: 'Action', value: 'Register' },
                { name: 'Key', value: publicKey },
            ],
            signer: createDataItemSigner(window.arweaveWallet),
        })
            .then(console.log)
            .catch(console.error);
    };

    return (
        <button onClick={() => handleClick()} disabled={sending}>
            Register
        </button>
    );
}

export default Register;
