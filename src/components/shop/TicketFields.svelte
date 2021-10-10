<script lang="ts">
  export let pendingTx;
  export let signer;
  export let updateBalances;
  export let ticketbook;
  let ticketAmounts = Object.fromEntries(
    Object.keys(ticketbook).map((key) => [key, 0])
  );
  import { contracts } from '../../ts';

  export let buyTickets = async () => {
    console.log('buyTickets entry', ticketbook, ticketAmounts);
    const { chef } = contracts();
    try {
      const tx = await chef
        .connect(signer)
        .swapGhstForTickets(
          Object.keys(ticketAmounts),
          Object.values(ticketAmounts)
        );
      console.log(`buyTickets tx: `, tx);
      pendingTx = tx.hash;
      ticketAmounts = Object.fromEntries(
        Object.keys(ticketAmounts).map((key) => [key, 0])
      );
      totalCost = 0;
      const conf = await tx.wait();
      console.log(`buyTickets conf: `, conf);
      updateBalances();
      pendingTx = '';
    } catch (err) {
      console.log(`buyTickets err: `, err);
    }
  };

  export let totalCost = 0;
  function updateTotal() {
    console.log(`updateTotal entry`, ticketbook, ticketAmounts);
    let total = 0;
    Object.keys(ticketbook).map((key) => {
      console.log((ticketbook[key] * ticketAmounts[key]).toFixed(3));
      total += parseFloat((ticketbook[key] * ticketAmounts[key]).toFixed(3));
    });
    totalCost = total;
  }
</script>

<div class="flex flex-col grid-cols-2 w-full mx-auto">
  {#each Object.keys(ticketbook) as index}
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
          <div class="my-auto">{ticketbook[index]} GHST ×</div>
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
            on:change={() => updateTotal()}
          />
        </div>
        <div class="my-auto hidden">
          = {ticketAmounts[index] > 0
            ? (ticketbook[index] * ticketAmounts[index]).toFixed(3)
            : 0} GHST
        </div>
      </div>
    </div>
  {/each}
</div>
