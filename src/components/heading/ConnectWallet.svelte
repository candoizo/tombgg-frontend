<script lang="ts">
  import { aggregate } from '@makerdao/multicall';
  import detectEthereumProvider from '@metamask/detect-provider';
  import { BigNumber } from '@ethersproject/bignumber';
  import { formatEther } from '@ethersproject/units';
  import { Web3Provider } from '@ethersproject/providers';
  import { contracts, multicallConfig } from '../../ts';
  export let address;
  export let signer;
  export let balances;
  export let view;

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
    const { ghst, chef, staking } = contracts();
    const balanceQueries = [
      {
        returns: [
          ['ghstAllowance', (val: BigNumber) => parseFloat(formatEther(val))]
        ],
        target: ghst.address,
        call: ['allowance(address,address)(uint256)', address, chef.address]
      },
      {
        returns: [
          ['ghstBalance', (val: BigNumber) => parseFloat(formatEther(val))]
        ],
        target: ghst.address,
        call: ['balanceOf(address)(uint256)', address]
      },
      {
        returns: [
          ['chefAllowance', (val: BigNumber) => parseFloat(formatEther(val))]
        ],
        target: chef.address,
        call: ['allowance(address,address)(uint256)', address, chef.address]
      },
      {
        returns: [
          ['chefBalance', (val: BigNumber) => parseFloat(formatEther(val))]
        ],
        target: chef.address,
        call: ['balanceOf(address)(uint256)', address]
      },
      {
        returns: [
          [
            'stakingTickets',
            (val) => val.map((value) => parseFloat(value.toString()))
          ]
        ],
        target: staking.address,
        call: ['balanceOfAll(address)(uint256[])', address]
      }
    ];
    const r = await aggregate(balanceQueries, multicallConfig());

    const {
      ghstAllowance,
      ghstBalance,
      chefAllowance,
      chefBalance,
      stakingTickets
    } = r.results.transformed;
    balances = {
      ghst: { allowance: ghstAllowance, balance: ghstBalance },
      chef: { allowance: chefAllowance, balance: chefBalance },
      staking: { tickets: stakingTickets }
    };
    console.log(`user ghst allowance for chef:`, balances);
  };

  let formatAddress;
</script>

<div class="flex ml-auto uppercase">
  <div
    class=" p-1 px-4 h-12 mx-2 my-auto flex cursor-pointer w-32 justify-center rounded hover:bg-gray-900
    {view === 'stake' ? 'underline' : ''}"
    on:click={() => (view = 'stake')}
  >
    <div class="my-auto">Staking</div>
  </div>
  <div
    class="rounded p-1 px-4 h-12 mx-2 my-auto flex cursor-pointer w-32 justify-center rounded hover:bg-gray-900
    {view === 'tickets' ? 'underline' : ''}"
    on:click={() => (view = 'tickets')}
  >
    <div class="my-auto">Tickets</div>
  </div>

  <div
    class="{address
      ? 'bg-green-500 hover:bg-green-700'
      : 'bg-purple-600 hover:bg-purple-800'} rounded p-1 px-4 h-12 mx-2 my-auto flex cursor-pointer w-32 justify-center"
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
</div>
