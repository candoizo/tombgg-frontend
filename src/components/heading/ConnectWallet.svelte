<script lang="ts">
  export let wallet = '';
  export let connect;
</script>

<div
  class="{wallet
    ? 'bg-green-400 hover:bg-green-300'
    : 'bg-indigo-400 hover:bg-indigo-300'} rounded p-1 px-4 h-12 m-auto ml-auto mr-0 flex cursor-pointer w-36 md:w-48 justify-center"
  on:click={() => connect()}
>
  <div class="flex flex-col {wallet ? '' : 'animate-pulse'}">
    <div class="my-auto font-semibold md:hidden text-center">
      {wallet || 'Connect'}
    </div>
    <div class="my-auto font-semibold hidden md:flex">
      {wallet || 'Connect Wallet'}
    </div>
    <div class="text-xs mx-auto">{wallet && 'Connected'}</div>
  </div>
</div>
