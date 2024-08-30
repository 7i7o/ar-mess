/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';

export function DataItemSigner() {
    const [loading, setLoading] = useState(false);
    const [signing, setSigning] = useState(false);
    const [data, setData] = useState('');

    useEffect(() => {
        console.log('Creating data item...');
        setLoading(true);
        let a = '1234567890';
        for (let i = 0; i < 20; i++) a = a + a;
        setData(a);
        setLoading(false);
        console.log(`Data item lentgh: ${a.length}`);
    }, []);

    const signData = async () => {
        console.log('Signing data...');
        setSigning(true);
        // @ts-expect-error "kk"
        const signed = await window.arweaveWallet.signDataItem({ data });
        setSigning(false);
        console.log(`Data signed: ${signed}`);
    };

    return (
        <>
            {loading && <div className="card">Creating data item...</div>}

            {!loading && !signing && (
                <button
                    onClick={() => signData()}
                    disabled={loading || signing}
                >
                    Sign Data Item
                </button>
            )}
        </>
    );
}

export default DataItemSigner;
