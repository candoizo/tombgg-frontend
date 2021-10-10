import { aggregate } from '@makerdao/multicall';
import { BigNumber } from '@ethersproject/bignumber';
import { formatEther } from '@ethersproject/units';
import { getDefaultProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { IERC20__factory } from '@aavegotchi/sdk';

import addrs from './addresses';
import chefAbi from './ticketchef.json';
export const contracts = (network?: string) => {
  const env = process.env.NODE_ENV;
  const vars = addrs[env.startsWith(`dev`) ? 31337 : 137];
  const fallback = getDefaultProvider(vars.rpc);
  return {
    ghst: IERC20__factory.connect(vars.ghst, fallback),
    staking: new Contract(
      vars.frens,
      [
        'function ticketCost(uint256 _id) public pure returns (uint256 _frensCost)',
        'function staked(address _account) external view returns (uint256 ghst_, uint256 uniV2PoolTokens_)'
      ],
      fallback
    ),
    chef: new Contract(
      vars.chef,
      chefAbi,
      // [
      //   'function totalSupply() external view returns (uint256 totalSupply_)',
      //   'function balanceOf(address _owner, uint256 _id) external view returns (uint256 balance_)',
      //   'function swapStakeForTickets(uint256[] calldata _ticketTypes, uint256[] calldata _ticketValues) public',
      //   'function enter(uint256 _amount) public',
      //   'function leave(uint256 _share) public'
      // ],
      fallback
    )
  };
};

export const multicallConfig = (network?: string) => {
  const env = process.env.NODE_ENV;
  const vars = addrs[env.startsWith(`dev`) ? 31337 : 137];
  return {
    multicallAddress: vars.multicall,
    rpcUrl: vars.rpc
  };
};

export async function getProps(): Promise<unknown> {
  const props = { ...contracts() };
  console.log(process.env.NODE_ENV);
  return {
    status: 200,
    props
  };
}

export async function ticketCosts(ghstPerThousandFrens: number) {
  const { staking } = contracts();
  const prices = Array(6)
    .fill(undefined)
    .map((_, index) => {
      console.log(index);
      return {
        returns: [
          [
            'ticket_cost_' + index,
            (val: BigNumber) => parseFloat(formatEther(val))
          ]
        ],
        target: staking.address,
        call: ['ticketCost(uint256)(uint256)', index]
      };
    });
  const multires = await aggregate(prices, multicallConfig());
  return Object.fromEntries(
    Object.keys(multires.results.transformed).map((key, index) => {
      const frenCost = multires.results.transformed[key];
      console.log(key, frenCost, frenCost * (1.5 / 1000));
      const ghstPriceFrenRate = frenCost * (ghstPerThousandFrens / 1000);
      return [index, ghstPriceFrenRate];
    })
  );
}
