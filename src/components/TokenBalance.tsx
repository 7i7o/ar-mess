import { ComponentProps } from 'react';
import { useBalance, useTokenInfo } from '../ao/token';
import Token from './Token';
import TokenTransfer from './TokenTranfer';

export function TokenBalance({ tokenId }: Props & ComponentProps<'div'>) {
    const [tokenInfo, loadingInfo] = useTokenInfo(tokenId);
    const [balance, loadingBalance] = useBalance(tokenId);

    if (loadingInfo) return <div className="card">Loading Token Info...</div>;

    if (!tokenInfo)
        return (
            <div className="card">
                Token with Id '{tokenId}' didn't return any info
            </div>
        );

    return (
        <>
            <Token
                ticker={tokenInfo.Ticker}
                logo={tokenInfo.Logo}
                balance={loadingBalance ? 0 : balance}
            />
            {balance && <TokenTransfer tokenId={tokenId} />}
        </>
    );
}

export default TokenBalance;

interface Props {
    tokenId: string;
}
