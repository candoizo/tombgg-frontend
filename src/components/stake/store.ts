import { contracts, provider } from '../../ts/index';
import { readable, derived } from 'svelte/store';
import { utils } from 'ethers';
import get from 'axios';

const updateBalances = async (set?) => {
  const totalSupply = parseFloat(
    utils.formatEther(await contracts.chef.totalSupply())
  );
  console.log(`totalSupply:`, totalSupply);
  const price =
    (
      await get(
        `https://api.coingecko.com/api/v3/simple/price?ids=aavegotchi&vs_currencies=usd`
      )
    ).data['aavegotchi']['usd'] || 'unknown';
  console.log(`ghstUsd price: `, price);
  const res = { totalSupply, price };
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
