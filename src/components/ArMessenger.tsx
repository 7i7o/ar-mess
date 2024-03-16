import { useActiveAddress } from 'arweave-wallet-kit';
import { AO_ID } from '../App';
import { useKey } from '../ao/registry';
import Messenger from './Messenger';
import Register from './Register';

export function ArMessenger() {
    const activeaAddress = useActiveAddress();
    const [key, loading] = useKey(AO_ID, activeaAddress ?? '');

    return (
        <>
            {loading && <div className="card">Loading...</div>}

            {!loading && !key && (
                <div className="card">
                    You need to <Register /> first!
                </div>
            )}
            {!loading && key && <Messenger />}
        </>
    );
}

export default ArMessenger;
