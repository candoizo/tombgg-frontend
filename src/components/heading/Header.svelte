<script lang="ts">
  import ConnectWallet from './ConnectWallet.svelte';
  import Links from './Links.svelte';

  export let connect;
  export let address;
  export let signer;
</script>

<div class="mt-6 flex justify-between w-4/5 mx-auto bg-gray-900 rounded p-2">
  <template lang="pug">
a.text-4xl.text-left.font-semibold(href='/')
  .text-white ticket.shop
  .text-xs Autocompounding GHST / ticket market!
  </template>

  <ConnectWallet {connect} bind:address bind:signer />
</div>

<Links />
