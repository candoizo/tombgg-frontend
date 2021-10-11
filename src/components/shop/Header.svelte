<script lang="ts">
  export let buyTickets;
  export let address;
  export let totalCost;
  export let balances;

  import numeral from 'numeral';
</script>

<div
  class="flex flex-col-reverse sm:flex-row justify-center sm:justify-between bg-purple-800 rounded-lg px-4 py-1 mb-4 h-40 sm:h-20"
>
  <div class="m-auto sm:mx-0">
    <div class="flex mx-auto">
      <div class="my-auto text-md md:text-lg">
        {#if !address}
          You must connect a wallet.
        {:else}
          <div class="flex flex-col">
            <div class="flex justify-center">
              <div class="my-auto">
                <b>YOUR BALANCES:</b>
                {numeral(balances.ghst.balance).format('0.00a')}
              </div>
              <img
                src="/ghst.svg"
                class="object-contain flex my-auto ml-1"
                width="20px"
                height="20px"
              />
            </div>
            <div class="inline flex mt-2 -ml-2">
              {#each balances.staking.tickets as amount, index}
                <div class="flex flex-col mx-2 justify-center text-sm">
                  <img
                    src="/tickets/{index}.svg"
                    class="object-contain mx-auto"
                    width="20"
                    height="20"
                  />
                  <div class="mx-auto text-center">{amount}</div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
  <div class="my-auto flex">
    <div
      class="rounded bg-green-600 hover:bg-green-500 w-full sm:w-36 p-1 m-2 flex flex-col cursor-pointer text-center"
      on:click={buyTickets}
    >
      <div class="flex m-auto uppercase font-semibold">Buy Tickets</div>
      <div class="flex justify-center">
        <div class="my-auto text-sm">{totalCost} GHST</div>
      </div>
    </div>
  </div>
</div>
