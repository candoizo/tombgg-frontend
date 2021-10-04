<script lang="ts">
  export let ticketPrices;
  export let ticketAmounts;
  export let onChange;
</script>

<div class="flex flex-col grid-cols-2 w-full mx-auto">
  {#each Object.keys(ticketPrices) as index}
    <div class="flex justify-center mx-4">
      <img
        src="/tickets/{index}.svg"
        width="100"
        height="100"
        class="mx-auto my-4"
        alt="a raffle ticket"
      />
      <div class="flex justify-end w-2/3">
        <div class="flex flex-col justify-center">
          <div class="text-2xs -mb-6 text-center" style="font-size: 12px">
            price
          </div>
          <div class="my-auto">{ticketPrices[index]} GHST ×</div>
        </div>
        <div class="flex flex-col w-1/4 justify-center">
          <div class="text-2xs text-center mb-1" style="font-size: 12px">
            amount
          </div>
          <input
            type="number"
            min="0"
            class="text-black my-auto mx-1 text-center rounded -mt-0"
            bind:value={ticketAmounts[index]}
            on:change={onChange}
          />
        </div>
        <div class="my-auto hidden">
          = {ticketAmounts[index] > 0
            ? (ticketPrices[index] * ticketAmounts[index]).toFixed(3)
            : 0} GHST
        </div>
      </div>
    </div>
  {/each}
</div>
