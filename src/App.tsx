import './App.css';
import { ConnectButton, useConnection } from 'arweave-wallet-kit';
import { ArMessenger } from './components/ArMessenger';
import logo from './assets/logo.svg';

export const AO_ID = '7MCaTzo1teKUywMvFU_gnr-hAeEmkaM4xMvRRerWUdo';

function App() {
    const { connected, connect } = useConnection();

    return (
        <>
            <ConnectButton className="connect-button" showBalance={false} />
            <img src={logo} alt="Logo" width="100" />
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
            {connected && <ArMessenger />}
        </>
    );
}

export default App;
