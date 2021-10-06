<script lang="ts">
  import { info, elapsed } from './store';

  let rateText = '1xGHST = 1.25GHST';
  let order = ['xGHST', 'GHST'];
  const updateRate = () => {
    order.reverse();
    if (order[0] === 'xGHST') rateText = '1xGHST = 1.25GHST';
    else rateText = '0.97xGHST = 1GHST';
  };
</script>

<div
  class="bg-gray-800 rounded-lg flex flex-col py-4 justify-around mb-4 select-none"
>
  <div class="flex justify-around">
    <div class="flex flex-col text-center bg-gray-900 rounded-lg pb-2 w-2/5">
      <div class="font-semibold uppercase bg-purple-800 rounded-md p-2 mb-2">
        🏦 Total Deposits
      </div>
      <div class="font-bold">
        ${($info.price * $info.totalSupply).toFixed(2)} | {$info.totalSupply} GHST
      </div>
    </div>
    <div class="flex flex-col text-center bg-gray-900 rounded-lg pb-2 w-2/5">
      <div class="font-semibold uppercase bg-purple-800 rounded-md p-2 mb-2">
        💰 Total Earned
      </div>
      <div class="text-center font-bold">$101</div>
    </div>
  </div>
  <div class="flex justify-around mt-4">
    <div class="flex flex-col text-center bg-gray-900 rounded-lg pb-2 w-2/5">
      <div class="font-semibold uppercase bg-purple-800 rounded-md p-2 mb-2">
        👻 GHST Price
      </div>
      <div class="text-center font-bold">
        ${$info.price.toFixed(2)}
      </div>
    </div>
    <div
      class="flex flex-col text-center bg-gray-900 rounded-lg pb-2 cursor-pointer w-2/5"
      on:click={updateRate}
    >
      <div class="font-semibold uppercase bg-purple-800 rounded-md p-2 mb-2">
        🚜 xGHST Rate
      </div>
      <div class="font-bold w-full">{rateText}</div>
    </div>
  </div>
</div>
