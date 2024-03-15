import { ChangeEvent, useState } from 'react';
import './App.css';
// import { message, createDataItemSigner } from "@permaweb/aoconnect";
import { ConnectButton, useConnection } from 'arweave-wallet-kit';

function App() {
    const [messageData, setMessageData] = useState('');
    const [recipient, setRecipient] = useState('');
    const [sending, setSending] = useState(false);
    const { connected, connect } = useConnection();

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
            <ConnectButton className="connect-button" showBalance={false} />

            <h1>Arweave Messenger</h1>
            {!connected && (
                <>
                    <p>
                        To send messages you first need to{' '}
                        <button onClick={connect} className="small-button">
                            connect
                        </button>
                    </p>
                </>
            )}
            {connected && (
                <>
                    <div>
                        <label>
                            To:
                            <input
                                type="text"
                                placeholder="Wallet"
                                value={recipient}
                                onChange={handleRecipientChange}
                            ></input>
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
                            ></input>
                        </label>
                    </div>
                    <div className="card">
                        <button
                            onClick={() => sendMessage()}
                            disabled={sending}
                        >
                            Send message
                        </button>
                    </div>
                </>
            )}
        </>
    );
}

export default App;
