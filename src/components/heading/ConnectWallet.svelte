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
  let showDropdown = false;
</script>

<div class="flex justify-between w-full xs:w-auto xs:ml-auto uppercase">
  <div class="relative inline-block text-left my-auto flex xs:hidden">
    <div>
      <button
        type="button"
        class="inline-flex uppercase justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-sm"
        id="menu-button"
        aria-expanded={showDropdown}
        aria-haspopup={showDropdown}
        on:click={() => {
          showDropdown = !showDropdown;
        }}
      >
        {view}
        <!-- Heroicon name: solid/chevron-down -->
        <svg
          class="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!--
    Dropdown menu, show/hide based on menu state.

    Entering: "transition ease-out duration-100"
      From: "transform opacity-0 scale-95"
      To: "transform opacity-100 scale-100"
    Leaving: "transition ease-in duration-75"
      From: "transform opacity-100 scale-100"
      To: "transform opacity-0 scale-95"
  -->
    <div
      class="
      {showDropdown
        ? ''
        : 'hidden'} origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabindex="-1"
    >
      <div class="py-1" role="none">
        <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
        <div
          href="#"
          class="text-gray-700 block px-4 py-2 text-sm cursor-pointer {view ===
          'staking'
            ? 'underline'
            : ''}"
          role="menuitem"
          tabindex="-1"
          id="menu-item-0"
          on:click={() => {
            view = 'staking';
            showDropdown = false;
          }}
        >
          Staking
        </div>
        <div
          href="#"
          class="text-gray-700 block px-4 py-2 text-sm cursor-pointer {view ===
          'tickets'
            ? 'underline'
            : ''}"
          role="menuitem"
          tabindex="-1"
          id="menu-item-1"
          on:click={() => {
            view = 'tickets';
            showDropdown = false;
          }}
        >
          Tickets
        </div>
      </div>
    </div>
  </div>

  <div
    class=" p-1 px-4 h-12 mx-2 my-auto cursor-pointer w-20 md:w-32 justify-center rounded hover:bg-gray-900
    {view === 'staking' ? 'underline' : ''} hidden xs:flex"
    on:click={() => (view = 'staking')}
  >
    <div class="my-auto">Staking</div>
  </div>
  <div
    class="rounded p-1 px-4 h-12 mx-2 my-auto cursor-pointer w-20 md:w-32 justify-center rounded hover:bg-gray-900
    {view === 'tickets' ? 'underline' : ''} hidden xs:flex"
    on:click={() => (view = 'tickets')}
  >
    <div class="my-auto">Tickets</div>
  </div>

  <div
    class="{address
      ? 'bg-green-500 hover:bg-green-700'
      : 'bg-pink-600 hover:bg-pink-800'} rounded p-1 px-4 h-12 mx-2 my-auto flex cursor-pointer w-28 sm:w-32 justify-center"
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
