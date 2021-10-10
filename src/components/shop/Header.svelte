<script lang="ts">
  export let buyTickets;
  export let address;
  export let totalCost;
  export let balances;

  import numeral from 'numeral';
</script>

<div class="flex justify-between bg-purple-800 rounded-lg px-4 py-1 mb-4">
  <div class="my-auto">
    <div class="flex">
      <div class="my-auto text-sm">
        BALANCE:
        {#if !address}
          not connected
        {:else}
          {numeral(balances.ghst.balance).format('0.00a')} GHST
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
