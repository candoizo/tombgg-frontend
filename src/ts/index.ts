import { aggregate } from '@makerdao/multicall';
import { BigNumber, utils } from 'ethers';
import { getDefaultProvider, Contract } from 'ethers';
import { IERC20__factory } from '@aavegotchi/sdk';

import { approve } from './tx';
import { stake, unstake, ticketchef } from './ticketchef';
export { approve, stake, unstake, ticketchef };

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
  ),
  chef: ticketchef(provider)
};

export async function getProps(): Promise<unknown> {
  const props = { ...contracts };

  return {
    status: 200,
    props
  };
}

export async function ticketCosts(ghstPerThousandFrens: number) {
  const prices = Array(6)
    .fill(undefined)
    .map((_, index) => {
      console.log(index);
      return {
        returns: [
          [
            'ticket_cost_' + index,
            (val: BigNumber) => parseFloat(utils.formatEther(val))
          ]
        ],
        target: contracts.staking.address,
        call: ['ticketCost(uint256)(uint256)', index]
      };
    });
  const multires = await aggregate(prices, mcConfig);
  return Object.fromEntries(
    Object.keys(multires.results.transformed).map((key, index) => {
      const frenCost = multires.results.transformed[key];
      console.log(key, frenCost, frenCost * (1.5 / 1000));
      const ghstPriceFrenRate = frenCost * (ghstPerThousandFrens / 1000);
      return [index, ghstPriceFrenRate];
    })
  );
}
