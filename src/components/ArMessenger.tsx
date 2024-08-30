import { useActiveAddress } from 'arweave-wallet-kit';
import { useKey } from '../ao/registry';
import Messenger from './Messenger';
import Register from './Register';
import { AO_ID } from '../contexts/config';

export function ArMessenger() {
    const activeAddress = useActiveAddress();
    const [key, loading] = useKey(AO_ID, activeAddress ?? '');

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
