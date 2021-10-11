<script lang="ts">
  import { BigNumberish } from '@ethersproject/bignumber';
  import { parseEther, formatEther } from '@ethersproject/units';
  import numeral from 'numeral';
  import { contracts } from '../../ts';
  import { info } from './store';
  import Info from '../Info.svelte';
  export let signer;
  export let pendingTx;
  export let depositAmount;
  export let withdrawAmount;
  export let allowance;
  export let balances;
  export let updateBalances;
  export let title;
  export let subtitle;
  export let rate;

  const approve = async () => {
    const { ghst, chef } = contracts();
    console.log(`approve entry`);
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
      <div class="flex justify-around w-11/12 mx-auto xs:mx-0 xs:w-2/5">
        <img
          class="bg-gray-900 rounded-full object-contain p-2"
          src="/ghst.svg"
          width="64px"
          height="64px"
          alt="GHST icon"
        />
        <div class="text-xl my-auto mr-auto ml-2 w-3/5">
          <div class="font-bold text-xl my-auto">{title}</div>
          <div class="text-sm my-auto">{subtitle}</div>
        </div>
      </div>
      <div class="justify-center items-center hidden flex-col xs:flex">
        <div
          class="text-md my-auto text-white font-bold bg-gray-900 rounded-lg text-center w-48 my-auto"
        >
          {rate} FRENS PER TOKEN
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
      <div class="flex flex-col px-2 xs:flex-row w-full justify-around mt-4">
        <div class="flex flex-col">
          <div class="flex justify-between text-sm font-bold uppercase">
            <div class="uppercase underline">deposit</div>
            <div>{numeral(balances.ghst.balance).format('0.0a')} GHST</div>
          </div>
          <input class="rounded-sm text-black" bind:value={depositAmount} />
          <div class="flex h-10">
            <div
              class="bg-purple-600 hover:bg-purple-800 h-6 rounded w-12 text-sm flex my-2 mx-auto cursor-pointer"
              on:click={() => (depositAmount = balances.ghst.balance * 0.25)}
            >
              <div class="m-auto">25%</div>
            </div>
            <div
              class="bg-purple-600 hover:bg-purple-800 h-6 rounded w-12 text-sm flex my-2 mx-auto cursor-pointer"
              on:click={() => (depositAmount = balances.ghst.balance * 0.5)}
            >
              <div class="m-auto">50%</div>
            </div>
            <div
              class="bg-purple-600 hover:bg-purple-800 h-6 rounded w-12 text-sm flex my-2 mx-auto cursor-pointer"
              on:click={() => (depositAmount = balances.ghst.balance * 0.75)}
            >
              <div class="m-auto">75%</div>
            </div>
            <div
              class="bg-purple-600 hover:bg-purple-800 h-6 rounded w-12 text-sm flex my-2 mx-auto cursor-pointer"
              on:click={() => (depositAmount = balances.ghst.balance)}
            >
              <div class="m-auto">100%</div>
            </div>
          </div>
          <div class="flex -mt-2">
            {#if balances.ghst.allowance < 1e7}
              <div
                class="bg-purple-600 hover:bg-purple-800 rounded p-2 w-full text-sm flex my-2 mx-auto cursor-pointer"
                on:click={() => approve()}
              >
                <div class="mx-auto">Approve</div>
              </div>
            {:else}
              <div
                class="{parseFloat(depositAmount) > 0
                  ? 'bg-purple-600 hover:bg-purple-800'
                  : 'bg-gray-600'} rounded p-2 w-full text-sm flex my-2 mx-auto cursor-pointer"
                on:click={() => stake()}
              >
                <div class="mx-auto">Stake</div>
              </div>
            {/if}
          </div>
        </div>
        <div class="flex flex-col">
          <div class="flex justify-between text-sm font-bold uppercase">
            <div class="uppercase underline">withdraw</div>
            <div>
              {numeral(balances.chef.balance * $info.exchangeRate).format(
                '0.00a'
              )} GHST
            </div>
          </div>
          <input class="rounded-sm text-black" bind:value={withdrawAmount} />
          <div class="flex h-10">
            <div
              class="bg-purple-600 hover:bg-purple-800 h-6 rounded w-12 text-sm flex my-2 mx-auto cursor-pointer"
              on:click={() =>
                (withdrawAmount =
                  balances.chef.balance * 0.25 * $info.exchangeRate)}
            >
              <div class="m-auto">25%</div>
            </div>
            <div
              class="bg-purple-600 hover:bg-purple-800 h-6 rounded w-12 text-sm flex my-2 mx-auto cursor-pointer"
              on:click={() =>
                (withdrawAmount =
                  balances.chef.balance * 0.5 * $info.exchangeRate)}
            >
              <div class="m-auto">50%</div>
            </div>
            <div
              class="bg-purple-600 hover:bg-purple-800 h-6 rounded w-12 text-sm flex my-2 mx-auto cursor-pointer"
              on:click={() =>
                (withdrawAmount =
                  balances.chef.balance * 0.75 * $info.exchangeRate)}
            >
              <div class="m-auto">75%</div>
            </div>
            <div
              class="bg-purple-600 hover:bg-purple-800 h-6 rounded w-12 text-sm flex my-2 mx-auto cursor-pointer"
              on:click={() =>
                (withdrawAmount = balances.chef.balance * $info.exchangeRate)}
            >
              <div class="m-auto">100%</div>
            </div>
          </div>
          <div class="flex -mt-2">
            <div
              class="{withdrawAmount > 0
                ? 'bg-purple-600 hover:bg-purple-800'
                : 'bg-gray-600'} rounded p-2 w-full text-sm flex my-2 mx-auto cursor-pointer"
              on:click={() => unstake()}
            >
              <div class="mx-auto">Unstake</div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
  {#if signer}
    <div class="flex justify-around mt-4 hidden">
      <Info title="🏦 Your Deposit">
        {numeral(balances.chef.balance * $info.exchangeRate).format('0.00a')} GHST
      </Info>
      <Info title="🏦 Your Share"
        >{numeral(balances.chef.balance / $info.totalSupply).format(
          '0.00[0]%'
        )}</Info
      >
    </div>
  {/if}
</div>
