import { useState } from 'react';
import { DEFAULT_RECIPIENT } from '../contexts/config';
import { getArweave } from '../utils/arweave';
import { useApi } from 'arweave-wallet-kit';

export function ArTokenTransfer() {
    const [txId, setTxId] = useState('');
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const api = useApi();

    const handleClick = async (dispatch = false) => {
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

        // Transfer
        const arweave = getArweave();
        const tx = await arweave.createTransaction({
            target: recipient,
            quantity: amount,
        });

        if (!dispatch) {
            const signedTx = await arweave.transactions.sign(tx);

            const response = await arweave.transactions.post(signedTx);

            console.log(response.status);

            setTxId(tx.id);

            return;
        } else {
            if (!api) {
                window.alert("Couldn't find wallet's API for dispatch");
                return;
            }
            const result = await api.dispatch(tx);
            setTxId(result.id);
        }
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
                placeholder="amount (in Winstons)"
                onChange={(e) => setAmount(e.target.value)}
            ></input>
            <button onClick={() => handleClick()}>Transfer Winstons</button>
            <button onClick={() => handleClick(true)}>
                Transfer Winstons (w/Dispatch)
            </button>
            {txId && <div>{txId}</div>}
        </div>
    );
}

export default ArTokenTransfer;
