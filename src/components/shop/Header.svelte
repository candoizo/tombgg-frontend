<script lang="ts">
  export let buyTickets;
  export let address;
  export let totalCost;
</script>

<div class="flex justify-between">
  <div class="my-auto">
    <div class="text-2xl font-semibold md:hidden">🎫 Buy</div>
    <div class="text-3xl font-semibold hidden md:flex">🎫 Buy Tickets</div>
    <div class="">Buy from the bank with GHST!</div>
    <div class="flex">
      <div class="my-auto text-sm">
        User Balance: {address || 'not connected'}
      </div>
      {#if address}
        <img
          src="/ghst.gif"
          width="28px"
          height="28px"
          class="image-pixelated inline"
          alt="a spinning GHST icon"
        />
      {/if}
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
