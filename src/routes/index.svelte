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

  import StakeInterface from '../components/stake/Interface.svelte';
  import TicketHeader from '../components/shop/Header.svelte';
  import TicketFields from '../components/shop/TicketFields.svelte';

  let user = { active: 'stake', account: '' };
  export let accountSigner;
  export let userAccount;
  export let userBalance;
  export let userStake;
  export let contractAddress;
  export let ticketPrices;
  export let totalCost;
  export let ticketchef;
  export let ticketAmounts = Object.fromEntries(
    Object.keys(ticketPrices).map((key) => [key, 0])
  );
  let stakeAmount = '';

  import { utils, Contract, providers } from 'ethers';
  import detectEthereumProvider from '@metamask/detect-provider';

  export let pendingTx;
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

  async function connectWallet() {
    console.log(`zomg connect wallet plz`);
    const provider = await detectEthereumProvider();
    console.warn(`CURRENT NETWORK: `, Number(provider.chainId));
    const enabledAccounts = await provider.enable();
    accountSigner = new providers.Web3Provider(provider).getSigner();
    contractAddress = '0x6c383Ef7C9Bf496b5c847530eb9c49a3ED6E4C56';
    ticketchef = new Contract(
      contractAddress,
      [
        'function enter(uint256 _amount)',
        'function leave(uint256 _amount)',
        'function swapStakeForTickets(uint256[] calldata _ticketTypes,uint256[] calldata _ticketValues)',
        'function balanceOf(address _owner) external view returns (uint256 balance_)'
      ],
      accountSigner
    );
    if (enabledAccounts && enabledAccounts.length > 0) {
      const firstAccount = enabledAccounts[0];
      userAccount = firstAccount;
      user.account = firstAccount.slice(0, 4) + '...' + firstAccount.slice(-4);
      console.log(accountSigner, enabledAccounts);

      // check if ghst is approved
      if (!contractAddress) contractAddress = firstAccount;
      const approve = await contracts.ghst.allowance(
        firstAccount,
        contractAddress
      );
      console.log(
        `Account is approved to spend ghst?`,
        approve
        // providers.getSigner(firstAccount)
      );
      user.approveGhstContract = approve.gt(0);
      updateBalances();
    }
  }

  async function updateBalances() {
    const balance = await contracts.ghst.balanceOf(userAccount);
    userBalance = utils.formatEther(balance);
    const stakeBalance = await ticketchef.balanceOf(userAccount);
    userStake = utils.formatEther(stakeBalance);
  }

  async function userApprove() {
    console.log(`zomg approve ghst:`, accountSigner);

    const tx = await approve(accountSigner);
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

  let current_view = 'stake';
  const toggle = (test: string) => (current_view = test);
</script>

<Header connect={() => connectWallet()} wallet={user.account} />

<Navbar {toggle} />

<div class="w-4/5 mx-auto mt-4">
  {#if current_view === 'stake'}
    <StakeInterface
      {userBalance}
      {userStake}
      {stakeAmount}
      allowance={user.approveGhstContract}
      approve={() => userApprove()}
      {stake}
      {unstake}
    />
    <Alert hash={pendingTx} />
  {/if}
  {#if current_view === 'tickets'}
    <TicketHeader {buyTickets} {userBalance} {totalCost} />
    <TicketFields
      {ticketPrices}
      {ticketAmounts}
      onChange={() => updateTotal()}
    />
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
