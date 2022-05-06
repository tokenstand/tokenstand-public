import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  color: ${({ theme }) => theme.primaryText2};
`;

const ReferralAbout: React.FC = () => {
  return <Wrapper>ReferralAbout works!</Wrapper>;
};

export default ReferralAbout;
