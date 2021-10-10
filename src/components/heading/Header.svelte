<script lang="ts">
  import ConnectWallet from './ConnectWallet.svelte';
  // import Links from './Links.svelte';
  export let address;
  export let signer;
  export let balances;
  export let updateBalances;
</script>

<div
  class="mt-6 flex flex-col justify-between w-4/5 mx-auto bg-gray-800 rounded py-2 px-4 shadow-2xl"
>
  <div class="flex">
    <template lang="pug">
a.text-4xl.text-left.font-semibold(href='/')
  .text-white ticket.shop
  .text-xs Autocompounding GHST / ticket market!
    </template>

    <ConnectWallet bind:address bind:signer bind:balances bind:updateBalances />
  </div>
  <!-- <Links /> -->
</div>
