<script lang="ts">
  import { BigNumberish } from '@ethersproject/bignumber';
  import { parseEther, formatEther } from '@ethersproject/units';
  import numeral from 'numeral';
  import { contracts } from '../../ts';
  import Info from '../Info.svelte';
  export let signer;
  export let pendingTx;
  export let depositAmount;
  export let withdrawAmount;
  export let allowance;
  export let balances;
  export let updateBalances;

  const approve = async () => {
    const { ghst, chef } = contracts();
    console.log(`zomg approve`);
    const newAllowance = 1e9;
    const tx = await ghst
      .connect(signer)
      .approve(chef.address, parseEther(`${newAllowance}`));
    pendingTx = tx.hash;
    const conf = await tx.wait();
    console.log(`approve confirmed: `, conf);
    balances.ghst.allowance = newAllowance;
    pendingTx = '';
  };

  const stake = async (value?: BigNumberish) => {
    const { chef, ghst } = contracts();
    console.log(`zomg stake: `);
    if (value === 'max') {
      const max = await ghst.balanceOf(signer.getAddress());
      depositAmount = formatEther(max);
    }
    if (depositAmount > 0) {
      const amt = parseEther(`${depositAmount}`);
      console.log(amt);
      const tx = await chef.connect(signer).enter(amt);
      console.log(`Stake tx: `, tx);
      pendingTx = tx.hash;
      const conf = await tx.wait();
      pendingTx = '';
      console.log(`Stake conf: `, conf);
      // // reload balances
      depositAmount = '';
      updateBalances();
    }
  };

  const unstake = async (value?: BigNumberish) => {
    const { chef, ghst } = contracts();
    console.log(`zomg stake: `, value, withdrawAmount, signer);
    if (value === 'max') {
      const max = await chef.balanceOf(signer.getAddress());
      withdrawAmount = formatEther(max);
    }
    if (withdrawAmount > 0) {
      const amt = parseEther(`${withdrawAmount}`);
      console.log(amt);
      const tx = await chef.connect(signer).leave(amt);
      console.log(`Unstake tx: `, tx);
      pendingTx = tx.hash;
      const conf = await tx.wait();
      pendingTx = '';
      console.log(`Unstake conf: `, conf);
      // // reload balances
      withdrawAmount = '';
      updateBalances();
    }
  };
</script>

<div
  class="bg-gray-800 rounded-lg flex flex-col p-4 justify-around my-2 shadow-xl"
>
  <div class="bg-gray-900 rounded-lg shadow-xl">
    <div class="flex w-full py-2 mx-auto justify-around bg-purple-700 rounded">
      <img
        class="bg-gray-900 rounded-full"
        src="/ghst.gif"
        width="64px"
        height="64px"
        alt="GHST icon"
      />
      <div class="text-xl my-auto">
        <div class="font-bold text-xl my-auto">GHST V1</div>
        <div class="text-sm my-auto">Aavegotchi</div>
      </div>
      <div class="flex flex-col justify-center items-center">
        <div
          class="text-md my-auto text-white font-bold bg-gray-900 rounded-lg text-center w-32 my-auto"
        >
          APY 1337%
        </div>
        <div class="text-xs my-auto">Auto-compound GHST + rewards!</div>
      </div>
    </div>
    {#if !signer}
      <div
        class="text-xl rounded flex my-8 mx-auto w-full"
        on:click={() => approve()}
      >
        <div class="mx-auto">You must connect a wallet.</div>
      </div>
    {:else}
      <div class="flex w-full justify-around mt-4">
        <div class="flex flex-col">
          <div class="flex justify-between text-sm font-bold uppercase">
            <div class="uppercase underline">deposit</div>
            <div>{numeral(balances.ghst.balance).format('0.0a')} GHST</div>
          </div>
          <input class="rounded-sm text-black" bind:value={depositAmount} />
          <div class="flex">
            {#if balances.ghst.allowance < 1e7}
              <div
                class="bg-purple-600 hover:bg-purple-800 rounded p-2 w-28 text-sm flex my-2 mx-auto cursor-pointer"
                on:click={() => approve()}
              >
                <div class="mx-auto">Approve</div>
              </div>
            {:else}
              <div
                class="bg-purple-600 hover:bg-purple-800 rounded p-2 w-28 text-sm flex my-2 mx-auto cursor-pointer"
                on:click={() => stake()}
              >
                <div class="mx-auto">Stake</div>
              </div>
              <div
                class="bg-purple-600 hover:bg-purple-800 rounded p-2 w-20 text-sm flex my-2 mx-auto cursor-pointer"
                on:click={() => stake('max')}
              >
                <div class="mx-auto">Max</div>
              </div>
            {/if}
          </div>
        </div>
        <div class="flex flex-col">
          <div class="flex justify-between text-sm font-bold uppercase">
            <div class="uppercase underline">withdraw</div>
            <div>{numeral(balances.chef.balance).format('0.0a')} xGHST</div>
          </div>
          <input class="rounded-sm text-black" bind:value={withdrawAmount} />
          <div class="flex">
            <div
              class="bg-purple-600 hover:bg-purple-800 rounded p-2 w-28 text-sm flex my-2 mx-auto cursor-pointer"
              on:click={() => unstake()}
            >
              <div class="mx-auto">Unstake</div>
            </div>
            <div
              class="bg-purple-600 hover:bg-purple-800 rounded p-2 w-20 text-sm flex my-2 mx-auto cursor-pointer"
              on:click={() => unstake('max')}
            >
              <div class="mx-auto">Max</div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
  {#if signer}
    <div class="flex justify-around mx-2 mt-4">
      <Info title="🏦 Your Deposit">
        {#await contracts().chef.balanceOf(signer.getAddress())}
          Loading...
        {:then bal}
          {numeral(formatEther(bal)).format('0.0a')} GHST
        {/await}
      </Info>
      <Info title="🏦 Your Earnings">hi</Info>
    </div>
  {/if}
</div>
