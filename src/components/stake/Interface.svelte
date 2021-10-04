<script lang="ts">
  export let userBalance;
  export let userStake = 0;
  export let stakeAmount;
  export let allowance = 0;
  export let approve;
  export let stake;
  export let unstake;
</script>

<div class="rounded bg-purple-600 p-2 mt-4 w-full">
  <div class="text-2xl flex">
    <img
      src="/ghst.gif"
      width="32px"
      height="32px"
      class="image-pixelated inline my-auto"
      alt="gif"
    />
    <div class="my-auto font-bold">xGHST (uses GHST)</div>
    <a href="https://app.1inch.io" class="ml-2 underline cursor-pointer"
      >Buy GHST</a
    >
  </div>

  <div class="flex w-full justify-around">
    <div>
      Balance: {userBalance ? parseFloat(userBalance).toFixed(2) : 0} GHST
    </div>
    <div>Deposited: {userStake} GHST</div>
  </div>
  <div class="flex w-full justify-around">
    <div class="flex flex-col">
      <input
        class="text-black w-4/5 mx-auto"
        type="number"
        min="0"
        max={parseFloat(userBalance || '0')}
        bind:value={stakeAmount}
      />
      {#if !allowance}
        <div
          class="flex bg-green-600 rounded w-1/2 mx-auto py-2 my-2 cursor-pointer"
          on:click={approve}
        >
          <div class="mx-auto">Approve GHST</div>
        </div>
      {:else}
        <div class="flex">
          <div
            class="flex bg-green-600 rounded w-1/2 mx-auto py-2 m-2 w-2/5 cursor-pointer"
            on:click={() => stake()}
          >
            <div class="mx-auto">Deposit</div>
          </div>
          <div
            class="flex bg-green-600 rounded w-1/2 mx-auto py-2 m-2 w-2/5 cursor-pointer"
            on:click={() => stake('max')}
          >
            <div class="mx-auto">Deposit All</div>
          </div>
        </div>
        <div class="flex">
          <div
            class="flex bg-green-600 rounded w-1/2 mx-auto py-2 m-2 w-2/5 cursor-pointer"
            on:click={() => unstake()}
          >
            <div class="mx-auto">Withdraw</div>
          </div>
          <div
            class="flex bg-green-600 rounded w-1/2 mx-auto py-2 m-2 w-2/5 cursor-pointer"
            on:click={() => unstake('max')}
          >
            <div class="mx-auto">Withdraw All</div>
          </div>
        </div>
      {/if}
      <div class="flex justify-around">
        <div>Deposit fee: 0%</div>
        <div>Withdrawal Fee: 0%</div>
      </div>
      <div class="text-xs">
        You will receive xGHST as a receipt for your deposited GHST. This token
        is needed to withdraw your GHST, <b>do not trade or transfer</b>
        this token to strangers.
      </div>
    </div>
  </div>
</div>
