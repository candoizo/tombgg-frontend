<script lang="ts">
  export let buyTickets;
  export let address;
  export let totalCost;

  import { contracts } from '../../ts';
  import { utils } from 'ethers';
</script>

<div class="flex justify-between">
  <div class="my-auto">
    <div class="">RATE: 1.5 GHST per 1000 FRENS</div>
    <div class="flex">
      <div class="my-auto text-sm">
        BALANCE:
        {#if !address}
          not connected
        {:else}
          {#await contracts.ghst.balanceOf(address)}
            loading...
          {:then balance}
            {parseFloat(utils.formatEther(balance)).toFixed(2)} GHST
          {:catch balance}
            fail
          {/await}
        {/if}
      </div>
    </div>
  </div>
  <div class="my-auto flex">
    <div
      class="rounded bg-green-600 hover:bg-green-500 w-32 p-1 m-2 flex flex-col cursor-pointer text-center"
      on:click={buyTickets}
    >
      <div class="flex m-auto uppercase font-semibold">Purchase</div>
      <div class="flex justify-center">
        <div class="my-auto text-sm">{totalCost || 0} GHST</div>
      </div>
    </div>
  </div>
</div>
