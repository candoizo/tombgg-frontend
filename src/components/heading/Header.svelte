<script lang="ts">
  import ConnectWallet from './ConnectWallet.svelte';
  // import Links from './Links.svelte';
  export let address;
  export let signer;
  export let balances;
  export let updateBalances;
  export let view;
</script>

<div
  class="top-0 aboslute w-full flex flex-col justify-between mx-auto bg-gray-800 rounded py-2 px-4 shadow-2xl select-none"
>
  <div class="flex mx-auto w-full lg:w-4/5 xl:w-3/5">
    <div class="flex">
      <img src="/ghst.gif" class="object-contain" width="40" height="40" />
      <div class="flex flex-col justify-around ml-2">
        <div class="my-auto text-xl font-bold hidden sm:flex">tomb.gg</div>
        <div class="my-auto text-sm hidden sm:flex italic">
          a vault for all your FRENS
        </div>
      </div>
    </div>

    <ConnectWallet
      bind:address
      bind:signer
      bind:balances
      bind:updateBalances
      bind:view
    />
  </div>
  <!-- <Links /> -->
</div>
