import {
  getDefaultProvider,
  BigNumber,
  utils,
  Contract,
  providers
} from 'ethers';
import { IERC20__factory } from '@aavegotchi/sdk';

import { approve } from './tx';
export { approve };

export const rpcUrl = 'http://localhost:8545';
export const provider = getDefaultProvider(rpcUrl);

export const mcConfig = {
  // from https://github.com/makerdao/multicall
  multicallAddress: '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507',
  rpcUrl: rpcUrl
};

export const contracts = {
  ghst: IERC20__factory.connect(
    '0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7',
    provider
  ),
  staking: new Contract(
    '0xA02d547512Bb90002807499F05495Fe9C4C3943f',
    [
      'function ticketCost(uint256 _id) public pure returns (uint256 _frensCost)'
    ],
    provider
  )
};

export async function getProps(): Promise<any> {
  const props = { ...contracts };

  return {
    status: 200,
    props
  };
}
