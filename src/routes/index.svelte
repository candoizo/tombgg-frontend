<script context="module" lang="ts">
  import { getProps, ticketCosts } from '../ts';
  export async function load() {
    const ghstPerThousandFrens = 1.5;
    const tickets = await ticketCosts(ghstPerThousandFrens);
    return {
      status: 200,
      props: {
        ticketbook: tickets,
        ...(await getProps())
      }
    };
  }
</script>

<script lang="ts">
  // top section
  import Header from '../components/heading/Header.svelte';
  // import Navbar from '../components/Navbar.svelte';
  import Alert from '../components/Alert.svelte';

  // staking page
  import StakeDash from '../components/stake/Dash.svelte';
  import Stake from '../components/stake/Stake.svelte';

  // ticket page
  import ShopDash from '../components/shop/Dash.svelte';
  import TicketHeader from '../components/shop/Header.svelte';
  import TicketFields from '../components/shop/TicketFields.svelte';

  export let ticketbook;
  let pendingTx = '';
  let view = 'stake';
  let signer;
  let address = '';
  let buyTickets;
  let totalCost;
  let balances = {
    ghst: {
      allowance: 0,
      balance: 0
    },
    chef: {
      allowance: 0,
      balance: 0
    },
    staking: {
      tickets: Array(6).fill(0)
    }
  };
  let updateBalances;
</script>

<Header bind:address bind:signer bind:balances bind:updateBalances bind:view />

<!-- <Navbar bind:view /> -->

<div class="px-2 w-full md:w-4/5 lg:w-3/5 xl:w-2/5 mx-auto mt-4">
  {#if view === 'stake'}
    <StakeDash />
    <Stake
      title="GHST"
      subtitle="Aavegotchi single stake GHST"
      {signer}
      bind:pendingTx
      bind:balances
      {updateBalances}
    />
    <Stake
      title="GHST-USDC"
      subtitle="Aavegotchi QuickSwap GHST-USDC LP"
      {signer}
      bind:pendingTx
      bind:balances
      {updateBalances}
    />
    <Stake
      title="GHST-WETH"
      subtitle="Aavegotchi QuickSwap GHST-WETH LP"
      {signer}
      bind:pendingTx
      bind:balances
      {updateBalances}
    />
  {:else if view === 'tickets'}
    <ShopDash />
    <div class="bg-gray-800 rounded-lg p-4 shadow-xl">
      <div class="bg-gray-900 rounded-lg shadow-xl">
        <TicketHeader {buyTickets} {address} {totalCost} {signer} {balances} />
        <TicketFields
          {ticketbook}
          {signer}
          {updateBalances}
          bind:balances
          bind:buyTickets
          bind:totalCost
          bind:pendingTx
        />
      </div>
    </div>
  {/if}
  <Alert hash={pendingTx} />
</div>
