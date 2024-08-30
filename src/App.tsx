import './App.css';
import { ConnectButton, useConnection } from 'arweave-wallet-kit';
import { ArMessenger } from './components/ArMessenger';
import TokenBalance from './components/TokenBalance';
import DataItemSigner from './components/DataItemSigner';
import ArBalance from './components/ArBalance';
import { TOKEN_ID } from './contexts/config';

function App() {
    const { connected, connect } = useConnection();

    return (
        <>
            <ConnectButton
                className="connect-button"
                showBalance={false}
                showProfilePicture={false}
                useAns={false}
            />

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
                    <h2>Arweave Balance</h2>
                    <ArBalance />
                    <br />
                    <h2>AO Token Balance</h2>
                    <TokenBalance tokenId={TOKEN_ID} />
                    <h2>AO Messsenger (soon)</h2>
                    <ArMessenger />
                    <br />
                    <h2>DataItemSigner (test)</h2>
                    <DataItemSigner />
                </>
            )}
        </>
    );
}

export default App;
