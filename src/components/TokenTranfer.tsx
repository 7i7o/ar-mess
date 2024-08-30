import { ComponentProps, useState } from 'react';
import { transfer } from '../ao/token';
import { createDataItemSigner } from '@permaweb/aoconnect';
import { useAo } from '../ao/ao';
import { DEFAULT_RECIPIENT } from '../contexts/config';

export function TokenTransfer({ tokenId }: Props & ComponentProps<'div'>) {
    const ao = useAo();

    const [txId, setTxId] = useState('');
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const handleClick = async () => {
        const signer = createDataItemSigner(window.arweaveWallet);

        const isValidAddress = (input: string) =>
            input.length === 43 && /^[a-zA-Z0-9_-]{43}$/.test(input);

        let recipient = null;

        if (isValidAddress(to)) {
            recipient = to;
        } else {
            const sendToDefault = window.confirm(
                "'To' address is not valid. Send to Default recipient instead?"
            );
            if (!sendToDefault) return;
            recipient = DEFAULT_RECIPIENT;
        }

        const transferId = await transfer(
            {
                token: tokenId,
                quantity: amount,
                recipient,
            },
            signer,
            ao
        );

        setTxId(transferId);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <input
                id="to"
                name="to"
                placeholder="to"
                onChange={(e) => setTo(e.target.value)}
            ></input>
            <input
                id="amount"
                name="amount"
                placeholder="amount"
                onChange={(e) => setAmount(e.target.value)}
            ></input>
            <button onClick={handleClick}>Transfer</button>
            {txId && <div>{txId}</div>}
        </div>
    );
}

export default TokenTransfer;

interface Props {
    tokenId: string;
}
