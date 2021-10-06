<script lang="ts">
  import { BigNumberish, utils } from 'ethers';
  import { contracts, approve } from '../../ts';
  export let signer;
  export let pendingTx;
  export let depositAmount;
  export let withdrawAmount;
  export let allowance;

  const approve = async () => {
    console.log(
      `zomg approve;`,
      contracts.chef.address,
      signer.provider._network
    );
    if (signer.provider._network.chainId != 31337) {
      console.log(`wrong network`);
      return;
    }
    const newAllowance = 1e9;
    const tx = await contracts.ghst
      .connect(signer)
      .approve(contracts.chef.address, utils.parseEther(`${newAllowance}`));
    pendingTx = tx.hash;
    const conf = await tx.wait();
    console.log(conf);
    allowance = newAllowance;
    pendingTx = '';
  };

  const stake = async (value?: BigNumberish) => {
    console.log(`zomg stake: `, value, depositAmount);
    if (value === 'max') {
      const max = await contracts.ghst.balanceOf(
        signer.provider.selectedAddress
      );
      depositAmount = utils.formatEther(max);
    }
    if (depositAmount > 0) {
      const testStake = utils.parseEther(`${depositAmount}`);
      console.log(testStake);
      const tx = await contracts.chef.connect(signer).enter(testStake);
      console.log(`Stake tx: `, tx);
      pendingTx = tx.hash;
      const conf = await tx.wait();
      pendingTx = '';
      console.log(`Stake conf: `, conf);
      // // reload balances
      // updateBalances();
      depositAmount = '';
    }
  };

  const unstake = async (value?: BigNumberish) => {
    console.log(`zomg stake: `, value, withdrawAmount, signer);
    if (value === 'max') {
      const max = await contracts.chef.balanceOf(
        signer.provider.selectedAddress
      );
      withdrawAmount = utils.formatEther(max);
    }
    if (withdrawAmount > 0) {
      const testStake = utils.parseEther(`${withdrawAmount}`);
      console.log(testStake);
      const tx = await contracts.chef.connect(signer).leave(testStake);
      console.log(`Unstake tx: `, tx);
      pendingTx = tx.hash;
      const conf = await tx.wait();
      pendingTx = '';
      console.log(`Unstake conf: `, conf);
      // // reload balances
      // updateBalances();
      withdrawAmount = '';
    }
  };
</script>

<div
  class="bg-gray-800 rounded-lg flex flex-col py-4 justify-around cursor-pointer my-2"
>
  <div class="flex w-11/12 py-2 mx-auto justify-around bg-purple-700 rounded">
    <img
      class="bg-gray-900 rounded"
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
      class="bg-gray-600 hover:bg-gray-800 rounded p-2 w-28 text-md flex my-8 mx-auto w-2/5"
      on:click={() => approve()}
    >
      <div class="mx-auto animate-pulse">Connect to Polygon</div>
    </div>
  {:else}
    <div class="flex w-full justify-around mt-4">
      <div class="flex flex-col">
        <div class="text-sm underline font-bold uppercase">deposit</div>
        <input class="rounded-sm text-black" bind:value={depositAmount} />
        <div class="flex">
          {#if allowance < 1e7}
            <div
              class="bg-purple-600 hover:bg-purple-800 rounded p-2 w-28 text-sm flex my-2 mx-auto"
              on:click={() => approve()}
            >
              <div class="mx-auto">Approve</div>
            </div>
          {:else}
            <div
              class="bg-purple-600 hover:bg-purple-800 rounded p-2 w-28 text-sm flex my-2 mx-auto"
              on:click={() => stake()}
            >
              <div class="mx-auto">Stake</div>
            </div>
            <div
              class="bg-purple-600 hover:bg-purple-800 rounded p-2 w-20 text-sm flex my-2 mx-auto"
              on:click={() => stake('max')}
            >
              <div class="mx-auto">Max</div>
            </div>
          {/if}
        </div>
      </div>
      <div class="flex flex-col">
        <div class="text-sm underline font-bold uppercase">withdraw</div>
        <input class="rounded-sm text-black" bind:value={withdrawAmount} />
        <div class="flex">
          <div
            class="bg-purple-600 hover:bg-purple-800 rounded p-2 w-28 text-sm flex my-2 mx-auto"
            on:click={() => unstake()}
          >
            <div class="mx-auto">Unstake</div>
          </div>
          <div
            class="bg-purple-600 hover:bg-purple-800 rounded p-2 w-20 text-sm flex my-2 mx-auto"
            on:click={() => unstake('max')}
          >
            <div class="mx-auto">Max</div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
