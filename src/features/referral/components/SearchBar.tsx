import React, { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import Image from 'next/image';
import styled from 'styled-components';
import { useIsDarkMode } from '../../../state/user/hooks';
import { XIcon } from '@heroicons/react/outline';
// images
const searchIconDark = '/icons/search.svg';
const searchIconLight = '/icons/search-light.svg';

const InputContainer = styled.div`
  grid-area: search-bar;
  justify-self: end;
  display: flex;
  background-color: ${({ theme }) => theme.referralInputBg};
  border: 1.5px solid rgba(114, 191, 101, 0.5);
  border-radius: 8px;
  width: 100%;

  @media screen and (min-width: 768px) {
    width: 413px;
  }

  .icons-group {
    display: flex;
    align-items: center;

    .close-icon {
      width: 0.8rem;
      height: 0.8rem;

      @media screen and (min-width: 768px) {
        width: 1rem;
        height: 1rem;
      }
    }

    .icon-search {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      margin-left: 10px;
      width: 24px;
      height: 24px;
      position: relative;

      @media screen and (min-width: 768px) {
        margin-right: 20px;
        width: 28px;
        height: 28px;
      }
    }
  }
`;

const Input = styled.input`
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.primaryText3};
  padding: 11.5px 0px 11.5px 10px;
  border-radius: 8px;
  width: 100%;
  background-color: ${({ theme }) => theme.referralInputBg};

  @media screen and (min-width: 768px) {
    padding: 20px 32px;
    width: 385px;
    font-size: 17px;
  }
`;

type Props = {
  setSearchTerm: (state: string) => void;
};

const SearchBar: React.FC<Props> = ({ setSearchTerm }) => {
  const [state, setState] = useState('');
  const darkMode = useIsDarkMode();

  const debounceSearchTerm = useCallback(
    debounce((searchTerm) => setSearchTerm(searchTerm), 1000),
    []
  );

  const onClear = () => {
    setState('');
    setSearchTerm('');
  };

  return (
    <InputContainer>
      <Input
        placeholder="Search Wallet"
        darkMode={darkMode}
        onChange={(event) => {
          const value = event.target.value;
          setState(value);
          debounceSearchTerm(value);
        }}
        value={state}
      />

      <div className="icons-group">
        {state && (
          <div
            className="close-icon flex items-center justify-center w-4 h-4 cursor-pointer text-primary hover:text-high-emphesis"
            onClick={onClear}
          >
            <XIcon />
          </div>
        )}

        <div className="icon-search">
          <Image
            src={darkMode ? searchIconDark : searchIconLight}
            alt="search-icon"
            layout="fill"
          />
        </div>
      </div>
    </InputContainer>
  );
};

export default SearchBar;
