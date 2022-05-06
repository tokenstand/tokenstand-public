import React from 'react';
import styled from 'styled-components';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';

const TabListStyled = styled(TabList)`
  margin: 0;

  .react-tabs__tab {
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.primaryText2};
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: 8px 8px 0px 0px;

    @media screen and (min-width: 768px) {
      padding: 20px 32px;
      font-size: 17px;
    }

    &--selected {
      background: #72BF65;
      color: rgba(255, 255, 255, 0.87);
    }

    &:focus:after {
      display: none;
    }
  }
`;

type Props = {
  tabIndex: number;
  onTabSelect: (index: number) => void;
};

const TabsReferral: React.FC<Props> = ({tabIndex, onTabSelect, children}) => {
  return (
    <Tabs selectedIndex={tabIndex} onSelect={index => onTabSelect(index)}>
      <TabListStyled>
        <Tab>Referral List</Tab>
        <Tab>Farm</Tab>
        <Tab>About</Tab>
      </TabListStyled>
      <TabPanel></TabPanel>
      <TabPanel></TabPanel>
      <TabPanel></TabPanel>
    </Tabs>
  );
};

export default TabsReferral;