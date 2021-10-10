import { BigNumber } from '@ethersproject/bignumber';
import { aggregate } from '@makerdao/multicall';
import { contracts, multicallConfig } from '../../ts';
import { readable, derived } from 'svelte/store';
import { formatEther } from '@ethersproject/units';
import get from 'axios';

const updateBalances = async (set?) => {
  const { chef, staking } = contracts();
  const info = [
    {
      returns: [
        ['totalSupply', (val: BigNumber) => parseFloat(formatEther(val))]
      ],
      target: chef.address,
      call: ['totalSupply()(uint256)']
    },
    {
      returns: [['profit', (val: BigNumber) => parseFloat(formatEther(val))]],
      target: chef.address,
      call: ['profit()(uint256)']
    },
    {
      returns: [
        ['exchangeRate', (val: BigNumber) => parseFloat(formatEther(val))]
      ],
      target: chef.address,
      call: ['exchangeRate()(uint256)']
    },
    {
      returns: [
        ['kilofrensRate', (val: BigNumber) => parseFloat(formatEther(val))]
      ],
      target: chef.address,
      call: ['KILOFRENS_RATE()(uint256)']
    },
    {
      returns: [['frens', (val: BigNumber) => parseFloat(formatEther(val))]],
      target: staking.address,
      call: ['frens(address)(uint256)', chef.address]
    }

    // {
    //   returns: [
    //     ['balanceOf', (val: BigNumber) => parseFloat(formatEther(val))]
    //   ],
    //   target: chef.address,
    //   call: ['balanceOf(addr)(uint256)', ]
    // }
  ];
  const mc = await aggregate(info, multicallConfig());

  const price =
    (
      await get(
        `https://api.coingecko.com/api/v3/simple/price?ids=aavegotchi&vs_currencies=usd`
      )
    ).data['aavegotchi']['usd'] || 'unknown';
  const res = { price, ...mc.results.transformed };
  console.log(`dash info: `, res);
  if (set) set(res);
  return res;
};

export const info = readable({ totalSupply: 0, price: 0 }, function start(set) {
  const interval = setInterval(() => updateBalances(set), 5000);
  updateBalances(set);
  // load initally
  return function stop() {
    clearInterval(interval);
  };
});

// const start = new Date();
const rate = 2;

export const elapsed = derived(info, ($info) =>
  Math.round(($info.totalSupply * rate) / 1000)
);
// import { readable } from 'svelte/store';
//
// export default function (options: { interval: number }) {
//   return readable(null, (set) => {
//     // the update function sets the latest date
//     const update = () => set(new Date());
//
//     // force an update to initialize the store with a non-null value
//     update();
//
//     // setup an interval timer to update the store's value repeatedly over time
//     const interval = setInterval(update, options.interval || 1000);
//
//     // return unsubscribe callback:
//     // it will stop the timer when the store is destroyed
//     return () => clearInterval(interval);
//   });
// }
