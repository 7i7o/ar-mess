import { ChangeEvent, useEffect, useState } from 'react';
import { useKey } from '../ao/registry';
import { AO_ID } from '../contexts/config';

export function Messenger() {
    const [recipient, setRecipient] = useState('');
    const [showAddressNotice, setShowAddressNotice] = useState(false);

    const [messageData, setMessageData] = useState('');

    const [recipientAddress, setRecipientAddress] = useState('');
    const [recipientKey, loading] = useKey(AO_ID, recipientAddress);

    function isValidAddress(str: string): boolean {
        return str.length === 43 && /^[a-zA-Z0-9-_]+$/.test(str);
    }

    useEffect(() => {
        if (!recipient || !isValidAddress(recipient)) {
            setShowAddressNotice(recipient ? true : false);
            return;
        }

        setShowAddressNotice(false);
        setRecipientAddress(recipient);
    }, [recipient]);

    const [sending, setSending] = useState(false);

    const handleRecipientChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRecipient(event.target.value);
    };

    const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessageData(event.target.value);
    };

    const sendMessage = async () => {
        setSending(true);
        // Not Working:
        // await message({
        //   process: recipient,
        //   tags: [{ name: "App-Name", value: "Ar-Messenger" }],
        //   signer: createDataItemSigner(window.arweaveWallet),
        //   data: messageData,
        // })
        //   .then(console.log)
        //   .catch(console.error);
        alert(`Sending message to ${recipient}: ${messageData}`);
        // Resetting the input fields after sending the message
        setRecipient('');
        setMessageData('');
    };

    return (
        <>
            <div>
                <label>
                    To:
                    <input
                        type="text"
                        placeholder="Wallet"
                        value={recipient}
                        onChange={handleRecipientChange}
                        disabled={loading}
                    ></input>
                    <br />
                    <span className="addressInputNotice">
                        {showAddressNotice && (
                            <>Must be a valid Arweave address</>
                        )}
                    </span>
                </label>
            </div>
            <div>
                <label>
                    Message:
                    <input
                        type="text"
                        placeholder="Message"
                        value={messageData}
                        onChange={handleMessageChange}
                        disabled={
                            !recipientKey ||
                            !isValidAddress(recipient) ||
                            sending
                        }
                    ></input>
                </label>
            </div>
            <div className="card">
                <button
                    onClick={() => sendMessage()}
                    disabled={
                        !recipientKey || !isValidAddress(recipient) || sending
                    }
                >
                    Send message
                </button>
            </div>
        </>
    );
}

export default Messenger;
