import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';

const initialTableOptions = {
  current: 1,
  pageSize: isMobile ? 5 : 10,
  totalPage: 0,
  totalResults: 0,
  itemStart: 1,
  itemEnd: isMobile ? 5 : 10,
};

export interface UserReferralFarm {
  id: string;
  ref_id: string;
  ref_claimed: string;
  total_earned: string;
  createdAt: string;
}

export const useReferralFarmFetch = () => {
  const { account, chainId } = useWeb3React();
  const [userReferralFarmList, setUserReferralFarmList] = useState<UserReferralFarm[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tableOptions, setTableOptions] = useState(initialTableOptions);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchUserReferralFarmList = async (page: number, limit: number, search = '') => {
    try {
      setLoading(true);
      const res = await axios.get(
        'api/claim-reward-referral',
        {
          baseURL: process.env.NEXT_PUBLIC_API_REFERRAL,
          params: {
            userId: account,
            chainId,
            page,
            limit,
            keyword: search
          },
        }
      );

      const referralFarm = res.data;
      if (referralFarm) {
        setUserReferralFarmList(referralFarm.data);
        setTableOptions((prev) => ({
          ...prev,
          totalResults: referralFarm.total,
          totalPage: Math.ceil(referralFarm.total / tableOptions.pageSize),
        }));
      }
      setLoading(false);
    } catch (error) {
      setUserReferralFarmList([]);
      setLoading(false);
    }
  };

  // Search and initial
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }

    setTableOptions((prev) => ({
      ...prev,
      current: 1,
      itemStart: 1,
      itemEnd: prev.pageSize
    }));
    fetchUserReferralFarmList(1, tableOptions.pageSize, searchTerm);
  }, [account, chainId, searchTerm]);

  // Table options
  useEffect(() => {
    if (isInitialLoad) {
      return;
    }

    fetchUserReferralFarmList(tableOptions.current, tableOptions.pageSize, searchTerm);
  }, [account, chainId, tableOptions.current, tableOptions.pageSize]);

  return {
    account,
    chainId,
    tableOptions,
    userReferralFarmList,
    loading,
    setSearchTerm,
    setTableOptions
  };
};
