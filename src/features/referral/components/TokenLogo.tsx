import { ChainId } from '@sushiswap/sdk';
import React from 'react';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { useCurrencyChain } from '../../../hooks/Tokens';
import { renderImages } from '../../exchange/RoutingHeadItem';

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-left: 8px;
  }
`;

type Props = {
  tokenAddress: string;
  chainId: ChainId;
};

const TokenLogo: React.FC<Props> = ({ tokenAddress, chainId }) => {
  const token = useCurrencyChain(tokenAddress, chainId);

  return (
    <Wrapper>
      {renderImages(token?.symbol.toLowerCase(), token?.symbol, token, 32, 32)}
      {!isMobile && <span>{token?.symbol}</span> || null}
    </Wrapper>
  );
};

export default TokenLogo;
