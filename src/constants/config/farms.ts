import { ChainId } from "@sushiswap/sdk";
import { useChainId } from "../../hooks";
import { MASTER_CHEF, MASTER_CHEF_V2 } from "../addresses";
import { FarmTypeEnum } from "../farm-type";

// token : token0
// quoteToken: token1


const farmsRinkeby = [
	/**
	 * Farm inactive
	 */
	{
		pid: 0,
		network: 4,
		startDate: 0,
		endDate: 0,
		isActive: false,
		singleFarm: true,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			4: '0xd43bbd34A9344F29642Fd5323835f806A445C238'
		},

		lpAddressStandVsQuote: {
			4: '0xd43bbd34A9344F29642Fd5323835f806A445C238'
		},
		farmAddress: {
			4: MASTER_CHEF[4]
		},
		pair: {
			id: '0xd43bbd34A9344F29642Fd5323835f806A445C238',
			token: {
				symbol: 'STAND',
				id: '0x9627D4E043aA4112BB3f6fAa957605565CC2650c',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'ETH',
				id: '0x0000000000000000000000000000000000000000',
				decimals: 18,
				earning: false,
			}
		},
		type: FarmTypeEnum.LP
	},
	/**
	 * Farm LP STAND-ETH
	 */
	// {
	// 	pid: 1,
	// 	network: 4,
	// 	startDate: 0,
	// 	endDate: 0,
	// 	isActive: true,
	// 	singleFarm: true,
	// 	standEarning: true,
	// 	lpTokenAddress: {
	// 		decimals: 18,
	// 		4: '0x9627D4E043aA4112BB3f6fAa957605565CC2650c',
	// 	},

	// 	farmAddress: {
	// 		4: MASTER_CHEF[4]
	// 	},
	// 	pair: {
	// 		id: '0x9627D4E043aA4112BB3f6fAa957605565CC2650c',
	// 		token: {
	// 			symbol: 'STAND',
	// 			id: '0x9627D4E043aA4112BB3f6fAa957605565CC2650c',
	// 			decimals: 18,
	// 			earning: false,
	// 			// amountPerMonth: 20: unlimited token
	// 		},

	// 		quoteToken: {
	// 			symbol: 'STAND',
	// 			id: '0x9627D4E043aA4112BB3f6fAa957605565CC2650c',
	// 			decimals: 18,
	// 			earning: false,
	// 		}
	// 	},
	// 	type: FarmTypeEnum.TOKEN
	// },
	{
		pid: 4,
		network: 4,
		startDate: 0,
		endDate: 0,
		isActive: false,
		singleFarm: true,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			4: '0x48cD7bC2342605F7131D89E4da80dF88E763Bbc5'
		},
		lpAddressStandVsQuote: {
			4: '0x48cD7bC2342605F7131D89E4da80dF88E763Bbc5',
			decimals: 18,
		},
		farmAddress: {
			4: MASTER_CHEF[4]
		},
		pair: {
			id: '0x48cD7bC2342605F7131D89E4da80dF88E763Bbc5',
			token: {
				symbol: 'STAND',
				id: '0x9627D4E043aA4112BB3f6fAa957605565CC2650c',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'USDT',
				id: '0xd35d2e839d888d1cDBAdef7dE118b87DfefeD20e',
				decimals: 6,
				earning: false,
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 5,
		network: 4,
		startDate: 0,
		endDate: 0,
		isActive: false,
		singleFarm: true,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			4: '0x88f76E1C689985456751248a44EC384649bed623'
		},

		lpAddressStandVsQuote: {
			4: '0x88f76E1C689985456751248a44EC384649bed623',
			decimals: 18,
		},
		farmAddress: {
			4: MASTER_CHEF[4]
		},
		pair: {
			id: '0x88f76E1C689985456751248a44EC384649bed623',
			token: {
				symbol: 'STAND',
				id: '0x9627D4E043aA4112BB3f6fAa957605565CC2650c',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'DAI',
				id: '0x6158864304e969B6d4daACb8f2e3bC5B76c03959',
				decimals: 18,
				earning: false,
			}
		},
		type: FarmTypeEnum.LP
	},
	/**
	 * Farm active
	 */
	{
		pid: 0,
		network: 4,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: true,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			4: '0xbeEF6b786f1d5B798c6e50A134601df898b3DD81'
		},
		lpAddressStandVsQuote: {
			4: '0x48cD7bC2342605F7131D89E4da80dF88E763Bbc5',
			decimals: 18,
		},
		farmAddress: {
			4: MASTER_CHEF_V2[4]
		},
		pair: {
			id: '0xbeEF6b786f1d5B798c6e50A134601df898b3DD81',
			token: {
				symbol: 'ETH',
				id: '0x0000000000000000000000000000000000000000',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'USDT',
				id: '0xd35d2e839d888d1cDBAdef7dE118b87DfefeD20e',
				decimals: 6,
				earning: false,
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 1,
		network: 4,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: true,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			4: '0xd43bbd34A9344F29642Fd5323835f806A445C238'
		},

		lpAddressStandVsQuote: {
			4: '0xd43bbd34A9344F29642Fd5323835f806A445C238',
			decimals: 18,
		},
		farmAddress: {
			4: MASTER_CHEF_V2[4]
		},
		pair: {
			id: '0xd43bbd34A9344F29642Fd5323835f806A445C238',
			token: {
				symbol: 'STAND',
				id: '0x9627D4E043aA4112BB3f6fAa957605565CC2650c',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'ETH',
				id: '0x0000000000000000000000000000000000000000',
				decimals: 18,
				earning: false,
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 2,
		network: 4,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: true,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			4: '0x48cD7bC2342605F7131D89E4da80dF88E763Bbc5'
		},

		lpAddressStandVsQuote: {
			4: '0x48cD7bC2342605F7131D89E4da80dF88E763Bbc5',
			decimals: 18,
		},
		farmAddress: {
			4: MASTER_CHEF_V2[4]
		},
		pair: {
			id: '0x48cD7bC2342605F7131D89E4da80dF88E763Bbc5',
			token: {
				symbol: 'STAND',
				id: '0x9627D4E043aA4112BB3f6fAa957605565CC2650c',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'USDT',
				id: '0xd35d2e839d888d1cDBAdef7dE118b87DfefeD20e',
				decimals: 6,
				earning: false,
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 3,
		network: 4,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: true,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			4: '0x9627D4E043aA4112BB3f6fAa957605565CC2650c',
		},

		farmAddress: {
			4: MASTER_CHEF_V2[4]
		},
		pair: {
			id: '0x9627D4E043aA4112BB3f6fAa957605565CC2650c',
			token: {
				symbol: 'STAND',
				id: '0x9627D4E043aA4112BB3f6fAa957605565CC2650c',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'STAND',
				id: '0x9627D4E043aA4112BB3f6fAa957605565CC2650c',
				decimals: 18,
				earning: false,
			}
		},
		type: FarmTypeEnum.TOKEN
	},
	{
		pid: 5,
		network: 4,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: false,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			4: '0xce58d81acc1f0ab34da92351d625c325b4947f4b'
		},

		lpAddressStandVsQuote: {
			4: '0xce58d81acc1f0ab34da92351d625c325b4947f4b',
			decimals: 18,
		},
		farmAddress: {
			4: MASTER_CHEF_V2[4]
		},
		pair: {
			id: '0xce58d81acc1f0ab34da92351d625c325b4947f4b',
			token: {
				symbol: 'STAND',
				id: '0x9627D4E043aA4112BB3f6fAa957605565CC2650c',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'DAI',
				id: '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735',
				decimals: 18,
				earning: true,
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 6,
		network: 4,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: false,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			4: '0x408235Af9Ac0dcbf07812AA7F7Aad40A5CDc3845'
		},

		lpAddressStandVsQuote: {
			4: '0x408235Af9Ac0dcbf07812AA7F7Aad40A5CDc3845',
			decimals: 18,
		},
		farmAddress: {
			4: MASTER_CHEF_V2[4]
		},
		pair: {
			id: '0x408235Af9Ac0dcbf07812AA7F7Aad40A5CDc3845',
			token: {
				symbol: 'LINK',
				id: '0x01be23585060835e02b77ef475b0cc51aa1e0709',
				decimals: 18,
				earning: true,
			},
			quoteToken: {
				symbol: 'STAND',
				id: '0x9627D4E043aA4112BB3f6fAa957605565CC2650c',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 7,
		network: 4,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: false,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			4: '0xd58aed43E45B4Cb999986D84b62605eB7D0c87e7'
		},

		lpAddressStandVsQuote: {
			4: '0xd58aed43E45B4Cb999986D84b62605eB7D0c87e7',
			decimals: 18,
		},
		farmAddress: {
			4: MASTER_CHEF_V2[4]
		},
		pair: {
			id: '0xd58aed43E45B4Cb999986D84b62605eB7D0c87e7',
			token: {
				symbol: 'WBTC',
				id: '0x577D296678535e4903D59A4C929B718e1D575e0A',
				decimals: 8,
				earning: true,
			},

			quoteToken: {
				symbol: 'STAND',
				id: '0x9627D4E043aA4112BB3f6fAa957605565CC2650c',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},	
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 8,
		network: 4,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: false,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			4: '0xd58aed43E45B4Cb999986D84b62605eB7D0c87e7'
		},

		lpAddressStandVsQuote: {
			4: '0xd58aed43E45B4Cb999986D84b62605eB7D0c87e7',
			decimals: 18,
		},
		farmAddress: {
			4: MASTER_CHEF_V2[4]
		},
		pair: {
			id: '0xd58aed43E45B4Cb999986D84b62605eB7D0c87e7',
			token: {
				symbol: 'WBTC',
				id: '0x577D296678535e4903D59A4C929B718e1D575e0A',
				decimals: 8,
				earning: true,
			},

			quoteToken: {
				symbol: 'STAND',
				id: '0x9627D4E043aA4112BB3f6fAa957605565CC2650c',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},	
		},
		type: FarmTypeEnum.LP
	},
]

const farmsBscTest = [
	{
		pid: 0,
		network: 97,
		startDate: 0,
		endDate: 0,
		singleFarm: true,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			97: '0xa32E4ff0f957382444B04343f3bB4d0D851604FA'
		},
		farmAddress: {
			97: MASTER_CHEF[97]
		},
		pair: {
			id: '0xa32E4ff0f957382444B04343f3bB4d0D851604FA',
			token: {
				symbol: 'STAND',
				id: '0xfb8cBD02fc2ff229712169424c743Cf846A115D2',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'BNB',
				id: '0x0000000000000000000000000000000000000000',
				decimals: 18,
				earning: false,
				// amountPerMonth: 10000000
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 1,
		network: 97,
		startDate: 0,
		endDate: 0,
		singleFarm: true,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			97: '0x20D244953C7919c5e863732Cfe8C763e513c150B'
		},
		farmAddress: {
			97: MASTER_CHEF[97]
		},
		pair: {
			id: '0x20D244953C7919c5e863732Cfe8C763e513c150B',
			token: {
				symbol: 'STAND',
				id: '0xfb8cBD02fc2ff229712169424c743Cf846A115D2',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'USDT',
				id: '0x14ec6EE23dD1589ea147deB6c41d5Ae3d6544893',
				decimals: 6,
				earning: false,
				// amountPerMonth: 10000000
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 2,
		network: 97,
		startDate: 0,
		endDate: 0,
		singleFarm: true,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			97: '0xfb8cBD02fc2ff229712169424c743Cf846A115D2'
		},
		farmAddress: {
			97: MASTER_CHEF[97]
		},
		pair: {
			id: '0xfb8cBD02fc2ff229712169424c743Cf846A115D2',
			token: {
				symbol: 'STAND',
				id: '0xfb8cBD02fc2ff229712169424c743Cf846A115D2',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'STAND',
				id: '0xfb8cBD02fc2ff229712169424c743Cf846A115D2',
				decimals: 18,
				earning: false,
				// amountPerMonth: 10000000
			}
		},
		type: FarmTypeEnum.TOKEN
	},
	{
		pid: 0,
		network: 97,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: true,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			97: '0xEBA2dd2c671cbe1E2F8648fE26400366e90F9235'
		},
		farmAddress: {
			97: MASTER_CHEF_V2[97]
		},
		pair: {
			id: '0xEBA2dd2c671cbe1E2F8648fE26400366e90F9235',
			token: {
				symbol: 'BNB',
				id: '0x0000000000000000000000000000000000000000',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},
			quoteToken: {
				symbol: 'USDT',
				id: '0x14ec6EE23dD1589ea147deB6c41d5Ae3d6544893',
				decimals: 6,
				earning: false,
				// amountPerMonth: 10000000
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 1,
		network: 97,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: true,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			97: '0xa32E4ff0f957382444B04343f3bB4d0D851604FA'
		},
		farmAddress: {
			97: MASTER_CHEF_V2[97]
		},
		pair: {
			id: '0xa32E4ff0f957382444B04343f3bB4d0D851604FA',
			token: {
				symbol: 'STAND',
				id: '0xfb8cBD02fc2ff229712169424c743Cf846A115D2',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},
			quoteToken: {
				symbol: 'BNB',
				id: '0x0000000000000000000000000000000000000000',
				decimals: 18,
				earning: false,
				// amountPerMonth: 10000000
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 2,
		network: 97,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: true,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			97: '0xa32E4ff0f957382444B04343f3bB4d0D851604FA'
		},
		farmAddress: {
			97: MASTER_CHEF_V2[97]
		},
		pair: {
			id: '0xa32E4ff0f957382444B04343f3bB4d0D851604FA',
			token: {
				symbol: 'STAND',
				id: '0xfb8cBD02fc2ff229712169424c743Cf846A115D2',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'USDT',
				id: '0x14ec6EE23dD1589ea147deB6c41d5Ae3d6544893',
				decimals: 6,
				earning: false,
				// amountPerMonth: 10000000
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 3,
		network: 97,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: true,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			97: '0xfb8cBD02fc2ff229712169424c743Cf846A115D2'
		},
		farmAddress: {
			97: MASTER_CHEF_V2[97]
		},
		pair: {
			id: '0xfb8cBD02fc2ff229712169424c743Cf846A115D2',
			token: {
				symbol: 'STAND',
				id: '0xfb8cBD02fc2ff229712169424c743Cf846A115D2',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},
			quoteToken: {
				symbol: 'STAND',
				id: '0xfb8cBD02fc2ff229712169424c743Cf846A115D2',
				decimals: 18,
				earning: false,
				// amountPerMonth: 10000000
			}
		},
		type: FarmTypeEnum.TOKEN
	},
	{
		pid: 4,
		network: 97,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: false,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			97: '0x20D244953C7919c5e863732Cfe8C763e513c150B'
		},

		lpAddressStandVsQuote: {
			97: '0x20D244953C7919c5e863732Cfe8C763e513c150B',
			decimals: 18,
		},
		farmAddress: {
			97: MASTER_CHEF_V2[97]
		},
		pair: {
			id: '0x20D244953C7919c5e863732Cfe8C763e513c150B',
			token: {
				symbol: 'USDT',
				id: '0x14ec6EE23dD1589ea147deB6c41d5Ae3d6544893',
				decimals: 18,
				earning: true,
			},

			quoteToken: {
				symbol: 'STAND',
				id: '0xfb8cBD02fc2ff229712169424c743Cf846A115D2',
				decimals: 18,
				earning: true,
				// amountPerMonth: 20: unlimited token
			},	
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 5,
		network: 97,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: false,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			97: '0x20D244953C7919c5e863732Cfe8C763e513c150B'
		},

		lpAddressStandVsQuote: {
			97: '0x20D244953C7919c5e863732Cfe8C763e513c150B',
			decimals: 18,
		},
		farmAddress: {
			97: MASTER_CHEF_V2[97]
		},
		pair: {
			id: '0x20D244953C7919c5e863732Cfe8C763e513c150B',
			token: {
				symbol: 'USDT',
				id: '0x14ec6EE23dD1589ea147deB6c41d5Ae3d6544893',
				decimals: 18,
				earning: true,
			},

			quoteToken: {
				symbol: 'STAND',
				id: '0xfb8cBD02fc2ff229712169424c743Cf846A115D2',
				decimals: 18,
				earning: true,
				// amountPerMonth: 20: unlimited token
			},	
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 6,
		network: 97,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: false,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			97: '0xC66DF3130396f224A8974614B5Fe009f9c0D40d4'
		},

		lpAddressStandVsQuote: {
			97: '0xC66DF3130396f224A8974614B5Fe009f9c0D40d4',
			decimals: 18,
		},
		farmAddress: {
			97: MASTER_CHEF_V2[97]
		},
		pair: {
			id: '0xC66DF3130396f224A8974614B5Fe009f9c0D40d4',
			token: {
				symbol: 'XWIN',
				id: '0xf1e0239366c24368d2670864f0f9abb8e5f61a87',
				decimals: 18,
				earning: true,
			},

			quoteToken: {
				symbol: 'STAND',
				id: '0xfb8cbd02fc2ff229712169424c743cf846a115d2',
				decimals: 18,
				earning: true,
				// amountPerMonth: 20: unlimited token
			},	
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 7,
		network: 97,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: false,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			97: '0x3E68394F270939fc04dfEe5E212809ED7763ca33'
		},

		lpAddressStandVsQuote: {
			97: '0x3E68394F270939fc04dfEe5E212809ED7763ca33',
			decimals: 18,
		},
		farmAddress: {
			97: MASTER_CHEF_V2[97]
		},
		pair: {
			id: '0x3E68394F270939fc04dfEe5E212809ED7763ca33',
			token: {
				symbol: 'XWIN',
				id: '0xc19a6dd29ae0592c93ac4791b59af81c0ff322ed',
				decimals: 18,
				earning: true,
				tokenPerYear: 72000
			},

			quoteToken: {
				symbol: 'STAND',
				id: '0xfb8cBD02fc2ff229712169424c743Cf846A115D2',
				decimals: 18,
				earning: true,
				// amountPerMonth: 20: unlimited token
			},	
		},
		type: FarmTypeEnum.LP
	},
];

const farmsEthereum = [

	/**
	 * Farms inactive
	 */
	{
		pid: 0,
		network: 1,
		startDate: 0,
		endDate: 0,
		isActive: false,
		singleFarm: true,
		standEarning: true,
		lpAddressStandVsQuote: {
			1: '0xEF49C066489be11981E7146454C2B356d1532781'
		},
		lpTokenAddress: {
			decimals: 18,
			1: '0xeC1AD81B0D7AB0479d96252da870b25C1821FB88'
		},
		farmAddress: {
			1: '0x4d3149D6c506F08F8eA5B099aE4c4dbDF4df7489'
		},
		pair: {
			id: '0xeC1AD81B0D7AB0479d96252da870b25C1821FB88',
			token: {
				symbol: 'ETH',
				id: '0x0000000000000000000000000000000000000000',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'USDT',
				id: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
				decimals: 6,
				earning: false,
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 1,
		network: 1,
		startDate: 0,
		endDate: 0,
		isActive: false,
		singleFarm: true,
		standEarning: true,
		lpAddressStandVsQuote: {
			1: '0xD43487DBEd7658Ef1b1aa7d5B5497C2C0De51B38'
		},
		lpTokenAddress: {
			decimals: 18,
			1: '0xD43487DBEd7658Ef1b1aa7d5B5497C2C0De51B38'
		},
		farmAddress: {
			1: '0x4d3149D6c506F08F8eA5B099aE4c4dbDF4df7489'
		},
		pair: {
			id: '0xD43487DBEd7658Ef1b1aa7d5B5497C2C0De51B38',
			token: {
				symbol: 'STAND',
				id: '0x26D0Ee7d0FAD46b0DEb495Fa09e283151438c102',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'ETH',
				id: '0x0000000000000000000000000000000000000000',
				decimals: 18,
				earning: false,
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 2,
		network: 1,
		startDate: 0,
		endDate: 0,
		isActive: false,
		singleFarm: true,
		standEarning: true,
		lpAddressStandVsQuote: {
			1: '0xEF49C066489be11981E7146454C2B356d1532781'
		},
		lpTokenAddress: {
			decimals: 18,
			1: '0xEF49C066489be11981E7146454C2B356d1532781'
		},
		farmAddress: {
			1: '0x4d3149D6c506F08F8eA5B099aE4c4dbDF4df7489'
		},
		pair: {
			id: '0xEF49C066489be11981E7146454C2B356d1532781',
			token: {
				symbol: 'STAND',
				id: '0x26D0Ee7d0FAD46b0DEb495Fa09e283151438c102',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'USDT',
				id: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
				decimals: 6,
				earning: false,
			}
		},
		type: FarmTypeEnum.LP
	},
	/**
	 * Farms active
	 */
	{
		pid: 0,
		network: 1,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: true,
		standEarning: true,
		lpAddressStandVsQuote: {
			1: '0xEF49C066489be11981E7146454C2B356d1532781'
		},
		lpTokenAddress: {
			decimals: 18,
			1: '0xeC1AD81B0D7AB0479d96252da870b25C1821FB88'
		},
		farmAddress: {
			[ChainId.MAINNET]: MASTER_CHEF_V2[ChainId.MAINNET]
		},
		pair: {
			id: '0xeC1AD81B0D7AB0479d96252da870b25C1821FB88',
			token: {
				symbol: 'ETH',
				id: '0x0000000000000000000000000000000000000000',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'USDT',
				id: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
				decimals: 6,
				earning: false,
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 1,
		network: 1,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: true,
		standEarning: true,
		lpAddressStandVsQuote: {
			1: '0xD43487DBEd7658Ef1b1aa7d5B5497C2C0De51B38'
		},
		lpTokenAddress: {
			decimals: 18,
			1: '0xD43487DBEd7658Ef1b1aa7d5B5497C2C0De51B38'
		},
		farmAddress: {
			[ChainId.MAINNET]: MASTER_CHEF_V2[ChainId.MAINNET]
		},
		pair: {
			id: '0xD43487DBEd7658Ef1b1aa7d5B5497C2C0De51B38',
			token: {
				symbol: 'STAND',
				id: '0x26D0Ee7d0FAD46b0DEb495Fa09e283151438c102',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'ETH',
				id: '0x0000000000000000000000000000000000000000',
				decimals: 18,
				earning: false,
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 2,
		network: 1,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: true,
		standEarning: true,
		lpAddressStandVsQuote: {
			1: '0xEF49C066489be11981E7146454C2B356d1532781'
		},
		lpTokenAddress: {
			decimals: 18,
			1: '0xEF49C066489be11981E7146454C2B356d1532781'
		},
		farmAddress: {
			[ChainId.MAINNET]: MASTER_CHEF_V2[ChainId.MAINNET]
		},
		pair: {
			id: '0xEF49C066489be11981E7146454C2B356d1532781',
			token: {
				symbol: 'STAND',
				id: '0x26D0Ee7d0FAD46b0DEb495Fa09e283151438c102',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'USDT',
				id: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
				decimals: 6,
				earning: false,
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 3,
		network: ChainId.MAINNET,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: true,
		standEarning: true,
		lpAddressStandVsQuote: {
			[ChainId.MAINNET]: '0x26D0Ee7d0FAD46b0DEb495Fa09e283151438c102'
		},
		lpTokenAddress: {
			decimals: 18,
			[ChainId.MAINNET]: '0x26D0Ee7d0FAD46b0DEb495Fa09e283151438c102'
		},
		farmAddress: {
			[ChainId.MAINNET]: MASTER_CHEF_V2[ChainId.MAINNET]
		},
		pair: {
			id: '0x26D0Ee7d0FAD46b0DEb495Fa09e283151438c102',
			token: {
				symbol: 'STAND',
				id: '0x26D0Ee7d0FAD46b0DEb495Fa09e283151438c102',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'STAND',
				id: '0x26D0Ee7d0FAD46b0DEb495Fa09e283151438c102',
				decimals: 18,
				earning: false,
			}
		},
		type: FarmTypeEnum.TOKEN
	}
]

const farmsBsc = [

	/**
	 * Farms inactive
	 */
	{
		pid: 0,
		network: 56,
		startDate: 0,
		endDate: 0,
		isActive: false,
		singleFarm: true,
		standEarning: true,
		lpAddressStandVsQuote: {
			56: '0xef49c066489be11981e7146454c2b356d1532781'
		},
		lpTokenAddress: {
			decimals: 18,
			56: '0xeC1AD81B0D7AB0479d96252da870b25C1821FB88'
		},
		farmAddress: {
			56: '0x5316965bB0753247817A780eE779A822ceE11576'
		},
		pair: {
			id: '0xeC1AD81B0D7AB0479d96252da870b25C1821FB88',
			token: {
				symbol: 'BNB',
				id: '0x0000000000000000000000000000000000000000',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'USDT',
				id: '0x55d398326f99059ff775485246999027b3197955',
				decimals: 18,
				earning: false,
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 1,
		network: 56,
		startDate: 0,
		endDate: 0,
		isActive: false,
		singleFarm: true,
		standEarning: true,
		lpAddressStandVsQuote: {
			56: '0xD43487DBEd7658Ef1b1aa7d5B5497C2C0De51B38'
		},
		lpTokenAddress: {
			decimals: 18,
			56: '0xD43487DBEd7658Ef1b1aa7d5B5497C2C0De51B38'
		},
		farmAddress: {
			56: '0x5316965bB0753247817A780eE779A822ceE11576'
		},
		pair: {
			id: '0xD43487DBEd7658Ef1b1aa7d5B5497C2C0De51B38',
			token: {
				symbol: 'STAND',
				id: '0xd52aC302aADE798142C5AA11739FaD4f3de39755',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'BNB',
				id: '0x0000000000000000000000000000000000000000',
				decimals: 18,
				earning: false,
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 2,
		network: 56,
		startDate: 0,
		endDate: 0,
		isActive: false,
		singleFarm: true,
		standEarning: true,
		lpAddressStandVsQuote: {
			56: '0xEF49C066489be11981E7146454C2B356d1532781'
		},
		lpTokenAddress: {
			decimals: 18,
			56: '0xEF49C066489be11981E7146454C2B356d1532781'
		},
		farmAddress: {
			56: '0x5316965bB0753247817A780eE779A822ceE11576'
		},
		pair: {
			id: '0xEF49C066489be11981E7146454C2B356d1532781',
			token: {
				symbol: 'STAND',
				id: '0xd52aC302aADE798142C5AA11739FaD4f3de39755',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'USDT',
				id: '0x55d398326f99059ff775485246999027b3197955',
				decimals: 18,
				earning: false,
			}
		},
		type: FarmTypeEnum.LP
	},
	/**
	 * Farm active
	 */

	{
		pid: 0,
		network: ChainId.BSC,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: true,
		standEarning: true,
		lpAddressStandVsQuote: {
			[ChainId.BSC]: '0xef49c066489be11981e7146454c2b356d1532781'
		},
		lpTokenAddress: {
			decimals: 18,
			[ChainId.BSC]: '0xeC1AD81B0D7AB0479d96252da870b25C1821FB88'
		},
		farmAddress: {
			[ChainId.BSC]: MASTER_CHEF_V2[ChainId.BSC]
		},
		pair: {
			id: '0xeC1AD81B0D7AB0479d96252da870b25C1821FB88',
			token: {
				symbol: 'BNB',
				id: '0x0000000000000000000000000000000000000000',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'USDT',
				id: '0x55d398326f99059ff775485246999027b3197955',
				decimals: 18,
				earning: false,
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 1,
		network: ChainId.BSC,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: true,
		standEarning: true,
		lpAddressStandVsQuote: {
			[ChainId.BSC]: '0xD43487DBEd7658Ef1b1aa7d5B5497C2C0De51B38'
		},
		lpTokenAddress: {
			decimals: 18,
			[ChainId.BSC]: '0xD43487DBEd7658Ef1b1aa7d5B5497C2C0De51B38'
		},
		farmAddress: {
			[ChainId.BSC]: MASTER_CHEF_V2[ChainId.BSC]
		},
		pair: {
			id: '0xD43487DBEd7658Ef1b1aa7d5B5497C2C0De51B38',
			token: {
				symbol: 'STAND',
				id: '0xd52aC302aADE798142C5AA11739FaD4f3de39755',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'BNB',
				id: '0x0000000000000000000000000000000000000000',
				decimals: 18,
				earning: false,
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 2,
		network: ChainId.BSC,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: true,
		standEarning: true,
		lpAddressStandVsQuote: {
			[ChainId.BSC]: '0xEF49C066489be11981E7146454C2B356d1532781'
		},
		lpTokenAddress: {
			decimals: 18,
			[ChainId.BSC]: '0xEF49C066489be11981E7146454C2B356d1532781'
		},
		farmAddress: {
			[ChainId.BSC]: MASTER_CHEF_V2[ChainId.BSC]
		},
		pair: {
			id: '0xEF49C066489be11981E7146454C2B356d1532781',
			token: {
				symbol: 'STAND',
				id: '0xd52aC302aADE798142C5AA11739FaD4f3de39755',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'USDT',
				id: '0x55d398326f99059ff775485246999027b3197955',
				decimals: 18,
				earning: false,
			}
		},
		type: FarmTypeEnum.LP
	},
	{
		pid: 3,
		network: ChainId.BSC,
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: true,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			[ChainId.BSC]: '0xd52aC302aADE798142C5AA11739FaD4f3de39755'
		},
		farmAddress: {
			[ChainId.BSC]: MASTER_CHEF_V2[ChainId.BSC]
		},
		pair: {
			id: '0xd52aC302aADE798142C5AA11739FaD4f3de39755',
			token: {
				symbol: 'STAND',
				id: '0xd52aC302aADE798142C5AA11739FaD4f3de39755',
				decimals: 18,
				earning: false,
				// amountPerMonth: 20: unlimited token
			},

			quoteToken: {
				symbol: 'STAND',
				id: '0xd52aC302aADE798142C5AA11739FaD4f3de39755',
				decimals: 18,
				earning: false,
			}
		},
		type: FarmTypeEnum.TOKEN
	},
	{
		pid: 4,
		network: [ChainId.BSC],
		startDate: 0,
		endDate: 0,
		isActive: true,
		singleFarm: false,
		standEarning: true,
		lpTokenAddress: {
			decimals: 18,
			[ChainId.BSC]: '0x1Fe203020fb6eA3608F8cc53b29504F04ADd6124'
		},

		lpAddressStandVsQuote: {
			[ChainId.BSC]: '0x1Fe203020fb6eA3608F8cc53b29504F04ADd6124',
			decimals: 18,
		},
		farmAddress: {
			[ChainId.BSC]: MASTER_CHEF_V2[ChainId.BSC]
		},
		pair: {
			id: '0x1Fe203020fb6eA3608F8cc53b29504F04ADd6124',
			token: {
				symbol: 'STAND',
				id: '0xd52aC302aADE798142C5AA11739FaD4f3de39755',
				decimals: 18,
				earning: false,
				
			},

			quoteToken: {
				symbol: 'XWIN',
				id: '0xd88ca08d8eec1e9e09562213ae83a7853ebb5d28',
				decimals: 18,
				earning: true,
				tokenPerYear: 72000
			},	
		},
		type: FarmTypeEnum.LP
	},
]
let farms;

const FarmsList = () => {
	const { chainId } = useChainId();

	switch (chainId) {
		case ChainId.MAINNET:
			farms = farmsEthereum;
			break;
		case ChainId.RINKEBY:
			farms = farmsRinkeby;
			break;
		case ChainId.BSC:
			farms = farmsBsc;
			break;
		case ChainId.BSC_TESTNET:
			farms = farmsBscTest;
			break;
		default:
			farms = [];
	}
	return farms;
}

export default FarmsList;