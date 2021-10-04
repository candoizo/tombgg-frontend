<script lang="ts">
  import { BigNumberish, utils } from 'ethers';
  import { contracts, approve } from '../../ts';
  export let signer;

  const approve = async () => {
    console.log();
    await contracts.ghst
      .connect(signer)
      .approve(contracts.staking.address, utils.parseEther('100000000'));
  };

  const stake = async (value?: BigNumberish) => {
    console.log(`zomg stake: `, value, stakeAmount);
    // if (value === 'max') {
    //   const max = await contracts.ghst.balanceOf(userAccount);
    //   stakeAmount = utils.formatEther(max);
    // }
    // if (stakeAmount > 0) {
    //   const testStake = utils.parseEther(stakeAmount.toString());
    //   console.log(testStake);
    //   const tx = await ticketchef.enter(testStake);
    //   console.log(`Stake tx: `, tx);
    //   pendingTx = tx.hash;
    //   const conf = await tx.wait();
    //   console.log(`Stake conf: `, conf);
    //   if (conf) {
    //     // reload balances
    //     updateBalances();
    //     stakeAmount = '';
    //   }
    // }
  };

  const unstake = async (value?: BigNumberish) => {
    console.log(`zomg unstake: `, value, stakeAmount);
    // if (value === 'max') {
    //   const max = await ticketchef.balanceOf(userAccount);
    //   stakeAmount = utils.formatEther(max);
    // }
    // if (stakeAmount > 0) {
    //   const testStake = utils.parseEther(stakeAmount.toString());
    //   console.log(testStake);
    //   const tx = await ticketchef.leave(testStake);
    //   console.log(`Unstake tx: `, tx);
    //   pendingTx = tx.hash;
    //   const conf = await tx.wait();
    //   console.log(`Unstake conf: `, conf);
    //   if (conf) {
    //     // reload balances
    //     updateBalances();
    //     stakeAmount = '';
    //   }
    // }
  };
</script>

<div
  class="bg-gray-900 rounded-lg flex flex-col py-4 justify-around cursor-pointer my-2"
>
  <div class="flex w-full mx-auto justify-around">
    <img
      class="bg-gray-800 rounded"
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
        class="text-md my-auto text-pink-400 font-bold bg-indigo-900 rounded-lg text-center w-32 my-auto"
      >
        APY 1337%
      </div>
      <div class="text-xs my-auto">Auto-compound GHST + rewards!</div>
    </div>
  </div>

  <div class="flex w-full justify-around mt-4">
    <div class="flex flex-col">
      <div class="text-sm underline font-bold">deposit</div>
      <input class="rounded-sm text-black" value="test" />
      {#if signer}
        <div
          class="bg-blue-500 hover:bg-blue-700 rounded p-2 w-28 text-sm flex my-2 mx-auto"
          on:click={() => approve()}
        >
          <div class="mx-auto">Approve</div>
        </div>
      {/if}
      <div
        class="bg-blue-500 hover:bg-blue-700 rounded p-2 w-28 text-sm flex my-2 mx-auto"
        on:click={() => stake()}
      >
        <div class="mx-auto">Stake</div>
      </div>
      <div
        class="bg-blue-500 hover:bg-blue-700 rounded p-2 w-28 text-sm flex my-2 mx-auto"
        on:click={() => stake('max')}
      >
        <div class="mx-auto">Stake Max</div>
      </div>
    </div>
    <div class="flex flex-col">
      <div class="text-sm underline font-bold">withdraw</div>
      <input class="rounded-sm text-black" value="test" />
      <div
        class="bg-blue-500 hover:bg-blue-700 rounded p-2 w-28 text-sm flex my-2 mx-auto"
        on:click={() => unstake()}
      >
        <div class="mx-auto">Unstake</div>
      </div>
      <div
        class="bg-blue-500 hover:bg-blue-700 rounded p-2 w-28 text-sm flex my-2 mx-auto"
        on:click={() => unstake('max')}
      >
        <div class="mx-auto">Unstake Max</div>
      </div>
    </div>
  </div>
</div>
