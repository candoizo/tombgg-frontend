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

<div class="flex w-full mx-auto pb-4 grid grid-cols-2 md:grid-cols-3">
  {#each Object.keys(ticketbook) as index}
    <div
      class="flex justify-center mx-auto flex-col select-none w-1/3 md:w-1/2"
    >
      <img
        src="/tickets/{index}.svg"
        width="140"
        height="140"
        class="mx-auto my-4"
        alt="a raffle ticket"
      />
      <div class="flex my-auto justify-center">
        <div>{ticketbook[index]}</div>
        <img
          src="/ghst.svg"
          width="24"
          height="24"
          class="ml-2 my-auto object-contain"
        />
      </div>
      <div class="my-auto flex justify-center mt-2">
        <div
          class="bg-purple-400 rounded-l px-2 cursor-pointer"
          on:click={() => {
            if (ticketAmounts[index])
              ticketAmounts[index] = ticketAmounts[index] - 1;
            updateTotal();
          }}
        >
          -
        </div>
        <input
          min="0"
          class="text-black my-auto text-center w-10 text-center"
          bind:value={ticketAmounts[index]}
          on:change={() => updateTotal()}
          on:keyup={() => updateTotal()}
        />
        <div
          class="bg-purple-400 rounded-r px-2 cursor-pointer"
          on:click={() => {
            ticketAmounts[index] = ticketAmounts[index] + 1;
            updateTotal();
          }}
        >
          +
        </div>
      </div>
    </div>
  {/each}
</div>
