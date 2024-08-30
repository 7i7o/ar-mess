import { ComponentProps } from 'react';
import { GW } from '../contexts/config';

export default function Token({
    balance,
    ticker,
    logo,
}: Props & ComponentProps<'div'>) {
    return (
        <>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {logo && (
                    <img
                        src={`${GW}/${logo}`}
                        draggable={false}
                        alt="token logo"
                        style={{ width: '2em' }}
                    />
                )}
                {balance} {ticker}
                {/* {formatQuantity(balance)} */}
            </div>
        </>
    );
}

interface Props {
    balance: number;
    ticker?: string;
    logo?: string;
}
