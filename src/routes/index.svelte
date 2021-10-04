<script context="module" lang="ts">
  import { getProps, contracts, approve, ticketCosts } from '../ts';
  export async function load() {
    const ghstPerThousandFrens = 1.5;
    const tickets = await ticketCosts(ghstPerThousandFrens);
    const pro = await getProps();
    console.log(pro);
    return {
      status: 200,
      props: {
        ticketPrices: tickets,
        ...pro
      }
    };
  }
</script>

<!-- props available here -->
<script lang="ts">
  import '../app.scss';
  import Header from '../components/heading/Header.svelte';
  import Navbar from '../components/Navbar.svelte';
  import Alert from '../components/Alert.svelte';

  import StakeDash from '../components/stake/Dash.svelte';
  import Stake from '../components/stake/Stake.svelte';
  import StakeInterface from '../components/stake/Interface.svelte';

  import TicketHeader from '../components/shop/Header.svelte';
  import TicketFields from '../components/shop/TicketFields.svelte';

  let user = { active: 'stake', account: '' };
  export let accountSigner;
  export let userAccount;
  export let userBalance;
  export let userStake;
  export let totalCost;
  export let ticketchef;
  export let ticketPrices;
  export let pendingTx;
  export let ticketAmounts = Object.fromEntries(
    Object.keys(ticketPrices).map((key) => [key, 0])
  );
  let stakeAmount = '';

  import { utils } from 'ethers';

  async function buyTickets() {
    console.log('Buying tickets! zomg', ticketPrices, ticketAmounts);
    const tx = await ticketchef.swapStakeForTickets(
      Object.keys(ticketAmounts),
      Object.values(ticketAmounts)
    );
    console.log(`Approve tx: `, tx);
    pendingTx = tx.hash;
    const conf = await tx.wait();
    console.log(`Approve conf: `, conf);
  }

  function updateTotal() {
    console.log(`zomg changed buy field plz`, ticketPrices, ticketAmounts);
    let total = 0;
    Object.keys(ticketPrices).map((key) => {
      console.log((ticketPrices[key] * ticketAmounts[key]).toFixed(3));
      total += parseFloat((ticketPrices[key] * ticketAmounts[key]).toFixed(3));
    });
    totalCost = total;
  }

  async function updateBalances() {
    const balance = await contracts.ghst.balanceOf(userAccount);
    userBalance = utils.formatEther(balance);
    const stakeBalance = await ticketchef.balanceOf(userAccount);
    userStake = utils.formatEther(stakeBalance);
  }

  async function userApprove() {
    console.log(`zomg approve ghst:`, signer);

    const tx = await approve(signer);
    pendingTx = tx.hash;

    const conf = await tx.wait();
    console.log(`Approve conf: `, conf);
    if (conf) {
      user.approveGhstContract = true;
      updateBalances();
    }
  }

  async function stake(value?: string) {
    console.log(`zomg stake: `, value, stakeAmount);
    if (value === 'max') {
      const max = await contracts.ghst.balanceOf(userAccount);
      stakeAmount = utils.formatEther(max);
    }
    if (stakeAmount > 0) {
      const testStake = utils.parseEther(stakeAmount.toString());
      console.log(testStake);
      const tx = await ticketchef.enter(testStake);
      console.log(`Stake tx: `, tx);
      pendingTx = tx.hash;
      const conf = await tx.wait();
      console.log(`Stake conf: `, conf);
      if (conf) {
        // reload balances
        updateBalances();
        stakeAmount = '';
      }
    }
  }

  async function unstake(value?: string) {
    console.log(`zomg unstake: `, value, stakeAmount);
    if (value === 'max') {
      const max = await ticketchef.balanceOf(userAccount);
      stakeAmount = utils.formatEther(max);
    }
    if (stakeAmount > 0) {
      const testStake = utils.parseEther(stakeAmount.toString());
      console.log(testStake);
      const tx = await ticketchef.leave(testStake);
      console.log(`Unstake tx: `, tx);
      pendingTx = tx.hash;
      const conf = await tx.wait();
      console.log(`Unstake conf: `, conf);
      if (conf) {
        // reload balances
        updateBalances();
        stakeAmount = '';
      }
    }
  }

  let view = 'stake';

  let signer;

  let address;
</script>

<Header bind:address bind:signer />

<Navbar bind:view />

<div class="w-4/5 mx-auto mt-4">
  {#if view === 'stake'}
    <StakeDash />

    <Stake bind:signer />

    <Alert hash={pendingTx} />
  {:else if view === 'tickets'}
    <div class="bg-gray-900 rounded-lg p-4">
      <TicketHeader {buyTickets} {address} {totalCost} />
      <TicketFields
        {ticketPrices}
        {ticketAmounts}
        onChange={() => updateTotal()}
      />
    </div>
  {/if}
</div>

<style lang="scss">
  :global(body) {
    background: rgb(37, 18, 77);
    max-width: 650px;
    margin: auto;
    padding: 0 16px;
    color: white;
    overflow-y: hidden;
  }
</style>
