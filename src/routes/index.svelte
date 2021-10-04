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

  // async function connect() {
  //   console.log(`zomg connect wallet plz`);
  //   const provider = await detectEthereumProvider();
  //   console.warn(`CURRENT NETWORK: `, Number(provider.chainId));
  //   const enabledAccounts = await provider.enable();
  //   accountSigner = new providers.Web3Provider(provider).getSigner();
  //   contractAddress = '0x6c383Ef7C9Bf496b5c847530eb9c49a3ED6E4C56';
  //   ticketchef = new Contract(
  //     contractAddress,
  //     [
  //       'function enter(uint256 _amount)',
  //       'function leave(uint256 _amount)',
  //       'function swapStakeForTickets(uint256[] calldata _ticketTypes,uint256[] calldata _ticketValues)',
  //       'function balanceOf(address _owner) external view returns (uint256 balance_)'
  //     ],
  //     accountSigner
  //   );
  //   if (enabledAccounts && enabledAccounts.length > 0) {
  //     const firstAccount = enabledAccounts[0];
  //     userAccount = firstAccount;
  //     user.account = firstAccount.slice(0, 4) + '...' + firstAccount.slice(-4);
  //     console.log(accountSigner, enabledAccounts);
  //
  //     // check if ghst is approved
  //     if (!contractAddress) contractAddress = firstAccount;
  //     const approve = await contracts.ghst.allowance(
  //       firstAccount,
  //       contractAddress
  //     );
  //     console.log(
  //       `Account is approved to spend ghst?`,
  //       approve
  //       // providers.getSigner(firstAccount)
  //     );
  //     user.approveGhstContract = approve.gt(0);
  //     updateBalances();
  //   }
  // }

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

  let view = 'stake';

  let address;
</script>

<Header bind:address />

<Navbar bind:view />

<div class="w-4/5 mx-auto mt-4">
  {#if view === 'stake'}
    <!-- <StakeInterface
      {userBalance}
      {userStake}
      {stakeAmount}
      allowance={user.approveGhstContract}
      approve={() => userApprove()}
      {stake}
      {unstake}
    /> -->

    <div class="bg-gray-900 rounded-lg flex py-4 justify-around mb-4">
      <div class="flex flex-col">
        <div class="uppercase bg-purple-800 rounded-md p-2 mb-2">
          {'🏦'} Total Deposits
        </div>
        <div class="uppercase text-center font-bold">$23,456,789</div>
      </div>
      <div class="flex flex-col">
        <div class="uppercase bg-purple-800 rounded-md p-2 mb-2">
          🚜 Total Earned
        </div>
        <div class="uppercase text-center font-bold">$56,789</div>
      </div>
    </div>

    <div class="bg-gray-900 rounded-lg flex py-4 justify-around cursor-pointer">
      <img
        class="bg-gray-800 rounded"
        src="/ghst.gif"
        width="64px"
        height="64px"
      />
      <div class="text-xl my-auto">
        <div class="font-bold text-xl my-auto">GHST V1</div>
        <div class="text-sm my-auto">Aavegotchi</div>
      </div>
      <div class="flex flex-col justify-center items-center">
        <div
          class="text-md my-auto text-pink-400 font-bold bg-indigo-900 rounded-lg text-center w-32 my-auto"
        >
          APY 1337%
        </div>
        <div class="text-xs my-auto">Auto-compound GHST + rewards!</div>
      </div>
    </div>
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
