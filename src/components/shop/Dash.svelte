<script lang="ts">
  import numeral from 'numeral';
  import { info } from '../stake/store';
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
  <div class="flex justify-around">
    <Info title="👻 FRENS In Bank">
      {#if $info.price > 0}
        {numeral($info.frens).format('0,000.00')}
      {:else}
        Loading
      {/if}
    </Info>
    <Info title="💰 GHST/FRENS Rate"
      >{numeral($info.kilofrensRate).format('0.00[0]a')} GHST = 1K FRENS</Info
    >
  </div>
</div>
