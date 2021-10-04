<script lang="ts">
  import { providers } from 'ethers';
  export let address;
  export let signer;

  import detectEthereumProvider from '@metamask/detect-provider';
  async function connect() {
    console.log(`zomg connect wallet plz`);
    const provider = await detectEthereumProvider();
    const enabledAccounts = await provider.enable();
    address = enabledAccounts[0];
    signer = new providers.Web3Provider(provider).getSigner();
    formatAddress = address.slice(0, 4) + '...' + address.slice(-4);
    console.warn(`CURRENT NETWORK: `, Number(provider.chainId), address);
  }

  let formatAddress;
</script>

<div
  class="{address
    ? 'bg-green-500 hover:bg-green-700'
    : 'bg-indigo-500 hover:bg-indigo-700'} rounded p-1 px-4 h-12 m-auto ml-auto mr-0 flex cursor-pointer w-32 justify-center"
  on:click={() => connect()}
>
  <div class="flex flex-col {address ? '' : 'animate-pulse'}">
    <div class="my-auto font-semibold text-center">
      {address ? formatAddress : 'Connect'}
    </div>
    <div class="text-xs mx-auto">
      {#if address} Connected {/if}
    </div>
  </div>
</div>
