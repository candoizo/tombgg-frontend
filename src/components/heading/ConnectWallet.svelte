<script lang="ts">
  import detectEthereumProvider from '@metamask/detect-provider';
  import { formatEther } from '@ethersproject/units';
  import { Web3Provider } from '@ethersproject/providers';
  import { contracts } from '../../ts';
  export let address;
  export let signer;
  export let balances;

  const connect = async () => {
    console.log(`zomg connect wallet plz`);
    const provider = await detectEthereumProvider();
    const enabledAccounts = await provider.enable();
    address = enabledAccounts[0];
    signer = new Web3Provider(provider).getSigner();
    formatAddress = address.slice(0, 4) + '...' + address.slice(-4);
    console.warn(`CURRENT NETWORK: `, Number(provider.chainId), address);

    await updateBalances();
    console.log(`user ghst allowance for chef:`, balances);
  };

  export const updateBalances = async () => {
    const { ghst, chef } = contracts();

    const ghstInfo = {
      allowance: parseFloat(
        formatEther(await ghst.allowance(address, chef.address))
      ),
      balance: parseFloat(formatEther(await ghst.balanceOf(address)))
    };

    const chefInfo = {
      allowance: parseFloat(
        formatEther(await chef.allowance(address, chef.address))
      ),
      balance: parseFloat(formatEther(await chef.balanceOf(address)))
    };

    balances = { ghst: ghstInfo, chef: chefInfo };

    console.log(`user ghst allowance for chef:`, balances, await chef.profit());
  };

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
