<script lang="ts">
  import numeral from 'numeral';
  import { info } from './store';
  import Info from '../Info.svelte';

  let rateText = '1xGHST = 1.25GHST';
  let order = ['xGHST', 'GHST'];
  const updateRate = () => {
    order.reverse();
    rateText = '';
    if (order[0] === 'xGHST') rateText = `1xGHST = ${$info.exchangeRate}GHST`;
    else rateText = '0.97xGHST = 1GHST';
    return rateText;
  };
</script>

<div
  class="bg-gray-800 rounded-lg flex flex-col py-4 justify-around mb-4 select-none shadow-xl"
>
  <div class="flex justify-around gap-4 flex-col xs:flex-row">
    <Info title="🏦 Total Deposits">
      {#if $info.price > 0}
        {numeral($info.price * ($info.totalSupply * $info.exchangeRate)).format(
          '$0.00a'
        )} | {numeral($info.totalSupply * $info.exchangeRate).format('0.00a')}
        GHST
      {:else}
        Loading
      {/if}
    </Info>
    <Info title="💰 Total Earnings">
      {#if $info.price > 0}
        {numeral($info.profit * $info.price).format('$0.00a')} | {numeral(
          $info.profit
        ).format('0.00a')}
        GHST
      {:else}
        Loading
      {/if}
    </Info>
  </div>
</div>
