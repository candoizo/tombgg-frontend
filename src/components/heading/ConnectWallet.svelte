<script lang="ts">
  export let wallet;
  export let connect;

  export let address = '';
  let formatAddress;
  import detectEthereumProvider from '@metamask/detect-provider';
  async function connect2() {
    console.log(`zomg connect wallet plz`);
    const provider = await detectEthereumProvider();
    console.warn(`CURRENT NETWORK: `, Number(provider.chainId));
    const enabledAccounts = await provider.enable();
    // new providers.Web3Provider(provider).getSigner();
    address = enabledAccounts[0];
    console.log(address);
    formatAddress = address.slice(0, 4) + '...' + address.slice(-4);
  }
</script>

<div
  class="{address
    ? 'bg-green-500 hover:bg-green-700'
    : 'bg-indigo-500 hover:bg-indigo-700'} rounded p-1 px-4 h-12 m-auto ml-auto mr-0 flex cursor-pointer w-36 md:w-48 justify-center"
  on:click={() => connect2()}
>
  <div class="flex flex-col {address ? '' : 'animate-pulse'}">
    <div class="my-auto font-semibold md:hidden text-center">
      {address ? formatAddress : 'Connect'}
    </div>
    <div class="my-auto font-semibold hidden md:flex">
      {address ? formatAddress : 'Connect Wallet'}
    </div>
    <div class="text-xs mx-auto">{address && 'Connected'}</div>
  </div>
</div>
