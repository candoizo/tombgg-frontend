<script lang="ts">
  import ConnectWallet from './ConnectWallet.svelte';
  import Links from './Links.svelte';

  export let connect;
  export let wallet;
</script>

<div class="mt-6 flex justify-between w-4/5 mx-auto bg-purple-800 rounded p-2">
  <template lang="pug">
a.text-4xl.text-left.font-semibold(href='/')
  .text-purple-200 ticket.shop
  .text-xs Autocompounding GHST / ticket market!
  </template>

  <ConnectWallet {connect} {wallet} />
</div>

<Links />
